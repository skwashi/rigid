function Hud (ctx) {
  this.ctx = ctx;
  this.width = ctx.canvas.width;
  this.height = ctx.canvas.height;
  this.defColor = defaults.hudColor;
  this.ctx.fillStyle = this.defColor;

  // boolean toggles
  this.changed = true;
  this.showFps = false;
}

Hud.prototype.toggle = function (flag) {
  this[flag] = ! this[flag];
  this.changed = true;
};

Hud.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Hud.prototype.update = function () {
  if (this.showFps)
    this.ctx.fillText("FPS: " + ~~(10*game.fps)/10, 10, 10);
  this.ctx.fillText("Restitution: " + ~~(10*defaults.restitution)/10, 10, 25);
  this.showControls();
};

Hud.prototype.showControls = function () {
  this.ctx.fillText("p: pause simulation", 10, 40);
  this.ctx.fillText("g: show grid", 10, 50);
  this.ctx.fillText("f: show fps", 10, 60);
  this.ctx.fillText("i/o: alter global restitution", 10, 70);
  this.ctx.fillText("arrow keys: move player", 10, 90);
  this.ctx.fillText("S+arrow keys: rotate player", 10, 100);
  this.ctx.fillText("wasd: move cam", 10, 120);
  this.ctx.fillText("S+wasd: zoom/rotate cam", 10, 130);
};

Hud.prototype.draw = function () {
  if (this.changed) {
    this.clear();
    this.update();
    this.changed = false;
  }
};
