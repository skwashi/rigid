function AABB (min, max) {
  this.min = min || new Vector (0, 0);
  this.max = max || new Vector (0, 0);
};

AABB.prototype.getX = function () {
  return this.min.x;
};

AABB.prototype.getY = function () {
  return this.min.y;
};

AABB.prototype.getWidth = function () {
  return this.max.x - this.min.x;
};

AABB.prototype.getHeight = function () {
  return this.max.y - this.min.y;
};

AABB.prototype.init = function () {
  this.min.init(Number.MAX_VALUE, Number.MAX_VALUE);
  this.max.init(-Number.MAX_VALUE, -Number.MAX_VALUE);
};

AABB.prototype.expand = function (aabb) {
  this.min.setMin(aabb.min);
  this.max.setMax(aabb.max);
};

AABB.prototype.translate = function (vector) {
  this.min.inc(vector);
  this.max.inc(vector);
};

AABB.prototype.draw = function (ctx) {
  var oldFS = ctx.fillStyle;
  ctx.fillStyle = "rgba(50, 50, 50, 0.4)";
  ctx.fillRect(this.min.x, this.min.y,
               this.max.x - this.min.x, 
               this.max.y - this.min.y);
  ctx.fillStyle = oldFS;
};

AABB.prototype.contains = function (point) {
  return !(point.x > this.max.x || point.x < this.min.x ||
           point.y > this.max.y || point.y < this.min.y);
};

AABB.prototype.intersects = function (aabb) {
  return !(aabb.min.gt(this.max) ||
           aabb.max.lt(this.min));
};
