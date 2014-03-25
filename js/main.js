var game = new Game();

// Pixi stuff

var stage = new PIXI.Stage(0xFFFFFF);
var renderer = new PIXI.autoDetectRenderer(800,600, null, true, true);
//renderer.view.style.display="block";
//document.body.appendChild(renderer.view);
var graphics = new PIXI.Graphics();
stage.addChild(graphics);


function init() {

  // canvas stuff

  var canvas = document.getElementById(defaults.canvas);
  var ctx = canvas.getContext("2d");
  var hudCanvas = document.getElementById(defaults.hudCanvas);
  var hudCtx = hudCanvas.getContext("2d");
  var hud = new Hud(hudCtx);
   
  
  game.init(ctx, hud);
  render();
}

function render() {
  //requestAnimFrame(render);
  requestAnimationFrame(render);
  game.update();
  game.render();
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
