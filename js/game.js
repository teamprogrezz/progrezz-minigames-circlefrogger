var ROWS = 15
var COLS = 15

var WIDTH = 30
var HEIGHT = 30

var FRAME_TIME = 150

var KEY_NONE  = -1
var KEY_UP    = 38
var KEY_DOWN  = 40
var KEY_LEFT  = 37
var KEY_RIGHT = 39
var KEY_RESET = 82

var BORDER_SIZE = 1;

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
    init_x: 0,
    init_y: 0,
    x: 0,
    y: 0,
    last_movement: KEY_NONE,
    last_select_movement: KEY_NONE,
    alive: true,
    last_fragment_picked: 0
  },
  victory: false,
  map: null
};

function init_data_model(num_fragments) {
  data_model.player.x = data_model.player.init_x = Math.floor(Math.random() * ROWS);
  data_model.player.y = data_model.player.init_y = Math.floor(Math.random() * COLS);

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

  data_model.map = new Array(ROWS);
  for (y = 0; y < ROWS; ++y) {
    data_model.map[y] = new Array(COLS);
    for (x = 0; x < COLS; ++x) {
      data_model.map[y][x] = false;
    }
  }
  data_model.map[data_model.player.y][data_model.player.x] = true;
}

function init_view() {
  
  var canvas = document.getElementById('gameview');
  var context = canvas.getContext("2d");
  
  // Dibujar fondo
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, WIDTH * COLS, HEIGHT * ROWS);
  
  // Dibujar fragmentos
  context.fillStyle = "#000000";
  for (i = 0; i < data_model.fragments.length; ++i) {
    var text = "" + data_model.fragments[i].fragment;
    var x = data_model.fragments[i].x*WIDTH + WIDTH/2.0;
    var y = data_model.fragments[i].y*HEIGHT + HEIGHT/2.0;
    context.fillText(text, x, y);
  }
  
  // Dibujar rejilla
  context.strokeStyle = "#888888";
  for(y = 0; y < ROWS; ++y) {
    for(x = 0; x < COLS; ++x) {
      context.rect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT);
    }
  }
  context.rect(0, 0, WIDTH * COLS, HEIGHT * ROWS);
  context.stroke();
  
  // Dibujar jugador
  var image = document.createElement('img');
  image.src = "img/inicial.png";
  image.onload = function(){
    context.drawImage(image, data_model.player.x * WIDTH, data_model.player.y * HEIGHT, WIDTH, HEIGHT);
  }
  
  context.fillStyle = "#FFFFFF";
}

function reset() {
  
  data_model.player.last_movement = data_model.player.last_select_movement = KEY_NONE;
  data_model.player.alive = true;
  data_model.player.last_fragment_picked = 0;
  data_model.victory = false;
  
  data_model.player.x = data_model.player.init_x;
  data_model.player.y = data_model.player.init_y;
  
  for (y = 0; y < ROWS; ++y)
    for (x = 0; x < COLS; ++x)
      data_model.map[y][x] = false;
  data_model.map[data_model.player.y][data_model.player.x] = true;
  
  init_view();
}

function on_frame() {

  // TODO Reestructurar el código de la función
  // TODO Añadir imágenes de victoria y derrota, y de los fragmentos
  
  if (!data_model.player.alive || data_model.victory)
    return;
    
  var last_direction = data_model.player.last_movement;
  data_model.player.last_movement = data_model.player.last_select_movement;
    
  var canvas = document.getElementById('gameview');
  var context = canvas.getContext("2d");
  
  var image_file = "img/";
  switch (last_direction) {
    case KEY_NONE:
      switch (data_model.player.last_movement) {
        case KEY_UP: image_file += "extremo_sur.png"; break;
        case KEY_DOWN: image_file += "extremo_norte.png"; break;
        case KEY_LEFT: image_file += "extremo_este.png"; break;
        case KEY_RIGHT: image_file += "extremo_oeste.png"; break;
      }
    break;
    case KEY_UP:
      switch (data_model.player.last_movement) {
        case KEY_UP: image_file += "cable_vertical.png"; break;
        case KEY_LEFT: image_file += "conexion_sur_oeste.png"; break;
        case KEY_RIGHT: image_file += "conexion_sur_este.png"; break;
      }
    break;
    case KEY_LEFT:
      switch (data_model.player.last_movement) {
        case KEY_UP: image_file += "conexion_norte_este.png"; break;
        case KEY_DOWN: image_file += "conexion_sur_este.png"; break;
        case KEY_LEFT: image_file += "cable_horizontal.png"; break;
      }
    break;
    case KEY_DOWN:
      switch (data_model.player.last_movement) {
        case KEY_DOWN: image_file += "cable_vertical.png"; break;
        case KEY_LEFT: image_file += "conexion_norte_oeste.png"; break;
        case KEY_RIGHT: image_file += "conexion_norte_este.png"; break;
      }
    break;
    case KEY_RIGHT:
      switch (data_model.player.last_movement) {
        case KEY_UP: image_file += "conexion_norte_oeste.png"; break;
        case KEY_DOWN: image_file += "conexion_sur_oeste.png"; break;
        case KEY_RIGHT: image_file += "cable_horizontal.png"; break;
      }
    break;
  }
  
  var image = document.createElement('img');
  image.src = image_file;
  var last_x = data_model.player.x, last_y = data_model.player.y;
  image.onload = function(){
    context.fillRect(last_x * WIDTH + BORDER_SIZE, last_y * HEIGHT + BORDER_SIZE, WIDTH - BORDER_SIZE * 2.0, HEIGHT - BORDER_SIZE * 2.0);
    context.drawImage(image, last_x * WIDTH, last_y * HEIGHT, WIDTH, HEIGHT);
  } 
  //context.drawImage(image, data_model.player.x * WIDTH, data_model.player.y * HEIGHT, WIDTH, HEIGHT);
  
  switch(data_model.player.last_movement) {
    case KEY_UP:    data_model.player.y--; break;
    case KEY_DOWN:  data_model.player.y++; break;
    case KEY_LEFT:  data_model.player.x--; break;
    case KEY_RIGHT: data_model.player.x++; break;
  }

  data_model.player.x = Math.abs((data_model.player.x + COLS) % COLS);
  data_model.player.y = Math.abs((data_model.player.y + ROWS) % ROWS);

  if (data_model.player.last_movement != KEY_NONE) {
    if (!data_model.map[data_model.player.y][data_model.player.x]) {
      for(i = 0; i < data_model.fragments.length; ++i) { 
        var f = data_model.fragments[i];
        if(data_model.player.x == f.x && data_model.player.y == f.y) {
          if(f.fragment == data_model.player.last_fragment_picked + 1) {
            data_model.player.last_fragment_picked++
          }
          else {
            //context.fillStyle = "#FF0000";
            data_model.player.alive = false;
          }
        }
      }
      
      if (last_direction != KEY_NONE) {
        
        var image_head_file = "img/";
        var head_image = document.createElement('img');
        switch(data_model.player.last_movement) {
          case KEY_UP:    image_head_file += "extremo_norte.png"; break;
          case KEY_DOWN:  image_head_file += "extremo_sur.png"; break;
          case KEY_LEFT:  image_head_file += "extremo_oeste.png"; break;
          case KEY_RIGHT: image_head_file += "extremo_este.png"; break;
        }
        head_image.src = image_head_file;
        head_image.onload = function(){
          context.drawImage(head_image, data_model.player.x * WIDTH, data_model.player.y * HEIGHT, WIDTH, HEIGHT);
        }
      }
      data_model.map[data_model.player.y][data_model.player.x] = true;
    }
    else {
      if(data_model.player.last_fragment_picked == data_model.fragments.length
         && data_model.player.x == data_model.player.init_x
         && data_model.player.y == data_model.player.init_y) {
        //context.fillStyle = "#00FF00";
        data_model.victory = true;
      }
      //context.fillStyle = "#FF0000";
      data_model.player.alive = false;
    }
  }

  //context.fillRect(data_model.player.x * WIDTH, data_model.player.y * HEIGHT, WIDTH, HEIGHT);
}

function on_event(evento) {
  var e = window.event || evento;
  
  if (e.keyCode == KEY_RESET) {
    reset();
    return;
  }

  switch(data_model.player.last_movement) {
    case KEY_NONE:
      switch (e.keyCode) {
        case KEY_LEFT: case KEY_RIGHT: case KEY_UP: case KEY_DOWN: data_model.player.last_select_movement = e.keyCode; break;
      }
    break;
    case KEY_UP: case KEY_DOWN:
      switch (e.keyCode) {
        case KEY_LEFT: case KEY_RIGHT:  data_model.player.last_select_movement = e.keyCode; break;
      }
    break;
    case KEY_LEFT: case KEY_RIGHT:
      switch (e.keyCode) {
        case KEY_UP: case KEY_DOWN:    data_model.player.last_select_movement = e.keyCode; break;
      }
    break;
  }
}
