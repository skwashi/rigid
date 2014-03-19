function World () {
  this.gravity = new Vector(0, 0);
  
  this.bodies = [];

  this.init = function(gravity) {
    this.gravity = gravity;
  };

  // temporary objects for calculations
  this.mg = new Vector(0, 0);
}

World.prototype.applyForces = function (body) {
  this.gravity.multiply(body.mass, this.mg);
  body.force.inc(this.mg);
};

World.prototype.addBody = function (body) {
  this.bodies.push(body);
};

World.prototype.update = function (dt) {
  var mtv;
  var p, q;
  _.forEach(this.bodies, function (b) {
    b.setColliding(false);
  });
  for (var i = 0; i < this.bodies.length; i++) {
    p = this.bodies[i];
    if (p instanceof Body) {
      p.clearForces();
      this.applyForces(p);
      game.dynamics.applyForces(p);
      game.dynamics.integrate(p, dt);
    }
    p.rotate(Math.PI/4*dt); 
    for (var j = i+1; j < this.bodies.length; j++) {
      q = this.bodies[j];
      mtv = game.colHandler.collides(p, q);
      if (mtv) {
        game.colHandler.resolve(p, q, mtv);
      }
    }
  }
};

World.prototype.draw = function (ctx) {
  _.forEach(this.bodies, function (b) {
    b.drawAABB(ctx);
    b.drawDisc(ctx);
    b.draw(ctx);
  });
};
