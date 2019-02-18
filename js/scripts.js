
function init() {
    var canvas = document.querySelector(".theGame .theCanvas");
    var scoreDiv = document.querySelector(".theScore");
    var snake = new Snake(canvas, scoreDiv,  2, 30, letters);

    window.onclick = function (ev) {
        if(!snake.isStarted && !snake.isDead)
            snake.start();
    };

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

    var myElement = document.querySelector("body");

    var mc = new Hammer(myElement);

//enable all directions
    mc.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
        threshold: 1,
        velocity: 0.1
    });

// listen to events...
    mc.on("swipeup swipedown swipeleft swiperight", function (e) {


        if (e.type === "swipeup") {
            snake.turn(0);
        }
        else if (e.type === "swiperight") {
            snake.turn(1);
        }
        else if (e.type === "swipedown") {
            snake.turn(2);
        }
        else if (e.type === "swipeleft") {
            snake.turn(3);
        }
    });
}



window.onload = init;