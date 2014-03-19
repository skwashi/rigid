var game = new Game();

function init() {
  var canvas = document.getElementById(defaults.canvas);
  var ctx = canvas.getContext("2d");

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
