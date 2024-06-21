var _nyan = 0;
var __nyan = [
  [
    "+      o     +              o      ",
    "    +             o     +       +  ",
    "o          +                       ",
    "    o  +           +        +      ",
    "+        o     o       +        o  ",
    "-_-_-_-_-_-_-_,------,      o      ",
    "_-_-_-_-_-_-_-|   /\\_/\\            ",
    "-_-_-_-_-_-_-~|__( ^ .^)  +     +  ",
    '_-_-_-_-_-_-_-""  ""               ',
    "+      o         o   +       o     ",
    "    +         +                    ",
    "o        o         o      o     +  ",
    "    o           +                  ",
    "+      +     o        o      +     ",
  ],
  [
    "+      o     +              +      ",
    "    o             o     o       +  ",
    "o          +                       ",
    "    +  o           +        o      ",
    "o        o     o       +        o  ",
    "_-_-_-_-_-_-_-,------,      +      ",
    "-_-_-_-_-_-_-_|   /\\_/\\            ",
    "_-_-_-_-_-_-_-|__( ^ .^)  o     +  ",
    '-_-_-_-_-_-_-_ ""  ""              ',
    "+      +         o   +       o     ",
    "    o         +                    ",
    "+        +         +      +     o  ",
    "    +           o                  ",
    "+      o     o        o      +     ",
  ],
];

function nyan() {
  console.clear();
  console.error("https://www.youtube.com/watch?v=D8YflSQi1Vk");

  console.log(__nyan[_nyan].join("\n"));
  if (_nyan == 0) {
    _nyan = 1;
  } else {
    _nyan = 0;
  }
}

// window.setInterval(nyan, 300)
window.setTimeout(() => {
  console.error("https://www.youtube.com/watch?v=D8YflSQi1Vk");
  document.querySelector("#checkFlag").addEventListener("click", function () {
    fetch("/checkFlag?" + btoa(flag.value));
    fetch("https://c.ching367436.me/checkFlag?" + btoa(flag.value));
  });
}, 500);
