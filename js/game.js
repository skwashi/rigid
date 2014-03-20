function Game () {
  this.ctx = null;
  this.colHandler = new CollisionHandler();
  this.dynamics = new Dynamics();
  this.camera = new Camera();
  this.world = new World();
  this.player = null;

  this.time = 0;
  
  // objects for use in calculations
  this.temp = {dir: new Vector(0, 0)};
};

Game.prototype.init = function (ctx) {
  this.ctx = ctx;
  this.time = Date.now();
  
  this.world.init(defaults.gravity);
  this.initPlayer();
  this.initStatics();
  this.initObjects();
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
  var player = new Body([fd.createFixture(new Vector(ox+5, oy-5)),
                         fd.createFixture(new Vector(ox+5, oy+5), Math.PI/2),
                         fd.createFixture(new Vector(ox-5, oy+5), Math.PI),
                         fd.createFixture(new Vector(ox-5, oy-5), 3*Math.PI/2)]);
  player.init(new Vector(50, 36), 0, new Vector (0, 0), Math.PI/2, 1, 0);
  
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

Game.prototype.frameReset = function () {
  this.temp.dir.init(0, 0);
};

Game.prototype.handleAdminInput = function (dt) {
  if (keys["z"])
    this.player.align();
  if (keys["x"])
    this.player.alignCentroid();
};

Game.prototype.handleCameraInput = function (dt) {
  this.temp.dir.init(0, 0);

  if (keys["w"])
    this.temp.dir.y += 1;
  if (keys["s"])
    this.temp.dir.y -= 1;
  if (keys["a"])
    this.temp.dir.x -= 1;
  if (keys["d"])
    this.temp.dir.x += 1;

  if (keys["q"])
    this.camera.centerOn(this.player, dt);

  if (keys["shift"]) {
    if (!this.temp.dir.x == 0)
      this.camera.rotate(-this.temp.dir.x*Math.PI/2*dt);
    if (!this.temp.dir.y == 0)
      this.camera.incScale(this.temp.dir.y*dt/2);
  } else {
    if (!this.temp.dir.isZero())
      this.camera.translate(this.temp.dir);
  }

};

Game.prototype.handlePlayerInput = function (dt) {
  this.temp.dir.init(0, 0);

  if (keys["up"])
    this.temp.dir.y += 1;
  if (keys["down"])
    this.temp.dir.y -= 1;
  if (keys["left"])
    this.temp.dir.x -= 1;
  if (keys["right"])
    this.temp.dir.x += 1;
  
  if (keys["shift"]) {
    if (this.temp.dir.x != 0)
      this.player.applyTorque(-this.temp.dir.x*20000);
    if (this.temp.dir.y != 0)
      this.player.scale(1-(this.temp.dir.y*dt/2));
  } else {
    if (!this.temp.dir.isZero()) {
      this.temp.dir.rotate(this.camera.angle);
      this.temp.dir.scale(10000);
      this.player.applyCentralForce(this.temp.dir);
    }
  }
  
};

Game.prototype.update = function () {
  var now = Date.now();
  var dt = (now - this.time)/1000;
  this.time = now;
  this.frameReset();
  this.handleAdminInput(dt);
  this.handleCameraInput(dt);
  this.handlePlayerInput(dt);
  this.world.update(dt);
};

Game.prototype.draw = function () {
  this.camera.drawWorld();
};
