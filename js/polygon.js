function PolygonDef(vectors, color) {
  this.vertices = vectors;
  this.color = color;
  this.centroid = new Vector(0, 0);
  this.radius = 0;
  this.area = 0;
  this.inertia = 0;

  // Calculate static properties
  this.computeCentroid();
  this.computeRadius();
  this.computeArea();
  this.computeInertia();  
};
PolygonDef.prototype.createShape = function (position, angle) {
  return new Polygon(this, position, angle);
};

PolygonDef.prototype.computeCentroid = function () {
  this.centroid.init(0, 0);
  _.forEach(this.vertices, function (vtx) {this.centroid.inc(vtx);}, this);
  this.centroid.div(this.vertices.length);
};

PolygonDef.prototype.computeRadius = function () {
  var r2 = 0;
  _.forEach(this.vertices, function (vtx) {
    r2 = Math.max(r2, vtx.distanceSquared(this.centroid));
  }, this);
  this.radius = Math.sqrt(r2);
};

PolygonDef.prototype.computeArea = function () {
  var a = 0;
  var len = this.vertices.length;
  // x0 * (y1 - y-1) = x0 * (y1 - yl)
  a += this.vertices[0].x * (this.vertices[1].y - 
                             this.vertices[len-1].y);
  for (var i = 1; i < len-1; i++) {
    a += this.vertices[i].x * (this.vertices[i+1].y - 
                               this.vertices[i-1].y);
  }
  // xl * (y0 - yl-1)
  a += this.vertices[len-1].x * (this.vertices[0].y -
                                 this.vertices[len-2].y);
  this.area = Math.abs(a/2);
};

PolygonDef.prototype.computeInertia = function () {
  var num = 0;
  var den = 0;
  var len = this.vertices.length;
  var a, b;
  var u = new Vector(0,0); 
  var v = new Vector(0,0);
  for (var i = 0, j = len-1; i < len; j = i, i++) {
    //u = this.vertices[i];
    //v = this.vertices[j];
    this.vertices[i].subtract(this.centroid, u);
    this.vertices[j].subtract(this.centroid, v);
    a = Math.abs(u.cross(v));
    b = u.dot(u) + u.dot(v) + v.dot(v);
    num += a*b;
    den += a;
  }
  this.inertia = (num/den) / 6;/* - 
    this.centroid.length()*this.centroid.length();*/
};

function RegularPolygonDef(n, radius, color) {
  var vertices = [];
  var da = Math.PI * 2/n;
  var a = 0;
  for (var i = 0; i < n; i++) {
    vertices.push(new Vector(radius * Math.cos(a), radius * Math.sin(a)));
    a += da;
  };
  PolygonDef.call(this, vertices, color);
};
RegularPolygonDef.prototype = Object.create(PolygonDef.prototype);


function RectangleDef(x, y, w, h, color) {
  var vectors = [new Vector(x,y), new Vector(x+w, y),
                 new Vector(x+w,y+h), new Vector(x, y+h)];
  PolygonDef.call(this, vectors, color);
};
RectangleDef.prototype = Object.create(PolygonDef.prototype);

RectangleDef.prototype.createShape = function (position, angle) {
  return new Rectangle(this, position, angle);
};

function Polygon(polygonDef, position, angle) {
  Shape.call(this);
  this.isPolygon = true;

  // clone definition
  this.vertices = [];
  _.forEach(polygonDef.vertices, function (vtx, i) {
    this.vertices[i] = vtx.clone();
  }, this);

  this.color = polygonDef.color;
  this.centroid = polygonDef.centroid.clone();
  this.radius = polygonDef.radius;
  this.area = polygonDef.area;
  this.inertia = polygonDef.inertia;
  this.edges = [];
  this.normals = [];
  this.updated = false;

  // initialize stuff

  if (position != undefined)
    this.moveTo(position);
  if (angle != undefined)
    this.rotate(angle);
  this.computeAABB();  
  this.computeEdges();
  this.computeNormals();
};
Polygon.prototype = Object.create(Shape.prototype);

Polygon.prototype.computeCentroid = function () {
  this.centroid.init(0, 0);
  _.forEach(this.vertices, function (vtx) {this.centroid.inc(vtx);}, this);
  this.centroid.div(this.vertices.length);
};

Polygon.prototype.computeAABB = function () {
  this.aabb.init();
  
  _.forEach(this.vertices, function (v) {
    this.aabb.min.setMin(v);
    this.aabb.max.setMax(v);
  }, this);
};

Polygon.prototype.computeEdges = function () {
  var p1, p2;

  this.edges = [];
  for (var j = 0, len = this.vertices.length; j < len; j++) {
    p1 = this.vertices[j];
    p2 = this.vertices[(j+1) % len];
    this.edges.push(new Edge(p1, p2));
  }
};

Polygon.prototype.computeNormals = function () {
  if (this.normals.length == 0)
    for (var j = 0; j < this.edges.length; j++)
      this.normals[j] = new Vector(0, 0);
  for (var i = 0; i < this.edges.length; i++) {
    this.edges[i].normal(this.normals[i]);
  }
  this.updated = true;
};

Polygon.prototype.intersectedRay = function (ray) {
  var idx = 0;
  var res;
  for (var i = 0; i < this.edges.length; i++) {
    res = this.edges[i].intersectedRay(ray, this.points[idx]);
    if(res)
      idx++;
    if (idx > 1)
      break;
  };
  if (idx == 0)
    return false;
  else if (idx == 1)
    return [this.points[0]];
  else
    return this.points;
};

Polygon.prototype.translate = function (vector) {
  this.centroid.inc(vector);
  _.forEach(this.vertices, function (vtx) {vtx.inc(vector);});
  this.aabb.translate(vector);
};

Polygon.prototype.scale = function (s) {
  this.transform(s, 0, 0, s);
};

Polygon.prototype.transform = function (a, b, c, d, o) {
  var p = this.centroid;
  if (o != undefined) {
    this.centroid.transform(a, b, c, d, o);
    p = o;
  }
  _.forEach(this.vertices, function (vtx) {vtx.transform(a, b, c, d, p);});
  this.computeAABB();
  this.updated = false;
};

Polygon.prototype.rotate = function (angle, pivot) {
  var p = this.centroid;
  if (pivot != undefined) {
    this.centroid.rotate(angle, pivot);
    p = pivot;
  }
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var dx, dy;
  _.forEach(this.vertices, function (vtx) {
    dx = vtx.x - p.x;
    dy = vtx.y - p.y;
    vtx.x = c*dx - s*dy + p.x;
    vtx.y = s*dx + c*dy + p.y;
  });
  this.computeAABB();
  this.updated = false;
};

Polygon.prototype.draw = function (ctx, stroke) {
  ctx.beginPath();
  ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
  _.forEach(this.vertices, function (vtx) {ctx.lineTo(vtx.x, vtx.y);});
  ctx.closePath();
  if (stroke) {
    ctx.strokeStyle = this.color;//this.colliding ? "black" : this.color;
    ctx.stroke();
  } else {
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  //this.computeNormals();
  //this.drawNormals(ctx);
};

Polygon.prototype.drawNormals = function (ctx) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  _.forEach(this.vertices, function (vtx, i) {
    if (this.normals[i] != undefined) {
      ctx.beginPath();
      ctx.moveTo(vtx.x, vtx.y);
      ctx.lineTo(vtx.x + 5*this.normals[i].x, 
                 vtx.y + 5*this.normals[i].y);
      ctx.closePath();
      ctx.stroke();
    }
  }, this);
};

Polygon.prototype.project = function (axis, out) {
  var min = this.vertices[0].dot(axis);
  var max = min;

  var p;
  for (var i = 1; i < this.vertices.length; i++) {
    p = this.vertices[i].dot(axis);
    if (p < min)
      min = p;
    else if (p > max)
      max = p;
  }

  out.min = min;
  out.max = max;
};


function Rectangle(rectangleDef, position, angle) {
  Polygon.call(this, rectangleDef, position, angle);

};
Rectangle.prototype = Object.create(Polygon.prototype);

Rectangle.prototype.computeNormals = function () {
  if (this.normals.length == 0) {
    this.normals[0] = new Vector(0, 0);
    this.normals[1] = new Vector(0, 0);
  }

  this.edges[0].normal(this.normals[0]);  
  this.edges[1].normal(this.normals[1]);  
};

Rectangle.prototype.getX = function () {return this.vertices[0].x;};
Rectangle.prototype.getY = function () {return this.vertices[0].y;};
Rectangle.prototype.getWidth = function () {return this.vertices[1].x - this.vertices[0].x;};
Rectangle.prototype.getHeight = function () {return this.vertices[3].y - this.vertices[0].y;};
