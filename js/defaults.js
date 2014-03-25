function Settings () {
  this.width = 800;
  this.height = 600;
  this.tileWidth = 5;
  this.tileHeight = 5;
  this.campos = new Vector(0, 0);
  this.color = "rgba(0, 100, 255, 0.2)"; //0x0064ff;
  this.alpha = 0.2;
  this.lineColor = "rgba(10, 150, 20, 0.6)";
  this.canvas = "canvas";
  this.hudCanvas = "hud";
  this.hudColor = "green";
  this.gravity = new Vector(0, 0);
  this.scale = 4;
  this.gradients = {};
  this.restitution = 1;
  this.renderer = "pixi";
};

Settings.prototype.createGradient = function(name, ctx, from_x, from_y, to_x, to_y) {
  var amb = ctx.createLinearGradient(from_x, from_y, to_x, to_y);
  amb.addColorStop(1, "rgba(0,4,50,0.4");
  amb.addColorStop(0.5, "rgba(0,2,25,0.4)");
  amb.addColorStop(0.2, "rgba(0,1,13,0.4)");
  amb.addColorStop(0, "black");
  this.gradients[name] = amb;
};
var defaults = new Settings();

/*
var defaults = {
  campos: new Vector(0, 0),
  color: "rgba(0, 100, 255, 0.2)",
  canvas: "canvas",
  gravity: 0,
  scale: 8
};
*/
