var ROWS = 20
var COLS = 20

var WIDTH = 30
var HEIGHT = 30

var FRAME_TIME = 250

var KEY_NONE  = -1
var KEY_UP    = 38
var KEY_DOWN  = 40
var KEY_LEFT  = 37
var KEY_RIGHT = 39

function init(num_fragments) {
  init_data_model(num_fragments);
  init_view(num_fragments);

  // evento
  document.onkeydown = on_event;

  // llamar cada cierto tiempo a on_render
  on_frame();
  setInterval(on_frame, FRAME_TIME);
}

var data_model = {
  fragments: [],
  player: {
    x: 0,
    y: 0,
    last_movement: KEY_NONE
  }
};

function init_data_model(num_fragments) {
  data_model.player.x = Math.floor(Math.random() * ROWS);
  data_model.player.y = Math.floor(Math.random() * COLS);

  for(i = 0; i < num_fragments; ++i) {
    data_model.fragments[i] = { fragment: i+1, x: Math.floor(Math.random() * ROWS), y: Math.floor(Math.random() * COLS) }
    if(data_model.player.x == data_model.fragments[i].x && data_model.player.y == data_model.fragments[i].y)
      --i;
    else {
      for(j = 0; j < data_model.fragments.length - 1; ++j) {
        if(data_model.fragments[i].x == data_model.fragments[j].x && data_model.fragments[i].y == data_model.fragments[j].y) {
          --i; break;
        }
      }
    }


  }
}

function init_view() {
  var canvas = document.getElementById('gameview');
  var context = canvas.getContext("2d");

  // Dibujar rejilla
  for(y = 0; y < ROWS; ++y) {
    for(x = 0; x < COLS; ++x) {
      context.rect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT);
    }
  }
  context.stroke();

  // Dibujar fragmentos
  console.log(data_model.fragments)
  for (i = 0; i < data_model.fragments.length; ++i) {
    var text = "" + data_model.fragments[i].fragment;
    var x = data_model.fragments[i].x*WIDTH + WIDTH/2.0;
    var y = data_model.fragments[i].y*HEIGHT + HEIGHT/2.0;
    context.fillText(text, x, y);
  }
}

function on_frame() {
  switch(data_model.player.last_movement) {
    case KEY_UP:    data_model.player.y--; break;
    case KEY_DOWN:  data_model.player.y++; break;
    case KEY_LEFT:  data_model.player.x--; break;
    case KEY_RIGHT: data_model.player.x++; break;
  }

  data_model.player.x = Math.abs((data_model.player.x + COLS) % COLS);
  data_model.player.y = Math.abs((data_model.player.y + ROWS) % ROWS);

  var canvas = document.getElementById('gameview');
  var context = canvas.getContext("2d");

  context.fillRect(data_model.player.x * WIDTH, data_model.player.y * HEIGHT, WIDTH, HEIGHT);
}

function on_event(evento) {
  var e = window.event || evento;

  switch(data_model.player.last_movement) {
    case KEY_NONE:
      data_model.player.last_movement = e.keyCode;
    break;
    case KEY_UP: case KEY_DOWN:
      switch (e.keyCode) {
        case KEY_LEFT: case KEY_RIGHT:  data_model.player.last_movement = e.keyCode; break;
      }
    break;
    case KEY_LEFT: case KEY_RIGHT:
      switch (e.keyCode) {
        case KEY_UP: case KEY_DOWN:    data_model.player.last_movement = e.keyCode; break;
      }
    break;
  }
}
