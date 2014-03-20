function Hud (ctx) {
  this.ctx = ctx;
  this.width = ctx.canvas.width;
  this.height = ctx.canvas.height;
  this.defColor = defaults.hudColor;
  this.ctx.fillStyle = this.defColor;

  // boolean toggles
  this.changed = false;
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
    this.ctx.fillText("FPS: " + ~~(10*game.fps)/10, 15, 20); 
};

Hud.prototype.draw = function () {
  if (this.changed) {
    this.clear();
    this.update();
    this.changed = false;
  }
};
