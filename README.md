#Progrezz Minigames - CircleFrogger
Minijuego de desbloqueo de recursos, basado en el juego arcada "Frogger".

##Descripción
CircleFrogger consiste en una variación del clásico juego ["Frogger"](http://es.wikipedia.org/wiki/Frogger).

En este caso, se ha optado por una temática "hacker", usando círculos que rotan por la pantalla. El jugador (punto verde) deberá traspasar todos los círculos hasta llegar al centro sin tocar las paredes.

La velocidad y número de círculos es fácilmente ajustable.

##Instalación
Para el empleo del juego CircleFrogger en cualquier proyecto existen dos opciones:
* Copiar las carpetas "js","img" y "snd" en el lugar deseado.  
> **Importante:** Es necesario que las carpetas "img", "js" y "snd" se encuentren en el mismo directorio.

* Añadir el proyecto como submódulo de git, de la siguiente manera:
```
$ git submodule add https://github.com/teamprogrezz/progrezz-minigames-circlefrogger my-subdirectory/circlefrogger
$ git submodule update --remote --merge // Para mantenerlo actualizado
```
Por último, bastaría con incluir el script "js/circlefrogger.js" en el documento HMTL en el que se quiera ubicar el juego.

##Utilización
El juego emplea el espacio de nombres "CircleFrogger", siendo necesario utilizar "CircleFrogger.init" para inicializar el juego. El método posee los siguientes parámetros:

- ***success_function***: Función que se ejecutará en caso de que el jugador complete con éxito la partida.
- ***failure_function***: Función que se ejecutará en caso de que el jugador no consiga completar con éxito la partida.
- ***opening***: Apertura de los círculos, especificada en radianes.
- ***circles***: Número de círculos que aparecen en pantalla. **Debe ser mayor que 1.**
- ***speed***: Determina la velocidad de movimiento de los círculos, especificado en ms como tiempo de refresco de pantalla. Cuanto más grande sea este valor, más lento ira el juego, y por consiguiente, será más fácil. No se recomienda usar valores demasiado grandes (< 20).
- ***id_canvas***: Opcionalmente, se puede indicar el id del canvas en el que se desea dibujar el juego. En caso de que no se incluya este parámetro, se dibujará el juego en el primer canvas encontrado en el DOM.

> **Importante:** Cuando el juego finalice, se ejecutará la función de victoria o derrota, dependiendo de si el jugador ha ganado o ha perdido, respectivamente.

## Código de ejemplo
```html
<!DOCTYPE html>
<html>
<head>
  <title>CircleFrogger - Test</title>
  <script type="text/javascript" src="js/circlefrogger.js"></script>
</head>
<body style="margin:0px; padding:0px">
  <canvas id="gameview" width="960" height="720"></canvas>
  <script>
    window.onload = function() {
      CircleFrogger.init(
        function() { console.log("Victoria"); }, // Función de victoria
        function() { console.log("Derrota"); }, // Función de derrota
        12, // Círculos
        0.8, // Abertura
        16, // Velocidad (ms)
        "gameview" // ID del canvas a utilizar
      );
    };
  </script>
</body>
</html>
```
> **Nota:** El script "js/test_game_manager" presenta un ejemplo simple de inclusión del juego en un canvas.

##Autores
- Daniel "Wikiti" Herzog Cruz

## Agradecimientos

- Cristo "Shylpx" González Rodríguez (plantilla del juego y base del *Readme*).

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
