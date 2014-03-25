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
    },
    "i": function(game) {
      defaults.restitution -= 0.1;
      if (defaults.restitution <= 0)
        defaults.restitution = 0;
    },
    "o": function(game) {
      defaults.restitution += 0.1;
      if (defaults.restitution >= 1)
        defaults.restitution = 1;
    }
  };
};
