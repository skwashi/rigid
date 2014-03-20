function Input () {
  this.toggles = {
    "p": function (game) {
      game.isPaused = ! game.isPaused;
    },
    "z": function (game) {
      game.player.align();
    },
    "x": function (game) {
      game.player.alignCentroid();
    }
  };
};
