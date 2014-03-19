function Body (fixtures, type) {
  this.fixtures = fixtures;
  this.area = 0;
  this.inertia = 0;
  this.mass = 0;
  this.center = new Vector(0, 0);
  this.radius = 0;
  this.centroid = new Vector(0, 0);
  this.position = new Vector(0, 0);

  this.force = new Vector(0, 0);
  this.torque = 0;

  this.aabb = new AABB();

  // vectors for calculation
  this.r = new Vector(0, 0);
  this.mod = new Vector(0, 0);
  
  this.init = function (position, angle, v, ω, linDamp, angDamp) {
    this.angle = angle;
    this.v = v;
    this.ω = ω;
    this.linDamp = linDamp || 0;
    this.angDamp = angDamp || 0;

    this.moveTo(position);
    this.rotate(angle, position);
  };
  
  // compute properties
  this.computeCenter();
  this.computeRadius();
  this.computeArea();
  this.computeMass();
  this.computeCentroid();
  this.computeInertia();

  this.invMass = 1 / this.mass;
  this.invInertia = 1 / this.inertia;

  // temporary

  this.computeAABB();
};

Body.prototype.computeCenter = function () {
  this.center.init(0, 0);
  _.forEach(this.fixtures, function (fx) {
    this.center.inc(fx.shape.centroid);
  }, this);
  this.center.div(this.fixtures.length);
};

Body.prototype.computeRadius = function () {
  var r = 0;
  var r0;
  _.forEach(this.fixtures, function (fx) {
    r0 = 0;
    if (fx.shape.isCircle)
      r0 = fx.shape.centroid.distance(this.center) + fx.shape.radius;
    else {
      _.forEach(fx.shape.vertices, function (vtx) {
        r0 = Math.max(r0, vtx.distance(this.center));
      }, this);
    }
    r = Math.max(r, r0);
  }, this);
  this.radius = r;
};

Body.prototype.computeArea = function () {
  this.area = propSum(this.fixtures, "area");
};

Body.prototype.computeMass = function () {
  this.mass = propSum(this.fixtures, "mass");
};

Body.prototype.computeCentroid = function () {
  this.centroid.init(0, 0);
  _.forEach(this.fixtures, function (fx) {
    fx.shape.centroid.multiply(fx.mass, this.mod);
    this.centroid.inc(this.mod);
  }, this);
  this.centroid.div(this.mass);
};

/*
 * Computes inertia using the parallell axis theorem
 * I = I_cm + m*r^2
 */
Body.prototype.computeInertia = function () {
  var r = new Vector(0, 0);
  this.inertia = _.reduce(this.fixtures, function (sum, fx) {
    fx.shape.centroid.subtract(this.centroid, r);
    return sum + fx.inertia + fx.mass * r.lengthSquared();
  }, 0, this);
};

Body.prototype.clearForces = function () {
  this.force.init(0, 0);
  this.torque = 0;
};

Body.prototype.applyForce = function (force, point) {
  this.force.inc(force);
  point.subtract(this.centroid, this.r);
  this.torque += r.cross(force);
};

Body.prototype.applyCentralForce = function (force) {
  this.force.inc(force);
};

Body.prototype.applyTorque = function (torque) {
  this.torque += torque;
};

Body.prototype.applyLinearImpulse = function (impulse, point) {
  this.impulse.multiply(this.invMass, this.mod);
  this.v.inc(this.mod);

  point.subtract(this.centroid, this.r);
  this.ω += this.invInertia * this.r.cross(impulse);
};

Body.prototype.applyAngularImpulse = function (impulse) {
  this.ω += this.invInertia * impulse;
};

// temporary

Body.prototype.computeAABB = function () {
  this.aabb.init();
  _.forEach(this.fixtures, function (fx) {
    this.aabb.expand(fx.shape.aabb);
  }, this);
};


// Very temporary

Body.prototype.translateLocal = function (vector) {
  this.center.inc(vector);
  this.centroid.inc(vector);
  _.forEach(this.fixtures, function (fx) {
    fx.shape.translate(vector);
  });
  this.aabb.translate(vector);
};

Body.prototype.translate = function (vector) {
  this.translateLocal(vector);
  this.position.inc(vector);
};

Body.prototype.rotate = function (angle, pivot) {
  var p = this.centroid;
  if (pivot != undefined) {
    this.centroid.rotate(angle, pivot);
    p = pivot;
  }
  this.center.rotate(angle, p);
  _.forEach(this.fixtures, function(fx) {
    fx.shape.rotate(angle, p);
  });
  this.computeAABB();
};

Body.prototype.rotatePos = function (angle) {
  this.rotate(angle, this.position);
};

Body.prototype.moveTo = function (point) {
  point.subtract(this.position, this.r);
  this.translate(this.r);
};

Body.prototype.transform = function (a, b, c, d, o) {
  var p = this.centroid;
  if (o != undefined) {
    this.centroid.transform(a, b, c, d, o);
    p = o;
  }
  _.forEach(this.fixtures, function (fx) {
    fx.shape.transform(a, b, c, d, p);
  });
  this.computeAABB();
};

Body.prototype.scale = function (s) {
  this.transform(s, 0, 0, s);
  this.mass *= s*s;
  this.invMass = 1/this.mass;
  this.inertia *= s*s;
  this.invInertia = 1/this.inertia;
  this.radius *= s;
};

Body.prototype.align = function () {
  this.position.set(this.centroid);
};

Body.prototype.alignCentroid = function () {
  this.position.subtract(this.centroid, this.r);
  this.translate(this.r);
  this.align();
};

/*
 * Drawing
 */
Body.prototype.drawAABB = function (ctx) {
  _.forEach(this.fixtures, function (fx) {
    fx.shape.drawAABB(ctx);
    fx.shape.drawDisc(ctx);
  });
  this.aabb.draw(ctx);
};

Body.prototype.drawDisc = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = "rgba(0,0,200,0.4)";
  ctx.fill();
};

Body.prototype.draw = function (ctx) {
  _.forEach(this.fixtures, function (fx) {
    fx.shape.draw(ctx);
  });
  this.position.draw(ctx, "blue");
  this.centroid.draw(ctx, "rgba(50,100,100,0.8)");
};

Body.prototype.setColliding = function (col) {
  _.forEach(this.fixtures, function (fxt) {
    fxt.shape.setColliding(col);
  });
};
