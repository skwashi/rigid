function Ray(p, v) {
  this.p1 = p;
  this.e = v;

  this.vec = new Vector(0, 0);
};

Ray.prototype.intersectsRay = function (ray, point) {
  var p = this.p;
  var u = this.v;
  var q = ray.p;
  var v = ray.v;
  p.subtract(q, this.vec);
  var uv = u.cross(v);
  var upq = u.cross(this.vec);

  if (uv == 0)
    return false;
  else {
    var l = upq/uv;
    ray.v.multiply(l, this.vec);
    q.add(this.vec, point);
    return point;
  }
};

function Edge(p1, p2) {
  Ray.call(this, p1, new Vector(p2.x - p1.x, p2.y - p1.y));
  this.p2 = p2;
};
Edge.prototype = Object.create(Ray.prototype);

Edge.prototype.update = function () {
  this.p2.subtract(this.p1, this.e);
};

Edge.prototype.vector = function () {
  this.update();
  return this.e;
};

Edge.prototype.length = function () {
  this.update();
  return this.e.length();
};

Edge.prototype.normal = function (out) {
  this.update();
  this.e.perpNormal(out);
};

Edge.prototype.intersectsRay = function (ray, point) {
  this.update();
  var p = Ray.prototype.intersectsRay.call(this, ray, point);
  return p;
};


