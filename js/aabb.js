function AABB () {
  this.min = new Vector (0, 0);
  this.max = new Vector (0, 0);

  this.getX = function () {
    return this.min.x;
  };

  this.getY = function () {
    return this.min.y;
  };

  this.getWidth = function () {
    return this.max.x - this.min.x;
  };
  
  this.getHeight = function () {
    return this.max.y - this.min.y;
  };

  this.init = function () {
    this.min.init(Number.MAX_VALUE, Number.MAX_VALUE);
    this.max.init(Number.MIN_VALUE, Number.MIN_VALUE);
  };
};

AABB.prototype.expand = function (bounds) {
  this.min.setMin(bounds.min);
  this.max.setMax(bounds.max);
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
