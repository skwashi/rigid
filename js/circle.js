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
  this.computeAABB();
}
Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.computeAABB = function () {
  this.aabb.min.init(this.centroid.x - this.radius,
                     this.centroid.y - this.radius),
  this.aabb.max.init(this.centroid.x + this.radius,
                     this.centroid.y + this.radius);
};


/***
 * c + r (cos a, sin a) = p + kv + lu
 * r (cos a, sin a) = v.(p - c) + k v.v
 * (cos a, sin a) = v.(p-c) + k |v|^2
 * r^2 = v.(p-c)^2 + k^2 |v|^4 + 2k v.(p-c) |v|^2
 */
Circle.prototype.intersectedRay = function (ray) {
  var k = ray.project(this.centroid);
  ray.e.multiply(k, ray.vec);
  ray.p1.add(ray.vec, ray.vec);
  var p = ray.vec;
  var d2 = this.centroid.distanceSquared(p);
  var r2 = this.radius*this.radius;
  if (d2 > r2)
    return false;
  else {
    var dk = Math.sqrt(this.radius*this.radius - d2);
    this.points[0].init(ray.p1.x + (k-dk)*ray.e.x,
                        ray.p1.y + (k-dk)*ray.e.y);
    this.points[1].init(ray.p1.x + (k+dk)*ray.e.x,
                        ray.p1.x + (k+dk)*ray.e.y);
    return this.points;
  }
};

Circle.prototype.translate = function (vector) {
  this.centroid.inc(vector);
  this.aabb.translate(vector);
};

Circle.prototype.scale = function (s) {
  this.radius *= s;
  this.computeAABB();
};

Circle.prototype.rotate = function (angle, pivot) {
  if (pivot != undefined) {
    this.centroid.rotate(angle, pivot);
    this.computeAABB();
  }
};

Circle.prototype.contains = function (vector) {
  return (this.centroid.distance(vector) <= this.radius);
};

Circle.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.centroid.x, this.centroid.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = this.color;
  ctx.fill();
};

Circle.prototype.project = function (axis, out) {
  var c = this.centroid.dot(axis);
  out.min = c - this.radius;
  out.max = c + this.radius;
};
