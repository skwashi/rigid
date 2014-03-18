var scale = 8;
var game = new Game();

function init() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  ctx.translate(0, height);
  ctx.scale(scale, -scale);

  game.init(ctx);
  render();
}

function render() {
  requestAnimationFrame(render);
  game.update();
  game.draw();
}

/**
 * requestAnimationFrame shim by Paul Irish
 */
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000/60);
    };
})();

window.onload = function() {
  init();
};
