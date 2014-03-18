function Shape() {
  this.isCircle = false;
  this.isPolygon = false;

  this.bounds = {min: new Vector(0, 0), max: new Vector(0, 0)};

  this.area = null;
  this.inertia = null;
}

Shape.prototype.setColliding = function (col) {
  this.colliding = col;
};

Shape.prototype.translate = function (vector) {
  this.bounds.min.inc(vector);
  this.bounds.max.inc(vector);
};

Shape.prototype.contains = function (vector) {
  if (vector.x > this.bounds.max.x || vector.x < this.bounds.min.x ||
      vector.y > this.bounds.max.y || vector.y < this.bounds.min.y)
    return false;
  else
    return true;
};

Shape.prototype.collides = function (shape) {
  if (shape.bounds.min.gt(this.bounds.max) ||
      shape.bounds.max.lt(this.bounds.min))
    return false;
  else
    return true;
};

Shape.prototype.moveTo = function (position) {
  this.translate(new Vector(position.x - this.centroid.x, 
                            position.y - this.centroid.y));
};

Shape.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.bounds.min.x, this.bounds.min.y);
  ctx.lineTo(this.bounds.max.x, this.bounds.min.y);
  ctx.lineTo(this.bounds.max.x, this.bounds.max.y);
  ctx.lineTo(this.bounds.min.x, this.bounds.max.y);
  ctx.closePath();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = this.color || ctx.fillStyle;
  ctx.fill();
  ctx.globalAlpha = 1;
};

Shape.prototype.drawBounds = function (ctx) {
  Shape.prototype.draw.call(this, ctx);
};

Shape.prototype.drawAABB = function (ctx) {
  Shape.prototype.draw.call(this, ctx);
};

Shape.prototype.drawDisc = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.centroid.x, this.centroid.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,200,0,0.4)";
  ctx.fill();
};
