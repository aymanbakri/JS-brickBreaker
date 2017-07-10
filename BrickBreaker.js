var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * .8;
canvas.height = window.innerHeight * .8;

var width = window.innerWidth * .8;
var height = window.innerHeight * .8;
var minSize = Math.min(width, height);
function particle() {
    this.ballRadius = minSize / 50;
    this.x = width / 2;
    this.y = height - 20;
    this.dx = 5;
    this.dy = 5;
    this.paddlePlace = 8;
    this.paddleHeight = minSize / 50;
    this.paddleWidth = minSize / 5;
    this.paddleX = (width - this.paddleWidth) / 2;
    this.rightPressed = false;
    this.leftPressed = false;

    this.score = 0;
    this.scoreFunc = 0;
    
    this.lives = 3;
    this.flag = true;
    this.start = 0;
    this.countLevel = 1;
    this.levels = 2;
    this.bricks = [];
    this.stop = 1;
    this.bricksLive = 0;

}

particle.prototype.drawTheBricks = function () {

    for (key in this.levels) {
        for (key2 in this.levels) {

            if (this.levels[key2].status == 1) {
                var brickX = this.levels[key2].x
                var brickY = this.levels[key2].y;
                ctx.beginPath();
                ctx.rect(brickX, brickY, this.levels[key2].width, this.levels[key2].height);
                ctx.fillStyle = this.levels[key2].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

particle.prototype.collision = function () {
    if (this.x + this.dx > canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx *= -1;
    }
    else if (this.y + this.dy > canvas.width - this.ballRadius || this.y + this.dy < this.ballRadius) {
        this.dy *= -1;
    }
    if (this.rightPressed && this.paddleX < canvas.width - this.paddleWidth) {
        this.paddleX += this.paddlePlace;
    }
    else if (this.leftPressed && this.paddleX > 0) {
        this.paddleX -= this.paddlePlace;
    }

    if (this.y + this.dy > canvas.height - this.paddleHeight) {
        if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
            this.dy *= -1;
        }

        else {
            this.lives -= 1;
            if (this.lives == 0) {
                this.stop = 0;
                this.countLevel = 0;
                this.gameOver();
            }
            else {
                this.x = canvas.width / 2;
                this.y = canvas.height - 30;
                this.paddleX = (canvas.width - this.paddleWidth) / 2;
            }
        }
    }

    for (key in this.levels) {
        for (key2 in this.levels) {
            if (this.levels[key2].status == 1) {
                if (this.x > this.levels[key2].x && this.x < this.levels[key2].x + this.levels[key2].width
                    && this.y > this.levels[key2].y
                    && this.y < this.levels[key2].y + this.levels[key2].height) {
                    this.dy = -this.dy;
                    this.score += this.levels[key2].score;
                    this.levels[key2].status = 0;

                    if (this.score == this.scoreFunc) {
                        this.score = 0;
                        this.lives = 3;
                        this.stop = 0;
                        this.countLevel += 1;

                        if (this.countLevel <= 0) {
                            this.gameOver();
                        }
                        if (this.countLevel < 5) {
                            this.newLevel();
                        }
                        if (this.countLevel >= 5) {
                            this.youWin();
                        }
                        console.log(this.countLevel);
                    }
                }
            }
        }
    }
}



particle.prototype.keyDown = function (e) {
    if (e.keyCode == 37) {
        this.leftPressed = true;
    }
    else if (e.keyCode == 39) {
        this.rightPressed = true;
    }
}
particle.prototype.keyUp = function (e) {
    if (e.keyCode == 37) {
        this.leftPressed = false;
    }
    else if (e.keyCode == 39) {
        this.rightPressed = false;
    }
}

particle.prototype.drawTheBall = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}
particle.prototype.drawThePaddle = function () {
    ctx.beginPath();
    ctx.rect(this.paddleX, height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

particle.prototype.drawScore = function () {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("score: " + this.score, width - 100, 20);
}

particle.prototype.drawLevel = function () {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("level: " + this.countLevel, width / 2, 20);


}
particle.prototype.drawLives = function () {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("lives: " + this.lives, 20, 20);
}

particle.prototype.gameOver = function () {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.font = "64px Arial";
    ctx.fillText("game Over", width / 3, height / 2);
    var audio = new Audio("gameover.mp3");
    setTimeout(function () {
        window.location.reload();
    }, 2000);
}

particle.prototype.mouseMoveHandler = function (e) {
    var mousemove = e.clientX- this.paddleWidth;
    if (mousemove > 0 && mousemove < canvas.width) {
        this.paddleX = mousemove - this.paddleWidth / 2;
    }
}

particle.prototype.youWin = function () {

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.font = "64px Arial";
    ctx.fillText("you won", width / 3, height / 2);
    setTimeout(function () {
        window.location.reload();
    }, 2000);

}

particle.prototype.newLevel = function (e) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.font = "64px Arial";
    ctx.fillText("click to start new level", width / 6, height / 2);

    if (e) {
        this.stop = 1;
        this.draw();
    }
}
particle.prototype.sumScore = function () {
    var sum = 0;
    for (key2 in this.levels) {
        sum += this.levels[key2].score;
    }
    this.scoreFunc = sum;
}

particle.prototype.draw = function () {

    switch (this.countLevel) {
        case 0:
            this.stop = 0;
            break;
        case 1: this.levels = level1;
            break;
        case 2: this.levels = level2;
            break;
        case 3: this.levels = level3;
            break;
        case 4: this.levels = level4;
            break;
        case 5:
            this.stop = 0;
            break;
    }

    ctx.clearRect(0, 0, width, height);
    this.sumScore();
    this.collision();
    this.drawTheBricks();
    this.drawTheBall();
    this.drawThePaddle();
    this.drawScore();
    this.drawLives();
    this.drawLevel();

    if (this.stop) {
        window.webkitRequestAnimationFrame(this.draw.bind(this));
    }

    this.x += this.dx;
    this.y += this.dy;
}


window.addEventListener('load', function () {

    var circle = new particle();

    document.addEventListener("keyup", circle.keyUp.bind(circle), false);
    document.addEventListener("keydown", circle.keyDown.bind(circle), false);
    document.addEventListener("mousemove", circle.mouseMoveHandler.bind(circle), false);
    document.addEventListener("click", circle.newLevel.bind(circle), false);

    circle.draw();
});


