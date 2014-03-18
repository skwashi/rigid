function Material(density, friction, restitution) {
  this.density = density;
  this.friction = friction;
  this.restitution = restitution;
};

Material.prototype.createFixtureDef = function (shapeDef) {
  return new FixtureDef(shapeDef, this.density, this.friction, this.restitution);
};

Material.prototype.createFixture = function (shapeDef, position, angle) {
  var fixtureDef = this.createFixtureDef(shapeDef);
  return new Fixture(fixtureDef, position, angle);
};

function FixtureDef(shapeDef, density, friction, restitution) {
  this.shapeDef = shapeDef;
  this.density = density || 1;
  this.friction = friction || 0;
  this.restitution = restitution || 1;
  this.mass = density * shapeDef.area;
};

FixtureDef.prototype.createFixture = function (position, angle) {
  return new Fixture(this, position, angle);
};

function Fixture (fixtureDef, position, angle) {
  this.shape = fixtureDef.shapeDef.createShape(position, angle);
  this.density = fixtureDef.density;
  this.friction = fixtureDef.friction;
  this.restitution = fixtureDef.restitution;
  this.mass = fixtureDef.mass;
};

Fixture.prototype.setBody = function (body) {
  this.body = body;
};
