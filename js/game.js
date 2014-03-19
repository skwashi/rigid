function Game () {
  this.ctx = null;
  this.camera = new Camera();
  this.world = new World();
  this.player = null;

  this.time = 0;
  
  // objects for use in calculations
  this.temp = {dir: new Vector(0, 0)};
};

Game.prototype.init = function (ctx) {
  this.ctx = ctx;
  this.world.init(defaults.gravity);
  this.camera.init(ctx, this.world,
                   defaults.campos, defaults.scale);
  this.time = Date.now();
  
  this.initPlayer();
  this.initObjects();
};

Game.prototype.initPlayer = function () {
  var triangle = new PolygonDef([new Vector(0, 0), new Vector(10, 10), new Vector(10, 0)], "red");
  var fd = new FixtureDef(triangle, 1, 0, 1);
  var ox = 10;
  var oy = 0;
  var player = new Body([fd.createFixture(new Vector(ox+5, oy-5)),
                         fd.createFixture(new Vector(ox+5, oy+5), Math.PI/2),
                         fd.createFixture(new Vector(ox-5, oy+5), Math.PI),
                         fd.createFixture(new Vector(ox-5, oy-5), 3*Math.PI/2)]);
  player.init(new Vector(50, 36), 0, new Vector (0, 0), 0, 0);
  
  this.world.addBody(player);
  this.player = player;
};

Game.prototype.initObjects = function () {
  var poly;
  var sides = 0;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (i % 2 == 0 && j % 2 == 1 ||
          i % 2 == 1 && j % 2 == 0) {
        var rdef = new RegularPolygonDef(3+sides, 5, "red");
        poly = new Polygon(rdef, new Vector(10+20*j, 7.5+15*i));
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
    this.player.rotate(-this.temp.dir.x*Math.PI/2 * dt);
  } else {
    this.temp.dir.rotate(this.camera.angle);
    this.player.translate(this.temp.dir);
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
