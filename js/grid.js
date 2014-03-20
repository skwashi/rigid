function Grid (tileWidth, tileHeight) {
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;

  this.buckets = {statics: [], dynamics: []};
  
  this.tileMin = new Vector(0, 0);
  this.tileMax = new Vector(0, 0);
};

Grid.prototype.clearBuckets = function (type) {
  if (type != undefined)
    this.buckets[type] = [];
  else
    for (var key in this.buckets)
      if (key != "statics")
        this.buckets[key] = [];
};

Grid.prototype.setTiles = function(aabb) {
  this.tileMin.init(Math.floor(aabb.min.x / this.tileWidth), 
                Math.floor(aabb.min.y / this.tileHeight));
  this.tileMax.init(Math.floor(aabb.max.x / this.tileWidth),
                Math.floor(aabb.max.y / this.tileHeight));
};

Grid.prototype.registerObject = function (object, type) {
  var buckets = this.buckets[(type || "dynamics")];
  this.setTiles(object.aabb);
  for (var i = this.tileMin.x; i <= this.tileMax.x; i++) {
    if (buckets[i] == undefined)
      buckets[i] = [];
    for (var j = this.tileMin.y; j <= this.tileMax.y; j++) {
      if (buckets[i][j] == undefined)
        buckets[i][j] = [];
      buckets[i][j].push(object);
    }
  }
};

Grid.prototype.collidingObjects = function (type) {
  var buckets = this.buckets[type];
  var objectPairs = [];
  for (var i in buckets) {
    for (var j in buckets[i]) { 
      for (var k = 0; k < buckets[i][j].length; k ++)
        for (var l = k+1; l < buckets[i][j].length; l++)
          objectPairs.push([buckets[i][j][k], buckets[i][j][l]]);
    }
  }
  return objectPairs;
};

Grid.prototype.collidesWith = function (object, type) {
  var objects = [];
  var buckets = this.buckets[(type || "dynamics")];
  this.setTiles(object.aabb);
  for (var i = this.tileMin.x; i <= this.tileMax.x; i++)
    if (buckets[i] != undefined)
      for (var j = this.tileMin.y; j <= this.tileMax.y; j++)
        if (buckets[i][j] != undefined)
          _.forEach(buckets[i][j], function (obj) {
            if (object != obj)
              objects.push(obj);
          });
  
  return objects;
};

Grid.prototype.draw = function (ctx, aabb) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  this.setTiles(aabb);
  for (var i = this.tileMin.x; i <= this.tileMax.x; i++) {
    ctx.beginPath();
    ctx.moveTo(i*this.tileWidth, this.tileMin.y*this.tileHeight);
    ctx.lineTo(i*this.tileWidth, (this.tileMax.y+1)*this.tileHeight);
    ctx.closePath();
    ctx.stroke();
  }

  for (var j = this.tileMin.y; j <= this.tileMax.y; j++) {
    ctx.beginPath();
    ctx.moveTo(this.tileMin.x*this.tileWidth, j*this.tileHeight);
    ctx.lineTo((this.tileMax.x+1)*this.tileWidth, j*this.tileHeight);
    ctx.closePath();
    ctx.stroke();
  }
};
