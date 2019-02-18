
function Snake(canvas, scoreDiv, scale, n, letters) {
    this.canvas = canvas;
    this.letters = letters;
    this.ctx = canvas.getContext('2d');
    this.scale = scale;
    this.n = n;
    this.setupCanvas();
    this.direction = null;
    this.coords = [];
    this.isDead = false;
    this.cellSize = this.canvas.width/this.n;
    this.food = null;
    this.setRandomCoords();
    this.foodConsumed = 0;
    this.numSteps = 0;
    this.minSteps = 0;
    this.paused = false;
    this.score = 0;
    this.scoreDiv = scoreDiv;
    this.isStarted = false;
    this.isFlashing = true;
    this.displayScore();
    //this.loop(100, 150);
    //this.loop(100, 150);

    this.flash("tap to start");
}

Snake.prototype.flash = function(text){
    var count = 0;
    var maxCount = 100;
    var flag = false;
    var self = this;
    _flash();

    function _flash() {
        if(!self.isFlashing)
            return;
        if(flag){
            self.drawText(text, "white", "black");
        }
        else{
            self.drawText(text, "black", "white");
        }

        flag = !flag;
        count++;

        if(count<maxCount)
            setTimeout(_flash, 300);
    }
};

Snake.prototype.drawText = function(text, foreground, background){
    var words = text.split(' ');
    this.clear(background);
    var self = this;
    var startY = parseInt((self.n - (words.length*6 -1))/2);

    words.forEach(function (word) {
        var wordLen = word.length;
        var startX = parseInt((self.n - (6*wordLen - 1))/2);
        console.log(startX)
        for(var i=0; i<wordLen; i++){
            var letter = letters[word[i]];
            for(var x=0; x<5; x++){
                for(var y=0; y<5; y++){
                    if(letter[x][y]) {
                        self.drawTile(startX+y, startY+x, foreground ? foreground : "white");
                    }
                }
            }
            startX += 6;
        }

        startY += 6;
    });
};

Snake.prototype.start = function(){
    if(!this.isStarted){
        this.isStarted = true;
        this.loop(100, 150);
        this.loop(100, 150);
    }
};

Snake.prototype.displayScore = function(){
    this.scoreDiv.innerHTML = this.score;
};

Snake.prototype.loop = function(minDelay, maxDelay){
    var self = this;
    if(self.isDead)
        return;
    if(self.isStarted){
        self.isFlashing = false;
        _loop();
    }
    else if(self.isDead) {
        self.isFlashing = true;
        self.isStarted = false;
        self.flash("game over");
    }
    else{
        self.isFlashing = true;
        self.flash("tap to start");
    }

    function _loop() {
        self.draw();
        self.move();
        var delay;

        if(self.foodConsumed + minDelay < maxDelay)
            delay = maxDelay - self.foodConsumed;
        else
            delay = minDelay;
        if(!self.isDead && !self.paused && self.isStarted)
            setTimeout(_loop, delay);
        else if(self.isDead) {
            self.isFlashing = true;
            self.isStarted = false;
            self.flash("game over");
        }
        else{
            self.isFlashing = true;
            self.flash("tap to start");
        }
    }
};

Snake.prototype.move = function(){
    var self = this;

    for(var i=this.coords.length-1; i>0; i--){
        self.coords[i].x = self.coords[i-1].x;
        self.coords[i].y = self.coords[i-1].y;
    }

    if(this.direction === 0)
        self.coords[0].y--;
    else if(this.direction === 1)
        self.coords[0].x++;
    else if(this.direction === 2)
        self.coords[0].y++;
    else if(this.direction === 3)
        self.coords[0].x--;

    this.numSteps++;

    if(this.food.x === this.coords[0].x && this.food.y === this.coords[0].y)
        this.eat();

    if(self.coords[0].x < 0)
        self.coords[0].x = self.n-1;

    if(self.coords[0].y < 0)
        self.coords[0].y = self.n-1;

    if(self.coords[0].x >= this.n)
        self.coords[0].x = 0;

    if(self.coords[0].y >= this.n)
        self.coords[0].y = 0;

    for(var i=1; i<self.coords.length; i++){
        if(self.coords[i].x === self.coords[0].x && self.coords[i].y === self.coords[0].y){
            self.isDead = true;
            return;
        }
    }
};

Snake.prototype.turn = function(direction){
    if(direction !== 0 && direction !== 1 && direction !== 2 && direction !== 3)
        return;
    if(direction === this.direction)
        return;
    if(direction === 0 && this.direction === 2)
        return;
    if(direction === 1 && this.direction === 3)
        return;
    if(direction === 2 && this.direction === 0)
        return;
    if(direction === 3 && this.direction === 1)
        return;
    this.direction = direction;
};


Snake.prototype.setRandomCoords = function(){
    var snakeSize = 3;
    var orientation = Math.floor(Math.random()*2);
    var x = Math.floor(Math.random()*(this.n-2*snakeSize)) + snakeSize;
    var y = Math.floor(Math.random()*(this.n-2*snakeSize)) + snakeSize;
    var nx = x;
    var ny = y;
    this.coords.push({ x: x, y: y });
    var fx, fy;
    if(orientation === 0){
        this.direction = (x > this.n/2 ? 3 : 1);
        for(var i=1; i<snakeSize; i++){
            nx = nx + (x > this.n/2 ? 1 : -1);
            this.coords.push({ x: nx, y: ny });
        }

        fx = Math.floor(Math.random()*(this.n-x)) + x;
        fy = Math.floor(Math.random()*(this.n));
    }
    else{
        this.direction = (y > this.n/2 ? 0 : 2);
        for(var j=1; j<snakeSize; j++){
            ny = ny + (y > this.n/2 ? 1 : -1);
            this.coords.push({ x: nx, y: ny });
        }

        fx = Math.floor(Math.random()*(this.n));
        fy = Math.floor(Math.random()*(this.n-y)) + y;
    }

    this.food = { x: fx, y: fy };

    this.calcMinPath();
};

Snake.prototype.calcMinPath = function(){
    var coords = [];
    for(var i=0; i<this.n; i++){
        coords.push([]);
        for(var j=0; j<this.n; j++){
            coords[i].push(0);
        }
    }

    for(var k=0; k<this.coords.length; k++){
        coords[this.coords[k].x][this.coords[k].y] = 1;
    }

    var q = [];
    q.push({ x: this.coords[0].x, y: this.coords[0].y, steps: 0 });

    var xx = [0, 1, 0, -1];
    var yy = [-1, 0, 1, -1];
    var minSteps = 0;
    while(q.length !== 0){
        var topMost = q.shift();

        if(topMost.x === this.food.x && topMost.y === this.food.y){
            minSteps = topMost.steps;
            break;
        }

        for(var i=0; i<4; i++){
            var x = topMost.x + xx[i];
            var y = topMost.y + yy[i];
            var steps = topMost.steps + 1;
            if(x >=0 && x<this.n && y>=0 && y<this.n)
                if(!coords[x][y]){
                    q.push({ x: x, y: y, steps: steps });
                    coords[x][y] = 1;
                }
        }
    }

    this.minSteps = minSteps;
};

Snake.prototype.setupCanvas = function () {
    this.canvas.width = this.canvas.width*this.scale;
    this.canvas.height = this.canvas.width;
    var width = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = width + "px";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = 0 + "px";
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = "white";

};

Snake.prototype.clear = function (color) {
    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = color ? color : "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
};

Snake.prototype.drawGrid = function () {
    var ctx = this.ctx;

    ctx.save();
    ctx.strokeStyle = "grey";
    ctx.beginPath();

    for(var i=1; i<this.n; i++){
        ctx.moveTo(i*this.cellSize, 0);
        ctx.lineTo(i*this.cellSize, this.canvas.height);
        ctx.stroke();
    }

    for(var i=1; i<this.n; i++){
        ctx.moveTo(0, i*this.cellSize);
        ctx.lineTo(this.canvas.width, i*this.cellSize);
        ctx.stroke();
    }

    ctx.closePath();
    ctx.restore();
};

Snake.prototype.eat = function(){
    var availableCoords = [];
    this.foodConsumed++;
    console.log(105 - (this.numSteps - this.minSteps), this.numSteps, this.minSteps)
    this.score += 100 - (this.numSteps - this.minSteps);
    this.numSteps = 0;
    for(var i=0; i<this.n; i++){
        for(var j=0; j<this.n; j++){
            for(var k=0; k<this.coords.length; k++){
                var coord = this.coords[k];
                if(coord.x !== i || coord.y !== j){
                    availableCoords.push({ x: i, y: j });
                }
            }
        }
    }

    var newCoord = availableCoords[Math.floor(Math.random()*availableCoords.length)];
    this.food.x = newCoord.x;
    this.food.y = newCoord.y;

    if(this.coords[this.coords.length-1].x === this.coords[this.coords.length-2].x)
        if(this.coords[this.coords.length-1].y > this.coords[this.coords.length-2].y)
            this.coords.push({ x: this.coords[this.coords.length-1].x, y: this.coords[this.coords.length-1].y + 1 });
        else
            this.coords.push({ x: this.coords[this.coords.length-1].x, y: this.coords[this.coords.length-1].y - 1 });
    else if(this.coords[this.coords.length-1].y === this.coords[this.coords.length-2].y)
        if(this.coords[this.coords.length-1].x > this.coords[this.coords.length-2].x)
            this.coords.push({ x: this.coords[this.coords.length-1].x + 1, y: this.coords[this.coords.length-1].y });
        else
            this.coords.push({ x: this.coords[this.coords.length-1].x - 1, y: this.coords[this.coords.length-1].y });

    this.calcMinPath();
    this.displayScore();
};

Snake.prototype.drawTile = function (x, y, color) {
    if(x < 0 || x >= this.n || y < 0 || y >= this.n)
        return;
    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = color ? color : "white";
    ctx.fillRect(x*this.cellSize, y*this.cellSize, this.cellSize, this.canvas.height/this.n);
    ctx.restore();
};

Snake.prototype.draw = function () {
    this.clear();
    this.drawGrid();

    for(var i=0; i<this.coords.length; i++){
        this.drawTile(this.coords[i].x, this.coords[i].y);
    }

    this.drawTile(this.food.x, this.food.y, "green");

    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.coords[0].x*this.cellSize + this.cellSize/2, this.coords[0].y*this.cellSize + this.cellSize/2, this.cellSize*0.2, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};