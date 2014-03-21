function World () {
  this.gravity = new Vector(0, 0);

  this.player = null;
  this.bodies = [];
  this.statics = [];

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

World.prototype.addPlayer = function (player) {
  this.player = player;
  this.addBody(player);
};

World.prototype.addBody = function (body) {
  if (body.type == "dynamic") {
    this.bodies.push(body);
  } else {
    this.statics.push(body);
    game.grid.registerObject(body, "statics");
  }
};

World.prototype.update = function (dt) {
  var p, q;
  
  game.grid.clearBuckets();
  
  for (var i = 0; i < this.bodies.length; i++) {
    p = this.bodies[i];
    this.applyForces(p);
    game.dynamics.applyDamping(p);
    game.dynamics.integrate(p, dt);
    p.clearForces();
    game.grid.registerObject(p, "dynamics");
  }

  var mtv;
  var objects;
  /*
  for (var j = 0; j < this.bodies.length; j++) {
    p = this.bodies[j];
    objects = game.grid.collidesWith(p, "dynamics");
    _.forEach(objects, function (b) {
      mtv = game.colHandler.collides(p, b);
      if (mtv)
        game.colHandler.resolve(p, b, mtv);
    }, this);

    objects = game.grid.collidesWith(p, "statics");
    _.forEach(objects, function (b) {
      mtv = game.colHandler.collides(p, b);
      if (mtv)
        game.colHandler.resolve(p, b, mtv);
    }, this);
  }
  */
  
  _.forEach(this.statics, function (s) {
    objects = game.grid.collidesWith(s, "dynamics");
    _.forEach(objects, function (b) {
      if (b != s) {
        mtv = game.colHandler.collides(b, s);
        if (mtv)
          game.colHandler.resolve(b, s, mtv);
      }
    });
  });

  var pairs = game.grid.collidingObjects("dynamics");
  
  _.forEach(pairs, function (pair) {
    mtv = game.colHandler.collides(pair[0], pair[1]);
    if (mtv)
      game.colHandler.resolve(pair[0], pair[1], mtv);
  }, this);
  
};

World.prototype.draw = function (ctx) {
  _.forEach(this.statics, function (s) {
    if (game.camera.canSee(s))
      s.draw(ctx);
  });
  _.forEach(this.bodies, function (b) {
    if (game.camera.canSee(b)) {
      //b.drawAABB(ctx);
      //b.drawDisc(ctx);
      b.draw(ctx);
    }
  });
};
