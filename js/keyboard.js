KEY_CODES = {
  16: "shift",
  17: "ctrl",
  18: "alt",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  32: "space",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  65: "a",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z" 
};

var keys = {};
for (var code in KEY_CODES) {
  keys[KEY_CODES[code]] = false;
}

document.onkeydown = function(e) {
  var keyCode = e.keyCode || e.charKode;
  if (KEY_CODES[keyCode]) {
    //e.preventDefault();
    keys[KEY_CODES[keyCode]] = true;
  }
};

document.onkeyup = function(e) {
  var keyCode = e.keyCode || e.charKode;
  if (KEY_CODES[keyCode]) {
    //e.preventDefault();
    keys[KEY_CODES[keyCode]] = false;
  }
};
