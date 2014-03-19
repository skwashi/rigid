function CollisionHandler () {
  this.p1 = {min: 0, max: 0};
  this.p2 = {min: 0, max: 0};
  
  this.axis = new Vector(0, 0);
  this.mtv = new Vector(0, 0);
  this.dir = new Vector(0, 0);
  this.move = new Vector(0, 0);
  this.relv = new Vector(0, 0);

  this.u1d = new Vector(0, 0);
  this.u1o = new Vector(0, 0);
  this.v1d = new Vector(0, 0);
  this.u2d = new Vector(0, 0);
  this.u2o = new Vector(0, 0);
  this.v2d = new Vector(0, 0);

};

CollisionHandler.prototype.overlap = function () {
  return !(this.p1.min > this.p2.max ||
           this.p2.min > this.p1.max);
};

CollisionHandler.prototype.getOverlap = function () {
  return Math.min(this.p1.max, this.p2.max) - Math.max(this.p1.min, this.p2.min);
};

CollisionHandler.prototype.collidesAxes = function (shape1, axes1, 
                                                    shape2, axes2) {
  var smallest = null;
  var overlap = Number.MAX_VALUE;
  var o;
  
  for (var i = 0; i < axes1.length; i++) {
    shape1.project(axes1[i], this.p1);
    shape2.project(axes1[i], this.p2);
    if (!this.overlap())
      return false;
    else {
      o = this.getOverlap();
      //console.log(this.p1.min);
      //console.log(this.p2);
      if (o < overlap) {
        overlap = o;
        smallest = axes1[i];
      }
    }
  }
  
  for (var j = 0; j < axes2.length; j++) {
    shape1.project(axes2[j], this.p1);
    shape2.project(axes2[j], this.p2);
    if (!this.overlap())
      return false;
    else {
      o = this.getOverlap();
      if (o < overlap) {
        overlap = o;
        smallest = axes2[j];
      }
    }
  }

  this.mtv.set(smallest);
  shape2.centroid.subtract(shape1.centroid, this.dir);  

  if (this.dir.dot(this.mtv) > 0)
    this.mtv.scale(-overlap);
  else
    this.mtv.scale(overlap);
  
  shape1.setColliding(true);
  shape2.setColliding(true);
  return this.mtv;
};

CollisionHandler.prototype.collidesCC = function (c1, c2) {
  c1.centroid.subtract(c2.centroid, this.axis);
  this.axis.normalize();
  return this.collidesAxes(c1, [this.axis],
                           c2, []);
};

CollisionHandler.prototype.collidesPC = function (poly, circle, flip) {
  if (!poly.updated) {
    poly.computeNormals();
  }

  var d = Number.MAX_VALUE;
  var l;
  var v;
  _.forEach(poly.vertices, function (vtx) {
    circle.centroid.subtract(vtx, this.axis);
    l = this.axis.length();
    if (l < d) {
      d = l;
      v = vtx;
    }
  }, this);
  circle.centroid.subtract(v, this.axis);
  this.axis.div(l);
  
  if (flip)
    return this.collidesAxes(circle, [this.axis],
                             poly, poly.normals);
  else
    return this.collidesAxes(poly, poly.normals,
                             circle, [this.axis]);
  
};

CollisionHandler.prototype.collidesPP = function (poly1, poly2) {
  if (!poly1.updated) {
    poly1.computeNormals();
  }

  if (!poly2.updated) {
    poly2.computeNormals();
  }

  return this.collidesAxes(poly1, poly1.normals,
                           poly2, poly2.normals);
  
};


CollisionHandler.prototype.collides = function (shape1, shape2) {
  if (!shape1.collides(shape2))
    return false;

  var col = false;
  if (shape1 instanceof Union) {
    for (var i = 0, len = shape1.shapes.length; i < len; i++) {
      col = this.collides(shape1.shapes[i], shape2);
      if (col != false)
        return col;
    }
    return false;
  } else if (shape2 instanceof Union) {
    for (var j = 0, l = shape2.shapes.length; j < l; j++) {
      col = this.collides(shape1, shape2.shapes[j]);
      if (col != false)
        return col;
    }
    return false;
  }

  if (shape1.isPolygon) {
    if (shape2.isPolygon)
      return this.collidesPP(shape1, shape2);
    else if (shape2.isCircle)
      return this.collidesPC(shape1, shape2);
    else
      return false;
  } else if (shape1.isCircle) {
    if (shape2.isCircle)
      return this.collidesCC(shape1, shape2);
    else if (shape2.isPolygon)
      return this.collidesPC(shape2, shape1, true);
    else
      return false;
  } else
    return false;
};

CollisionHandler.prototype.col = function(o1, o2) {

  return this.collides(o1.shape || o1, o2.shape || o2);
  /*
  if (o1 instanceof Movable) {
    if (o2 instanceof Movable) {
      o1.v.subtract(o2.v, this.relv);
      return this.collides(o1.shape, o2.shape);
    }
    else {
      this.relv.set(o1.v);
      return this.collides(o1.shape, o2);
    }
  } else if (o2 instanceof Movable) {
    this.relv.set(o2.v);
    this.relv.scale(-1);
    return this.collides(o1, o2.shape);
  } else {
    o2.centroid.subtract(o1.centroid, this.relv);
    return this.collides(o1, o2);
  }*/
};

CollisionHandler.prototype.resolve = function(o1, o2, mtv, cr, fr) {
  var c = (cr == undefined) ? 1 :  cr;
  var f = f || 1;
  if (o1 instanceof Movable) {
    if (o2 instanceof Movable)
      this.resolveMM(o1, o2, mtv, c, f);
    else
      this.resolveMS(o1, o2, mtv, c, f);
  } else if (o2 instanceof Movable) {
    mtv.scale(-1);
    this.resolveMS(o2, o1, mtv, c, f);
  } else {
    o1.translate(mtv);
  }
};

CollisionHandler.prototype.resolveMS = function(o, s, mtv, c, f) {
  mtv.scale(1+c);
  o.translate(mtv);
  mtv.scale(-1);
  mtv.normal(this.dir);
  this.dir.projectOut(o.v, this.u1d);
  o.v.subtract(this.u1d, this.u1o);
  this.u1d.scale(-c);
  this.u1o.scale(f);
  this.u1o.add(this.u1d, o.v);
};

CollisionHandler.prototype.resolveMM = function(o1, o2, mtv, c, f) {
  var m1 = o1.mass;
  var m2 = o2.mass;
  var u1 = o1.v;
  var u2 = o2.v;
  var pen = mtv.length();
  //o2.v.subtract(o1.v, this.dir);

  if (mtv.dot(this.dir) < 0)
    ;//console.log("weird");

  o1.translate(mtv);
  mtv.scale(-1);
  //o2.translate(mtv);
  mtv.normal(this.dir);

  this.dir.projectOut(u1, this.u1d);
  this.dir.projectOut(u2, this.u2d);
 
  u1.subtract(this.u1d, this.u1o);
  u2.subtract(this.u2d, this.u2o);

  var u1dl = this.u1d.dot(this.dir);
  var u2dl = this.u2d.dot(this.dir);
  var v1dl = (c*m2*(u2dl-u1dl) + m1*u1dl + m2*u2dl) / (m1+m2);
  var v2dl = (c*m1*(u1dl-u2dl) + m1*u1dl + m2*u2dl) / (m1+m2);
  //var v1dl = (u1dl*(m1-m2) + 2*m2*u2dl) / (m1+m2);
  //var v2dl = (u2dl*(m2-m1) + 2*m1*u1dl) / (m1+m2);

  this.dir.multiply(v1dl, this.v1d);
  this.dir.multiply(v2dl, this.v2d);
  
  this.u1o.scale(f);
  this.u2o.scale(f);
  this.u1o.add(this.v1d, o1.v);
  this.u2o.add(this.v2d, o2.v);

  var t = Math.abs(pen / (v1dl - v2dl));
  if (t <= 1/60) {
    this.v1d.multiply(t, this.move);
    o1.shape.translate(this.move);
    this.v2d.multiply(t, this.move);
    o2.shape.translate(this.move);
  }

};