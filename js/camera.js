function Camera () {
  this.init = function (ctx, world, pos, scale) {
    this.ctx = ctx;
    this.ctxWidth = ctx.canvas.width;
    this.ctxHeight = ctx.canvas.height;
    this.world = world;
    this.defaultPos = pos.clone();
    this.defaultScale = scale;
    this.scale = scale;
    this.angle = 0;
    this.width = this.ctxWidth / scale;
    this.height = this.ctxHeight / scale;

    this.rectDef = new RectangleDef(pos.x, pos.y, this.width, this.height);
    this.rectangle = this.rectDef.createShape();

    this.pos = this.rectangle.vertices[0];

    this.followed = game.player;
    this.marked = game.player;

    this.vector = new Vector(0, 0);
    this.move = new Vector(0, 0);
    this.ray = new Ray(0, 0);

    //this.computeAABB();
    this.reset();
    defaults.createGradient("ambient", this.ctx, 0, -1000, 0, 1000);
  };

};

Camera.prototype.reset = function () {
  this.pos.set(this.defaultPos);
  this.scale = this.defaultScale;
  this.angle = 0;
  this.rectangle = this.rectDef.createShape();
  this.resetContext();
};

Camera.prototype.resetContext = function () {
  this.ctx.setTransform(this.defaultScale,0,0,-this.defaultScale,0,this.ctxHeight);
};

Camera.prototype.computeAABB = function () {
  this.aabb.min = this.pos;
  this.aabb.max.init(this.pos.x + this.width,
                     this.pos.y + this.height);  
};

Camera.prototype.translate = function (vector) {
  vector.rotate(this.angle);
  vector.scale(this.defaultScale/this.scale);
  this.rectangle.translate(vector);
  this.ctx.translate(-vector.x, -vector.y);
};

Camera.prototype.translateRect = function (vector) {
  this.rectangle.translate(vector);
  this.ctx.translate(-vector.x, -vector.y);
};

Camera.prototype.incScale = function (s) {
  this.scale *= 1+s;
  this.rectangle.scale(1/(1+s));
  this.ctx.translate(this.rectangle.centroid.x, this.rectangle.centroid.y);
  this.ctx.scale(1+s, 1+s);
  this.ctx.translate(-this.rectangle.centroid.x, -this.rectangle.centroid.y);
};

Camera.prototype.rotate = function (angle) {
  this.rectangle.rotate(angle);
  this.angle += angle;
  this.ctx.translate(this.rectangle.centroid.x, this.rectangle.centroid.y);
  this.ctx.rotate(-angle);
  this.ctx.translate(-this.rectangle.centroid.x, -this.rectangle.centroid.y);
};

Camera.prototype.moveTo = function (point) {
  point.subtract(this.rectangle.centroid, this.move);
  this.translate(this.move);
};

Camera.prototype.centerOn = function (body, dt) {
  body.position.subtract(this.rectangle.centroid, this.move);
  this.move.scale(Math.min(1,10*dt));
  this.translateRect(this.move);
};

Camera.prototype.canSee = function (body) {
  return this.rectangle.aabb.intersects(body.aabb);
};

Camera.prototype.canReallySee = function (body) {
  if (game.colHandler.collides(this.rectangle, body)) {
    this.rectangle.setColliding(false);
    return true;
  }
  else
    return false;
};

Camera.prototype.drawWorld = function () {
  this.rectangle.color = "white";
  this.rectangle.draw(this.ctx);
/*
  var amb = this.ctx.createLinearGradient(0, -1000, 0, 2000);
  amb.addColorStop(1, "rgba(0,4,50,0.4");
  amb.addColorStop(0.5, "rgba(0,2,25,0.4)");
  amb.addColorStop(0.2, "rgba(0,1,13,0.4)");
  amb.addColorStop(0, "black");
*/
  this.rectangle.color = defaults.color;
  this.rectangle.draw(this.ctx);
  this.world.draw(this.ctx);

  
  if (!this.canReallySee(this.marked))
    this.drawArrow(this.marked);
  if (this.followed.radius < 5/this.scale)
    this.drawCircle(this.followed);
};

Camera.prototype.drawArrow = function (shape) {
  var c = shape.position || shape.center || shape.centroid;
  c.subtract(this.rectangle.centroid, this.vector);
  this.ray.set(this.rectangle.centroid, this.vector);
  var points = this.rectangle.intersectedRay(this.ray);
  if (points) {
    var len1 = this.vector.length();
    var p = points[0];
    c.subtract(p, this.vector);
    var len2 = this.vector.length();
    this.vector.scale((len1-len2-2*Math.sqrt(len2/this.scale))/len2);
    //var f = Math.min(1,2/(1+Math.log(1+len2/32)/Math.LN2));
    //f = 0;
    var x = this.rectangle.centroid.x + this.vector.x;
    var y = this.rectangle.centroid.y + this.vector.y;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(p.x, p.y);
    /*
     this.ctx.lineTo(x + this.vector.x/10, 
     y + this.vector.y/10);
     */
    this.ctx.closePath();
    this.ctx.lineWidth = 6/this.scale;
    this.ctx.strokeStyle = defaults.lineColor;
    this.ctx.stroke();
  }
};

Camera.prototype.drawCircle = function (shape) {
  var c = shape.position || shape.center || shape.centroid;
  this.ctx.beginPath();
  this.ctx.arc(c.x, c.y, 15/this.scale, 0, 2*Math.PI);
  this.ctx.lineWidth = 2/this.scale;
  this.ctx.closePath();
  this.ctx.strokeStyle = "red";
  this.ctx.stroke();
};
