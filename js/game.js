
// Códigos de teclas
var KEY_NONE  = -1
var KEY_UP    = 38
var KEY_DOWN  = 40
var KEY_LEFT  = 37
var KEY_RIGHT = 39
var KEY_RESET = 82

var BORDER_SIZE = 1 // Grosor del borde
var END_LINE_SIZE_RATIO = 0.2 // Ratio del grosor de la línea de derrota
var FONT_SIZE_RATIO = 0.4 // Ratio del tamaño de fuente en relación al tamaño de casilla
var TEXT_X_RATIO = 0.25, TEXT_Y_RATIO = 0.75 // Ratio de la posición del texto
var TEXT_MAX_WIDTH_RATIO = 0.24 // Ratio del ancho máximo del texto

var FRAME_TIME = 150 // Tiempo de refresco (ms) - Determina la velocidad
var END_TIME = 100 // Retardo al finalizar el juego
var ANIMATION_TIME = 80 // Retardo entre las iluminaciones en la animación de victoria

var canvas, context // "canvas" 2D y "context" para el dibujado
var box_size // Tamaño de las casillas del tablero
var margin_x, margin_y // Márgenes de dibujado
var last_direction // Auxiliar para la dirección anterior del jugador

var success_game, failure_game // Funciones de éxito y fracaso

var background // Imagen de fondo

var img_path // Ruta relativa del directorio con las imágenes del juego

var start_x, start_y // Coordenadas de inicio de evento de toque

// Datos del juego
var data_model = {
  fragments: [],
  player: {
    init_x: 0,
    init_y: 0,
    x: 0,
    y: 0,
    first_movement: KEY_NONE,
    last_movement: KEY_NONE,
    last_select_movement: KEY_NONE,
    alive: true,
    last_fragment_picked: 0
  },
  rows: 0,
  cols: 0,
  map: null
};

function init_link_snake(success_function, failure_function, path, num_fragments, rows, cols, id_canvas) {
  
  /* Establecimiento de funciones de victoria y derrota */
  success_game = success_function;
  failure_game = failure_function;
  
  /* Almacenando ruta relativa del directorio de imágenes */
  img_path = path;
  
  /* Inicialización de datos y vista */
  init_data_model(num_fragments, rows, cols);
  init_view(id_canvas);

  /* Eventos */
  document.onkeydown = on_event_keyboard;
  document.ontouchstart = on_event_touchstart;
  document.ontouchmove = on_event_touchmove;

  /* Renderizado */
  on_frame();
  setInterval(on_frame, FRAME_TIME);
}

function init_data_model(num_fragments, rows, cols) {
  
  // Inicializar jugador
  data_model.player.x = data_model.player.init_x = Math.floor(Math.random() * cols);
  data_model.player.y = data_model.player.init_y = Math.floor(Math.random() * rows);

  // Inicializar fragmentos
  for(i = 0; i < num_fragments; ++i) {
    data_model.fragments[i] = { fragment: i+1, x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }
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
  
  // Inicializar mapa
  data_model.rows = rows;
  data_model.cols = cols;

  data_model.map = new Array(rows);
  for (y = 0; y < rows; ++y) {
    data_model.map[y] = new Array(cols);
    for (x = 0; x < cols; ++x) {
      data_model.map[y][x] = false;
    }
  }
  data_model.map[data_model.player.y][data_model.player.x] = true;
}

function init_view(id_canvas) {
  
  if (id_canvas)
    canvas = document.getElementById(id_canvas);
  else
    canvas = document.querySelector('canvas');
  context = canvas.getContext("2d");
  
  // Dibujar fondo
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Generar tablero
  box_size = Math.min(canvas.width / data_model.cols, canvas.height / data_model.rows);
  var board_width = box_size * data_model.cols;
  var board_height = box_size * data_model.rows;
  margin_x = (canvas.width - board_width) / 2.0;
  margin_y = (canvas.height - board_height) / 2.0;
  
  // Dibujar fondo
  background = document.createElement('img');
  background.src = img_path + "/fondo.png";
  background.onload = function() {
    
    context.drawImage(background, margin_x, margin_y, board_width, board_height);
    
    // Dibujar rejilla
    context.strokeStyle = "#888888";
    for(y = 0; y < data_model.rows; ++y) {
      for(x = 0; x < data_model.cols; ++x) {
        context.rect(margin_x + x * box_size, margin_y + y * box_size, box_size, box_size);
      }
    }
    context.rect(margin_x, margin_y, board_width, board_height);
    context.stroke();
    
    // Dibujar fragmentos
    var image_fragment = document.createElement('img');
    image_fragment.src = img_path + "/mensaje.png";
    image_fragment.onload = function(){
      
      context.fillStyle = "#FFFFFF";
      for (i = 0; i < data_model.fragments.length; ++i) {
        var text = "" + data_model.fragments[i].fragment;
        var x = margin_x + data_model.fragments[i].x * box_size;
        var y = margin_y + data_model.fragments[i].y * box_size;
        context.drawImage(image_fragment, x, y, box_size, box_size);
        context.font = (box_size * FONT_SIZE_RATIO) + "px Georgia";
        context.fillText(text, x + box_size * TEXT_X_RATIO, y + box_size * TEXT_Y_RATIO, box_size * TEXT_MAX_WIDTH_RATIO);
      }
    }
    
    // Dibujar jugador
    draw_player_image(img_path + "/inicial.png");
    
    context.fillStyle = "#FFFFFF";
  }
  
}

function reset() {
  
  data_model.player.first_movement = data_model.player.last_movement = data_model.player.last_select_movement = KEY_NONE;
  data_model.player.alive = true;
  data_model.player.last_fragment_picked = 0;
  
  data_model.player.x = data_model.player.init_x;
  data_model.player.y = data_model.player.init_y;
  
  for (y = 0; y < data_model.rows; ++y)
    for (x = 0; x < data_model.cols; ++x)
      data_model.map[y][x] = false;
  data_model.map[data_model.player.y][data_model.player.x] = true;
  
  init_view();
}

function update_player() {
  
  // Actualizar movimientos
  last_direction = data_model.player.last_movement;
  data_model.player.last_movement = data_model.player.last_select_movement;
  
  // Dibujado de la imagen
  draw_player_image(get_player_image_file(last_direction, data_model.player.last_movement));
  
  // Actualizar posición del jugador
  switch(data_model.player.last_movement) {
    case KEY_UP:    data_model.player.y--; break;
    case KEY_DOWN:  data_model.player.y++; break;
    case KEY_LEFT:  data_model.player.x--; break;
    case KEY_RIGHT: data_model.player.x++; break;
  }
  
  data_model.player.x = Math.abs((data_model.player.x + data_model.cols) % data_model.cols);
  data_model.player.y = Math.abs((data_model.player.y + data_model.rows) % data_model.rows);
  
  // Establecimiento del primer movimiento del jugador
  if (data_model.player.first_movement == KEY_NONE)
    data_model.player.first_movement = data_model.player.last_movement;
}

function get_player_image_file(last_movement, current_movement) {
  
  /* Obtencion del nombre de la imagen a partir de el movimiento anterior y el actual */
  var file = img_path + "/";

  switch (last_movement) {
    case KEY_NONE:
      switch (current_movement) {
        case KEY_UP: file += "extremo_sur.png"; break;
        case KEY_DOWN: file += "extremo_norte.png"; break;
        case KEY_LEFT: file += "extremo_este.png"; break;
        case KEY_RIGHT: file += "extremo_oeste.png"; break;
      }
    break;
    case KEY_UP:
      switch (current_movement) {
        case KEY_UP: file += "cable_vertical.png"; break;
        case KEY_LEFT: file += "conexion_sur_oeste.png"; break;
        case KEY_RIGHT: file += "conexion_sur_este.png"; break;
      }
    break;
    case KEY_LEFT:
      switch (current_movement) {
        case KEY_UP: file += "conexion_norte_este.png"; break;
        case KEY_DOWN: file += "conexion_sur_este.png"; break;
        case KEY_LEFT: file += "cable_horizontal.png"; break;
      }
    break;
    case KEY_DOWN:
      switch (current_movement) {
        case KEY_DOWN: file += "cable_vertical.png"; break;
        case KEY_LEFT: file += "conexion_norte_oeste.png"; break;
        case KEY_RIGHT: file += "conexion_norte_este.png"; break;
      }
    break;
    case KEY_RIGHT:
      switch (current_movement) {
        case KEY_UP: file += "conexion_norte_oeste.png"; break;
        case KEY_DOWN: file += "conexion_sur_oeste.png"; break;
        case KEY_RIGHT: file += "cable_horizontal.png"; break;
      }
    break;
  }
  
  return file;
}

function clean_box(x, y) {
  
  var box_image_width = background.width / data_model.cols;
  var box_image_height = background.height / data_model.rows;
  context.drawImage(background, x * box_image_width, y * box_image_height, box_image_width, box_image_height, BORDER_SIZE + margin_x + x * box_size, BORDER_SIZE + margin_y + y * box_size, box_size - BORDER_SIZE * 2.0, box_size  - BORDER_SIZE * 2.0)
}

function draw_player_image(file) {

  var x = data_model.player.x;
  var y = data_model.player.y;
  
  var image = document.createElement('img');
  image.src = file;
  image.onload = function(){
    clean_box(x, y);
    context.drawImage(image, margin_x + x * box_size, margin_y + y * box_size, box_size, box_size);
  }
}

function update_game() {
  
  if (!data_model.map[data_model.player.y][data_model.player.x]) { // Si el jugador no ha recorrido la casilla
  
    // Comprobación de fragmento capturado
    for(i = 0; i < data_model.fragments.length; ++i) { 
      var f = data_model.fragments[i];
      if(data_model.player.x == f.x && data_model.player.y == f.y) { // Si se ha llegado al fragmento "f"
        if(f.fragment == data_model.player.last_fragment_picked + 1) { // Se coge el fragmento si es el siguiente
          data_model.player.last_fragment_picked++
        }
        else { // Si coge un fragmento incorrecto, el jugador pierde
          data_model.player.alive = false;
          setTimeout(end_game, END_TIME, false);
        }
      }
    }
    
    // Dibujado de la imagen de extremo
    var image_head_file = img_path + "/";
    switch(data_model.player.last_movement) {
      case KEY_UP:    image_head_file += "extremo_norte.png"; break;
      case KEY_DOWN:  image_head_file += "extremo_sur.png"; break;
      case KEY_LEFT:  image_head_file += "extremo_oeste.png"; break;
      case KEY_RIGHT: image_head_file += "extremo_este.png"; break;
    }
    draw_player_image(image_head_file);
    
    data_model.map[data_model.player.y][data_model.player.x] = true; // Se marca como recorrido
  }
  else { // Si el jugador ha recorrido la casilla
    if(data_model.player.last_fragment_picked == data_model.fragments.length
        && data_model.player.x == data_model.player.init_x
        && data_model.player.y == data_model.player.init_y) {
      
      draw_player_image(get_player_image_file(data_model.player.last_movement, data_model.player.first_movement));
      setTimeout(end_game, END_TIME, true);
    }
    else {
      setTimeout(end_game, END_TIME, false);
    }
    data_model.player.alive = false;
  }
}

function light_animation() {
  
  var img_data = context.getImageData(0, 0, canvas.width, canvas.height);
  
  var white_board = function() {
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(margin_x, margin_y, data_model.cols * box_size, data_model.rows * box_size);
    setTimeout(black_board, ANIMATION_TIME);
  }
  
  var black_board = function() {
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(margin_x, margin_y, data_model.cols * box_size, data_model.rows * box_size);
    setTimeout(restore_board, ANIMATION_TIME);
  }
  
  var restore_board = function() {
    context.putImageData(img_data, 0, 0);
  }
  
  setTimeout(white_board, ANIMATION_TIME);
}

function end_game(victory) {
  
  if (victory) {
    
    // Animacion de victoria
    light_animation();
    
    setTimeout(success_game, END_TIME);
  }
  else {
    
    // Imagen de derrota
    var x = data_model.player.x, y = data_model.player.y;
    var image = document.createElement('img');
    image.src = img_path + "/cross.png";
    image.onload = function(){
      context.drawImage(image, margin_x + x * box_size, margin_y + y * box_size, box_size, box_size);
    }
    
    setTimeout(failure_game, END_TIME);
  }
}

function on_frame() {

  if (!data_model.player.alive) // Comprobación de que el juego no ha terminado
    return;
    
  update_player(); // Se actualiza al jugador
  
  if (data_model.player.last_movement != KEY_NONE) // Si el jugador se ha movido
    update_game(); // Se actualiza el entorno y se analiza el estado del juego
}

function on_event_keyboard(evento) {
  var e = window.event || evento;
  
  // Reseteado
  if (e.keyCode == KEY_RESET) {
    reset();
    return;
  }
  
  // Movimiento del jugador
  switch(data_model.player.last_movement) {
    case KEY_NONE:
      switch (e.keyCode) {
        case KEY_LEFT: case KEY_RIGHT: case KEY_UP: case KEY_DOWN: data_model.player.last_select_movement = e.keyCode; break;
      }
    break;
    case KEY_UP: case KEY_DOWN:
      switch (e.keyCode) {
        case KEY_LEFT: case KEY_RIGHT: data_model.player.last_select_movement = e.keyCode; break;
      }
    break;
    case KEY_LEFT: case KEY_RIGHT:
      switch (e.keyCode) {
        case KEY_UP: case KEY_DOWN: data_model.player.last_select_movement = e.keyCode; break;
      }
    break;
  }
}

function on_event_touchstart(evento) {
  
  start_x = parseInt(evento.changedTouches[0].clientX);
  start_y = parseInt(evento.changedTouches[0].clientY);
  
  evento.preventDefault();
}

function on_event_touchmove(evento) {
  
  var end_x = parseInt(evento.changedTouches[0].clientX);
  var end_y = parseInt(evento.changedTouches[0].clientY);
  
  if (Math.abs(start_x - end_x) > Math.abs(start_y - end_y)) {
    if (start_x - end_x < 0)
      data_model.player.last_select_movement = KEY_RIGHT;
    else
      data_model.player.last_select_movement = KEY_LEFT;
  }
  else {
    if (start_y - end_y < 0)
      data_model.player.last_select_movement = KEY_DOWN;
    else
      data_model.player.last_select_movement = KEY_UP;
  }
    
  start_x = end_x;
  start_y = end_y;

  evento.preventDefault();
}
