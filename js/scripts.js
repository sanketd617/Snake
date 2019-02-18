
function init() {
    var canvas = document.querySelector(".theGame .theCanvas");
    var snake = new Snake(canvas, 2, 30);

    window.onkeyup = function (ev) {
        switch (ev.key) {
            case "ArrowUp":
                snake.turn(0);
                break;
            case "ArrowRight":
                snake.turn(1);
                break;
            case "ArrowDown":
                snake.turn(2);
                break;
            case "ArrowLeft":
                snake.turn(3);
                break;
            case " ":
                snake.paused = !snake.paused;
                snake.calcMinPath();
                if(!snake.paused)
                    snake.loop(100, 200);
                break;
        }
    }
}



window.onload = init;