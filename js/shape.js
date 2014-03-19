function Shape() {
  this.isCircle = false;
  this.isPolygon = false;

  this.aabb = new AABB();
}

Shape.prototype.setColliding = function (col) {
  this.colliding = col;
};

Shape.prototype.moveTo = function (position) {
  this.translate(new Vector(position.x - this.centroid.x, 
                            position.y - this.centroid.y));
};

Shape.prototype.drawAABB = function (ctx) {
  this.aabb.draw(ctx);
};

Shape.prototype.drawDisc = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.centroid.x, this.centroid.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,200,0,0.4)";
  ctx.fill();
};
