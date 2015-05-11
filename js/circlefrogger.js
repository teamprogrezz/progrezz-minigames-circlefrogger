
// Espacio de nombres
var CircleFrogger = {};

(function(namespace){


  var BORDER_SIZE = 1 // Grosor del borde

  var END_TIME = 100 // Retardo al finalizar el juego
  var ANIMATION_TIME = 120 // Retardo entre las iluminaciones en la animación de victoria
  
  var ANGULAR_SPEED = 0.02;

  var frame_time // Tiempo de refresco (ms) - Determina la velocidad

  var canvas, context // "canvas" 2D y "context" para el dibujado

  var success_game, failure_game // Funciones de éxito y fracaso

  var background; // Imagen de fondo
  var box_size;   // Tamaño de la caja
  var margin_x, margin_y; // Márgenes

  var opening_size;

  var min_radius;
  var max_radius;
  var radius_spacing;
  var arc_thickness;

  var img_path; // Ruta relativa del directorio con las imágenes del juego

  var game_end_state = false;

  function CircleFrogger() { }

  // Datos del juego
  var data_model = {
    circles: {
      count: 0,
      data: []
    },
    player: {
      pos: 0,
      alive: true
    }
  };

  namespace.init = function (success_function, failure_function, circles, opening, speed, id_canvas) {
    
    /* Establecimiento de funciones de victoria y derrota */
    success_game = success_function;
    failure_game = failure_function;

    frame_time = speed

    // Propiedades de círculos
    opening_size = opening;

    /* Almacenando ruta relativa del directorio de imágenes */
    img_path = getImagesURL();
    
    /* Inicialización de datos y vista */
    init_data_model(circles);
    init_view(id_canvas);

    // Eventos
    canvas.ontouchstart = on_event;
    canvas.onmousedown = on_event;

    /* Reiniciar estado del juego */
    reset();

    /* Renderizado */
    on_frame();
    setInterval(on_frame, frame_time);
  }

  function getImagesURL() {
    
    var dir = document.querySelector('script[src$="circlefrogger.js"]').getAttribute('src');
    var name = dir.split("/").pop();
    return dir.replace("js/" + name, "img");
  }

  function init_data_model(circles) {
    
    // Inicializar jugador
    data_model.player.pos = 0;

    // Iniciar círculos
    data_model.circles.count = circles;
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
    box_size = Math.min(canvas.width, canvas.height);
    var board_width = box_size;
    var board_height = box_size;
    margin_x = (canvas.width - board_width) / 2.0;
    margin_y = (canvas.height - board_height) / 2.0;

    // Propiedades de círculos
    min_radius = 0.05 * box_size;
    max_radius = 0.35 * box_size;
    radius_spacing = (max_radius - min_radius) / (data_model.circles.count - 1);
    arc_thickness = 0.01 * box_size;
    
    // Dibujar fondo
    background = document.createElement('img');
    background.src = img_path + "/fondo.png";

    background.onload = function() {
      // Dibujar fondo
      context.drawImage(background, margin_x, margin_y, board_width, board_height);
    }
    
  }

  function destructor() {
    canvas.ontouchend = null;
    canvas.ontouchstart = null;
    
    data_model = {
      circles: {
        count: 0,
        data: []
      },
      player: {
        pos: 0,
        alive: false
      }
    };
  }

  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function reset() {
    data_model.player.pos = 0;
    data_model.player.alive = true;
    data_model.circles.data = []
    
    for (i = 0; i < data_model.circles.count; i++) {
      var color = "#00" + getRandomInt( 0x7F, 0xFF ).toString(16) + "00";
      var start_angle = getRandom(0, 2 * Math.PI - opening_size);
      var circle = {
        start_angle: start_angle+ opening_size,
        end_angle: start_angle,
        color: color,
        direction: Math.random() < 0.5 ? -1 : 1,
        speed_factor: getRandom(0.9, 1.3)
      }

      data_model.circles.data.push(circle);
    }
  }

  function update_player() {
    
  }

  function on_frame(force) {
    if(game_end_state) return;
      
    update_player(); // Se actualiza al jugador
    update_game();   // Se actualiza el entorno y se analiza el estado del juego

    // Limpiar canvas
    context.fillStyle="black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pintar fondo
    context.drawImage(background, margin_x, margin_y, box_size, box_size);

    // Pintar círculos
    var centerX = margin_x + box_size/2.0;
    var centerY = margin_y + box_size/2.0;

    for (i = 0; i < data_model.circles.count; i++) {
      var circle = data_model.circles.data[i];
      var radius = min_radius + i * radius_spacing;

      context.beginPath();
      context.arc(centerX, centerY, radius, circle.start_angle, circle.end_angle, false);
      context.lineWidth = arc_thickness;
      if(!data_model.player.alive && data_model.player.pos == data_model.circles.count - i ) context.strokeStyle = "#e18f1a";
      else context.strokeStyle = circle.color;
      context.stroke();
    }

    // Pintar al jugador
    var playerX = centerX + max_radius - (data_model.player.pos - 0.5) * radius_spacing;
    var playerY = centerY;
    var player_size = arc_thickness * 1.5;

    if(!data_model.player.alive) playerX += 0.5 * radius_spacing
    else if(data_model.player.pos == data_model.circles.count) playerX = centerX;

    context.beginPath();
    context.arc(playerX, playerY, player_size, 0, 2 * Math.PI, false);
    if(!data_model.player.alive)  context.fillStyle = '#c32000';
    else                          context.fillStyle = '#5eff2d';
    context.fill();
  }

  function update_game() {
    // Si el jugador ha muerto, terminar.
    if(!data_model.player.alive) return;

    // Actualizar posiciones de los círculos
    for (i = 0; i < data_model.circles.count; i++) {
      var circle = data_model.circles.data[i];
      
      circle.start_angle += circle.direction * circle.speed_factor * ANGULAR_SPEED;
      circle.end_angle += circle.direction * circle.speed_factor * ANGULAR_SPEED;

      circle.start_angle %= 2 * Math.PI;
      circle.end_angle %= 2 * Math.PI;

      while(circle.start_angle < 0) circle.start_angle += 2 * Math.PI;
      while(circle.end_angle < 0) circle.end_angle += 2 * Math.PI;
    }
  }

  function light_animation() {
    
    var img_data = context.getImageData(0, 0, canvas.width, canvas.height);
    
    var white_board = function() {
      context.fillStyle = "rgba(255, 255, 255, 0.5)";
      context.fillRect(margin_x, margin_y, box_size, box_size);
      setTimeout(black_board, ANIMATION_TIME);
    }
    
    var black_board = function() {
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(margin_x, margin_y, box_size, box_size);
      setTimeout(restore_board, ANIMATION_TIME);
    }
    
    var restore_board = function() {
      context.putImageData(img_data, 0, 0);
    }
    
    setTimeout(white_board, ANIMATION_TIME);
  }

  function end_game(victory) {
    on_frame();
    
    if (victory) {
      
      // Animacion de victoria
      light_animation();
      
      setTimeout(success_game, END_TIME);
    }
    else {
      
      setTimeout(failure_game, END_TIME);
    }
    
    game_end_state = true;
  }

  function on_event(evento) {
    evento.preventDefault();
    if(game_end_state) return;
    
    switch(evento.type) {
      case "touchstart": case "mousedown":
        if(data_model.player.pos >= data_model.circles.count) return;

        data_model.player.pos++;

        // Comprobar si el jugador ha muerto
        var circle = data_model.circles.data[ data_model.circles.count - data_model.player.pos ];

        if(circle.start_angle > 0 && circle.start_angle < Math.PI && circle.end_angle < (2 * Math.PI) && circle.end_angle > Math.PI) {
		      if(data_model.player.pos == data_model.circles.count) {
		        end_game(true);
		      }
        }
        else {
          data_model.player.alive = false;
          end_game(false);
        }

      break;
    }
  }

})(CircleFrogger);
