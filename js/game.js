function Game () {
  this.ctx = null;
  this.ctxWidth = 0;
  this.ctxHeight = 0;
  this.time = 0;

  this.world = new World();
  this.player = null;

  // objects for use in calculations
  this.temp = {dir: new Vector(0, 0)};
};

Game.prototype.init = function (ctx) {
  this.ctx = ctx;
  this.ctxWidth = ctx.canvas.width;
  this.ctxHeight = ctx.canvas.height;
  this.world.init(0);
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
  if (keys["q"])
    this.player.align();
  if (keys["w"])
    this.player.alignCentroid();
};

Game.prototype.handlePlayerInput = function (dt) {
  if (keys["up"])
    this.temp.dir.y += 1;
  if (keys["down"])
    this.temp.dir.y -= 1;
  if (keys["left"])
    this.temp.dir.x -= 1;
  if (keys["right"])
    this.temp.dir.x += 1;

  var rotation = 0;

  if (keys["a"])
    rotation += Math.PI/2*dt;
  if (keys["d"])
    rotation -= Math.PI/2*dt;
  
  if (keys["shift"]) {
    this.player.translateLocal(this.temp.dir);
    this.player.rotatePos(rotation);
  }
  else {
    this.player.translate(this.temp.dir);
    this.player.rotate(rotation);
  }

};

Game.prototype.update = function () {
  var now = Date.now();
  var dt = (now - this.time)/1000;
  this.time = now;
  this.frameReset();
  this.handleAdminInput(dt);
  this.handlePlayerInput(dt);
  this.world.update(dt);
};

Game.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
  this.ctx.fillStyle = "rgba(0, 100, 255, 0.2)";
  this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
  this.world.draw(this.ctx);
};
