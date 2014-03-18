function World () {
  this.gravity = 0;
  
  this.bodies = [];

  this.init = function(gravity) {
    this.gravity = gravity;
  };

}

World.prototype.addBody = function (body) {
  this.bodies.push(body);
};

World.prototype.update = function (dt) {
  _.forEach(this.bodies, function (b) {
    b.rotate(Math.PI/4*dt);
  });
};

World.prototype.draw = function (ctx) {
  _.forEach(this.bodies, function (b) {
    b.drawAABB(ctx);
    b.drawDisc(ctx);
    b.draw(ctx);
  });
};
