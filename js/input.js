function Input () {
  this.toggles = {
    "p": function (game) {
      game.isPaused = ! game.isPaused;
    },
    "g": function (game) {
      game.showGrid = ! game.showGrid;
    },
    "z": function (game) {
      game.player.align();
    },
    "x": function (game) {
      game.player.alignCentroid();
    },
    "f": function (game) {
      game.hud.toggle("showFps");
    }
  };
};
