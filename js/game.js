function Game () {
  this.ctx = null;
  this.hud = null;
  this.input = new Input();
  this.colHandler = new CollisionHandler();
  this.dynamics = new Dynamics();
  this.camera = new Camera();
  this.world = new World();
  this.grid = new Grid(defaults.tileWidth, defaults.tileHeight);
  this.player = null;

  this.time = 0;
  this.fps = 0;

  // toggle booleans
  this.isPaused = false;
  this.showGrid = false;
  this.showFps = false;
  
  // objects for use in calculations
  this.vars = {dir: new Vector(0, 0), 
               playerMove: new Vector(0, 0), 
               cameraMove: new Vector(0, 0)};

  this.cd = 0.5;
  this.cooldowns = {toggle: 0};
};

Game.prototype.init = function (ctx, hud) {
  this.ctx = ctx;
  this.hud = hud;
  this.time = Date.now();
  
  this.world.init(defaults.gravity);
  this.initPlayer();
  this.initStatics();
  this.initObjects();
  this.initTestObjects();
  this.initSmalls();
  this.camera.init(ctx, this.world,
                   defaults.campos, defaults.scale);
  this.camera.moveTo(new Vector(100/2, 75/2));
};

Game.prototype.initStatics = function () {
  var cx = 100/2;
  var cy = 75/2;
  var w = 250;
  var h = 20;
  var wallDef = new RectangleDef(0, 0, w, h, defaults.color);
  this.world.addBody(wallDef.createShape(new Vector(cx, cy - (w-h)/2))); 
  this.world.addBody(wallDef.createShape(new Vector(cx + (w-h)/2, cy), Math.PI/2)); 
  this.world.addBody(wallDef.createShape(new Vector(cx, cy + (w-h)/2))); 
  this.world.addBody(wallDef.createShape(new Vector(cx - (w-h)/2, cy), 3*Math.PI/2)); 
};

Game.prototype.initPlayer = function () {
  var triangle = new PolygonDef([new Vector(0, 0), new Vector(5, 5), new Vector(5, 0)], "red");
  var fd = new FixtureDef(triangle, 1, 0, 1);
  var ox = 0;
  var oy = 0;
  var player = new Body([fd.createFixture(new Vector(ox, oy+10), 3*Math.PI/4),
    fd.createFixture(new Vector(ox+5, oy-5)),
    fd.createFixture(new Vector(ox+5, oy+5), Math.PI/2),
    fd.createFixture(new Vector(ox-5, oy+5), Math.PI),
    fd.createFixture(new Vector(ox-5, oy-5), 3*Math.PI/2)]);
  player.init(new Vector(50, 36), 0, new Vector (0, 0), 0, 1, 1000);

  this.player = player;
  this.world.addPlayer(player);
};

Game.prototype.initObjects = function () {
  var sides = 0;
  var rdef;
  var fdef;
  var poly;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (i % 2 == 0 && j % 2 == 1 ||
          i % 2 == 1 && j % 2 == 0) {
        rdef = new RegularPolygonDef(3+sides, 5, "red");
        fdef = new FixtureDef(rdef, 1, 0, 1); 
        poly = new Body([fdef.createFixture()]);
        poly.init(new Vector(10+20*j, 7.5+15*i), 0, new Vector(0, 0), Math.PI/4, 1, 0);
        this.world.addBody(poly);
        sides++;
      }
    }
  }
};

Game.prototype.initSmalls = function () {
  var rdef = new RegularPolygonDef(3, 0.1, "blue");
  var fdef = new FixtureDef(rdef, 1, 0, 1);
  var pos;
  var poly;
  for (var k = 0; k < 50; k++) {
    for (var l = 0; l < 20; l++) {
      pos = new Vector(50 - 30 + 2*k, 75+2*l);
      poly = new Body([fdef.createFixture()]);
      poly.init(pos, 0, new Vector(0, 0), 0, 0, 0);
      //poly = rdef.createShape(pos);
      this.world.addBody(poly);
    }
  }
};

Game.prototype.initTestObjects = function () {
  var rdef = new RectangleDef(0, 0, 0.5, 2, "green");
  var fdef = new FixtureDef(rdef, 100, 0 , 1);
  var body = new Body([fdef.createFixture(new Vector(0, 0))]);
  body.init(new Vector(60, 70), 0, new Vector(0, 0), 0, 0 ,0);
  this.world.addBody(body);
};

Game.prototype.handleAdminInput = function (dt) {
  for (var key in this.input.toggles) {
    if (keys[key] && this.cooldowns.toggle <= 0) {
      this.input.toggles[key](this);
      this.cooldowns.toggle = this.cd;
    }
  }
};

Game.prototype.handleCameraInput = function (dt) {
  this.vars.dir.init(0, 0);

  if (keys["w"])
    this.vars.dir.y += 1;
  if (keys["s"])
    this.vars.dir.y -= 1;
  if (keys["a"])
    this.vars.dir.x -= 1;
  if (keys["d"])
    this.vars.dir.x += 1;

  if (keys["q"])
    this.camera.centerOn(this.player, dt);

  if (keys["shift"]) {
    if (!this.vars.dir.x == 0)
      this.camera.rotate(-this.vars.dir.x*Math.PI/2*dt);
    if (!this.vars.dir.y == 0)
      this.camera.incScale(this.vars.dir.y*dt/2);
  } else {
    if (!this.vars.dir.isZero())
      this.camera.translate(this.vars.dir);
  }

};

Game.prototype.handlePlayerInput = function (dt) {
  this.vars.dir.init(0, 0);

  if (keys["up"])
    this.vars.dir.y += 1;
  if (keys["down"])
    this.vars.dir.y -= 1;
  if (keys["left"])
    this.vars.dir.x -= 1;
  if (keys["right"])
    this.vars.dir.x += 1;
  
  if (keys["shift"]) {
    if (this.vars.dir.x != 0)
      this.player.applyTorque(-this.vars.dir.x*2000);
    if (this.vars.dir.y != 0)
      this.player.scale(1-(this.vars.dir.y*dt/2));
  } else {
    if (!this.vars.dir.isZero()) {
      this.vars.dir.rotate(this.camera.angle);
      this.vars.dir.scale(1000);
      this.player.applyForce(this.vars.dir, 
                             this.player.fixtures[0].shape.centroid);
    }
  }
  
};

Game.prototype.frameReset = function () {
  this.vars.dir.init(0, 0);
};

Game.prototype.lowerCooldowns = function (dt) {
  for (var key in this.cooldowns) {
    this.cooldowns[key] -= dt;
    if (this.cooldowns[key] <= 0)
      this.cooldowns[key] = 0;
  }
};

Game.prototype.update = function () {
  var now = Date.now();
  var dt = (now - this.time)/1000;
  this.fps = 1/dt;

  if (this.hud.showFps &&
      now % 10 == 0)
    this.hud.changed = true;

  this.time = now;
  this.frameReset();
  this.lowerCooldowns(dt);
  this.handleAdminInput(dt);
  this.handleCameraInput(dt);
  if (!this.isPaused) {
    this.handlePlayerInput(dt);
    this.world.update(dt);
  }
};

Game.prototype.draw = function () {
  this.camera.drawWorld();
  if (this.showGrid)
    this.grid.draw(this.ctx, this.player.aabb);
  this.hud.draw();
};
