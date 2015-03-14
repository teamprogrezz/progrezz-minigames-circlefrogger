#Progrezz Minigames - LinkSnake
Minijuego de recolección de fragmentos, basado en el clásico juego "Snake".

##Descripción
LinkSnake consiste en una variación del clásico juego ["Snake"](http://es.wikipedia.org/wiki/Snake_%28videojuego%29).

En este caso, un cable se desplaza por el tablero (a una determinada velocidad) en la dirección que le vaya indicando el jugador (mediante las **flechas del teclado**, o **arrastrando con el dedo** en la dirección deseada en dispositivos con entrada táctil). Deberá ir recogiendo en orden una serie de fragmentos numerados. Una vez se recojan todos, el jugador deberá volver al inicio para cerrar el circuito y ganar.

Si se recogen los fragmentos en el orden incorrecto, o el cable choca contra sí mismo (pues se mantiene el cable en todos los lugares por los que ha pasado, no pudiendo recorrer la misma casilla dos veces), el jugador perderá la partida.

También se ha implementado una versión simple del juego, en el que en lugar de moverse automáticamente, será el jugador el que deberá arrastrar la cabeza del cable (mediante **ratón**, o **tocando la pantalla** en dispositivos con entrada táctil), para completar el juego.
> **Nota:** En la versión normal, al llegar a un extremo del tablero, el cable aparece por el lado opuesto, lo que no ocurre en la version simplificada.

##Instalación
Para el empleo del juego LinkSnake en cualquier proyecto existen dos opciones:
- Copiar las carpetas "js" e "img" en el lugar deseado.
> **Importante:** Es necesario que la carpeta "img" y "js" se encuentren en el mismo directorio.
- Añadir el proyecto como submódulo de git, de la siguiente manera:
```
$ git submodule add https://github.com/teamprogrezz/progrezz-minigames-linksnake my-subdirectory/linksnake
```
Y para mantenerlo actualizado, ejecutar:
```
$ git submodule update --remote --merge
```

Por último, bastaría con incluir el script "js/linksnake.js" en el documento HMTL en el que se quiera ubicar el juego.

##Utilización
El juego emplea el espacio de nombres "LinkSnake", siendo necesario utilizar "LinkSnake.init" para inicializar el juego. El método posee los siguientes parámetros:
- ***success_function***: Función que se ejecutará en caso de que el jugador complete con éxito la partida.
- ***failure_function***: Función que se ejecutará en caso de que el jugador no consiga completar con éxito la partida.
- ***num_fragments***: Nº de fragmentos que el usuario deberá recoger en orden para completar el juego.
- ***rows***: Nº de filas del tablero.
- ***cols***: Nº de columnas del tablero.
- ***speed***: Si se establece un valor mayor que 0, determina la velocidad de movimiento del cable que controla el jugador: indica cada cuantos milisegundos se realiza un movimiento de una casilla. Mientras que si el valor se establece en 0, el modo de juego cambiará a la versión más sencilla, en la que el usuario debe arrastrar la cabeza del cable para completar el juego siguiendo las mismas reglas que en la versión normal.
- ***id_canvas***: Opcionalmente, se puede indicar el id del canvas en el que se desea dibujar el juego. En caso de que no se incluya este parámetro, se dibujará el juego en el primer canvas encontrado en el DOM.

> **Importante:** Cuando el juego finalice, se ejecutará la función de victoria o derrota, dependiendo de si el jugador ha ganado o ha perdido, respectivamente.

## Código de ejemplo
```html
<!DOCTYPE html>
<html>
<head>
  <title>Link Snake - Test</title>
  <script type="text/javascript" src="js/linksnake.js"></script>
</head>
<body style="margin:0px; padding:0px">
  <canvas id="gameview" width="960" height="720"></canvas>
  <script>
    window.onload = function() {
      LinkSnake.init(
        function() { console.log("Victoria"); }, // Función de victoria
        function() { console.log("Derrota"); }, // Función de derrota
        4, // Fragmentos
        12, // Filas
        16, // Columnas
        200, // Movimiento cada 200 ms
        "gameview" // ID del canvas a utilizar
      );
    };
  </script>
</body>
</html>
```
> **Nota:** El script "js/test_game_manager" presenta un ejemplo simple de inclusión del juego en un canvas.

##Autores
- Cristo "Shylpx" González Rodríguez
- Daniel "Wikiti" Herzog Cruz

##Version
- 1.0.0

##Licencia
The MIT License (MIT)

Copyright (c) 2014 teamprogrezz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.