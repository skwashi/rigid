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

    //this.computeAABB();
    this.reset();
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

Camera.prototype.canSee = function (body) {
  return this.rectangle.aabb.intersects(body.aabb);
};

Camera.prototype.drawWorld = function () {
  this.rectangle.color = "white";
  this.rectangle.draw(this.ctx);
  this.rectangle.color = "rgba(0, 100, 255, 0.2)";
  this.rectangle.draw(this.ctx);
  this.world.draw(this.ctx);
};
