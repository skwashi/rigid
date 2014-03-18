function CircleDef(center, radius, color) {
  this.centroid = center;
  this.radius = radius;
  this.color = color;
  this.area = 0;
  this.inertia = 0;

  this.computeArea();
  this.computeInertia();
};
CircleDef.prototype.createShape = function (position, angle) {
  return new Circle(this, position);
};

CircleDef.prototype.computeArea = function () {
  this.area = Math.PI * this.radius * this.radius;
};

CircleDef.prototype.computeInertia = function () {
  this.inertia = this.radius * this.radius / 2;
};


function Circle(circleDef, position) {
  Shape.call(this);
  this.isCircle = true;

  this.centroid = circleDef.centroid.clone();
  this.radius = circleDef.radius;
  this.color = circleDef.color;
  this.area = circleDef.area;
  this.inertia = circleDef.inertia;

  // initialize stuff
  this.computeBounds();
}
Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.computeBounds = function () {
  this.bounds.min.init(this.centroid.x - this.radius,
                          this.centroid.y - this.radius),
  this.bounds.max.init(this.centroid.x + this.radius,
                       this.centroid.y + this.radius);
};

Circle.prototype.translate = function (vector) {
  this.centroid.inc(vector);
  Shape.prototype.translate.call(this, vector);
};

Circle.prototype.rotate = function (angle, pivot) {
  if (pivot != undefined) {
    this.centroid.rotate(angle, pivot);
    this.computeBounds();
  }
};

Circle.prototype.contains = function (vector) {
  return (this.centroid.distance(vector) <= this.radius);
};

Circle.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.centroid.x, this.centroid.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = this.color;//this.colliding ? "black" : this.color;
  ctx.fill();
};

Circle.prototype.project = function (axis, out) {
  var c = this.centroid.dot(axis);
  out.min = c - this.radius;
  out.max = c + this.radius;
};
