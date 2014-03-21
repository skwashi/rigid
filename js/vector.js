function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.init = function (x, y) {
  this.x = x;
  this.y = y;
  return this;
};

Vector.prototype.set = function (v) {
  this.x = v.x;
  this.y = v.y;
  return this;
};

Vector.prototype.inc = function (v) {
  this.x += v.x;
  this.y += v.y;
  return this;
};

Vector.prototype.dec = function (v) {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};

Vector.prototype.scale = function (a) {
  this.x *= a;
  this.y *= a;
  return this;
};

Vector.prototype.div = function (a) {
  this.x /= a;
  this.y /= a;
  return this;
};

Vector.prototype.normalize = function () {
  var l = this.length();
  if (l != 0) {
    this.x /= l;
    this.y /= l;
  }
  return this;
};

Vector.prototype.isZero = function () {
  return (this.x == 0 && this.y == 0);
};

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.distance = function (v) {
  var x = v.x - this.x;
  var y = v.y - this.y;
  return Math.sqrt(x*x + y*y);
};

Vector.prototype.distanceSquared = function (v) {
  var x = v.x - this.x;
  var y = v.y - this.y;
  return x*x + y*y;
};

Vector.prototype.equals = function (v) {
  return this.x == v.x && this.y == v.y;
};

Vector.prototype.copy = function (out) {
  out.x = this.x;
  out.y = this.y;
};

Vector.prototype.add = function (v, out) {
  out.x = v.x + this.x;
  out.y = v.y + this.y;
};

Vector.prototype.addNew = function (v) {
  return new Vector (this.x + v.x, this.y + v.y);
};

Vector.prototype.subtract = function (v, out) {
  out.x = this.x - v.x;
  out.y = this.y - v.y;
};

Vector.prototype.subNew = function (v) {
  return new Vector (this.x - v.x, this.y - v.y);
};

Vector.prototype.length = function () {
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.lengthSquared = function () {
  return this.x*this.x + this.y*this.y;
};

Vector.prototype.multiply = function (a, out) {
  out.x = a*this.x;
  out.y = a*this.y;
};

Vector.prototype.normal = function (out) {
    var l = this.length();
    if (l != 0) {
      out.x = this.x /= l;
      out.y = this.y /= l;
    } else {
      out.x = 0;
      out.y = 0;
    }
};

Vector.prototype.setMax = function (v) {
  this.x = Math.max(this.x, v.x);
  this.y = Math.max(this.y, v.y);
};

Vector.prototype.setMin = function (v, out) {
  this.x = Math.min(this.x, v.x);
  this.y = Math.min(this.y, v.y);
};

Vector.prototype.makeNormal = function () {
  var l = this.length();
  if (l != 0)
    return new Vector(this.x / l, this.y / l);
  else
    return new Vector(0, 0);
};

Vector.prototype.rotate = function (angle, pivot) {
  var px = (pivot != undefined) ? pivot.x : 0;
  var py = (pivot != undefined) ? pivot.y : 0;
  var dx = this.x - px;
  var dy = this.y - py;
  this.x = dx*Math.cos(angle) - dy*Math.sin(angle) + px;
  this.y = dx*Math.sin(angle) + dy*Math.cos(angle) + py;
};

Vector.prototype.lt = function (v) {
  return this.x < v.x || this.y < v.y;  
};

Vector.prototype.gt = function (v) {
  return this.x > v.x || this.y > v.y;
};

Vector.prototype.transform = function(a, b, c, d, o) {
  var dx = this.x - o.x;
  var dy = this.y - o.y;
  this.x = a*dx + b*dy + o.x;
  this.y = c*dx + d*dy + o.y;
};

Vector.prototype.perp = function(out) {
  out.x = -this.y;
  out.y = this.x;
};

Vector.prototype.perpNormal = function(out) {
  out.x = -this.y;
  out.y = this.x;
  out.normalize();
};

Vector.prototype.outwardNormal = function (out) {
  out.x = this.y;
  out.y = -this.x;
  out.normalize();
};

Vector.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y;
};

Vector.prototype.cross = function (v) {
  return this.x * v.y - this.y * v.x;
};

Vector.prototype.project = function (v) {
  var d = this.dot(v);
  return new Vector(d*v.x, d*v.y);
};

Vector.prototype.projectOut = function (v, out) {
  var d = this.dot(v);
  this.multiply(d, out);
};

Vector.prototype.draw = function(ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, 1, 1);
};
