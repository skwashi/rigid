function Edge(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;

  this.e = new Vector(0, 0);
};

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
