function Ray(p, v) {
  this.p1 = p;
  this.e = v;

  this.vec = new Vector(0, 0);
};

Ray.prototype.set = function (point, vector) {
  this.p1 = point;
  this.e = vector;
};

/***
 * For rays p + ku and q + l v, 
 *   q + l v = p + k u  <=>
 *   l v - k u = p - q  <=>
 *   u x (l v - k u) = u x (p - q)  <=>
 *   l * u x v = u x (p - q), 
 * and similarly
 *   k * (v x u) = v x (q - p)
 */
Ray.prototype.intersectedRay = function (ray, point) {
  // let this ray be p + k u, the other ray q + l v
  var p = this.p1;
  var u = this.e;
  var q = ray.p1;
  var v = ray.e;
  q.subtract(p, this.vec);
  var vu = v.cross(u);
  var vqp = v.cross(this.vec);
  var uv = -vu;
  var upq = -u.cross(this.vec); 

  if (vu == 0)
    // u and v are parallel
    return false;
  else {
    var k = vqp/vu;
    var l = upq/uv;
    if (l < 0)
      return false;
    else {
      u.multiply(k, this.vec);
      // point = p + k u
      p.add(this.vec, point);
      return k;
    }
  }
};

/***
 * q = p + k v + l u, uv = 0
 * v . (q - p) = v . (kv + lu) = k||v||^2
 */
Ray.prototype.project = function (q) {
  q.subtract(this.p, this.vec);
  return this.v.dot(this.vec) / this.v.lengthSquared();
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

Edge.prototype.intersectedRay = function (ray, point) {
  this.update();
  var l = Ray.prototype.intersectedRay.call(this, ray, point);
  return (0 <= l && l <= 1) ? l : false;
};
