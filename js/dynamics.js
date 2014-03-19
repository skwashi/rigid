function Dynamics () {
  this.dv = new Vector(0, 0);
  this.dω = 0;
  this.dp = new Vector(0, 0);

  // temporary objects for calculation
  this.f = new Vector(0, 0);
  this.t = 0;
};

Dynamics.prototype.applyForces = function (body) {
  body.v.multiply(-body.linDamp, this.f);
  this.t = -body.angDamp * body.ω;
  body.force.inc(this.f);
  body.torque += this.t;
};

Dynamics.prototype.integrate = function (body, dt) {
  body.force.multiply(dt * body.invMass, this.dv);
  this.dω = body.torque * dt * body.invInertia;
  body.v.inc(this.dv);
  body.ω += this.dω;
  body.v.multiply(dt, this.dp);
  body.translate(this.dp);
  body.rotate(body.ω*dt);
};
