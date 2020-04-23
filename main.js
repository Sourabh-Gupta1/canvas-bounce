
var canvas,canvasContext

var ballX = 75;
var ballSpeedX = 5;

var ballY = 75
var ballSpeedY = 7

const BRICK_COLUMNS = 10;
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_ROWS = 7;
var brickGrid = new Array(BRICK_COLUMNS*BRICK_ROWS);
var brickLeft ;

const PADDLE_WIDTH = 100;
const PADDLE_THICK = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;

var mouseX;
var mouseY;
function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.left - root.scrollTop;
    paddleX = mouseX - PADDLE_WIDTH/2;
}

function brickReset() {
    brickLeft = 0;
    for(var i=0;i<BRICK_COLUMNS*BRICK_ROWS;i++) {
        brickGrid[i] = true;
        brickLeft++;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d')

    var framePerSecond = 30;
    setInterval(updateAll, 1000/framePerSecond);
    canvas.addEventListener('mousemove',updateMousePos);
    brickReset();
    ballResetInitial();
}
function isBrickAtRowCol(col,row) {
  if(col >= 0 && col < BRICK_COLUMNS && row >= 0 && row < BRICK_ROWS) {
      var brickIndexUnderCoord = rowColToArrayIndex(col, row);

      return brickGrid[brickIndexUnderCoord]
  } else {
      return false;
  }
}
function updateAll() {
    moveAll();
    drawAll();
}

function ballResetInitial() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}
function ballReset() {
   ballSpeedY *= -1;
   ballX = canvas.width/2;
   ballY = canvas.height/2;
}
function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width && ballSpeedX > 0.0) {
        ballSpeedX *= -1;
    }

    if (ballX < 0 && ballSpeedX < 0.0) {
        ballSpeedX *= -1;
    }

    if (ballY < 0 && ballSpeedY < 0.0) {
        ballSpeedY *= -1;
    }

    if (ballY > canvas.height) {
        ballReset()
    }
}

function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX/BRICK_W);
    var ballBrickRow = Math.floor(ballY/BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol,ballBrickRow)

    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLUMNS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS){
        if(isBrickAtRowCol(ballBrickCol , ballBrickRow)) {
            brickGrid[brickIndexUnderBall] = false;
            brickLeft--;
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);

            var bothTestFailed = true;
            if(prevBrickCol != ballBrickCol) {
                if(!isBrickAtRowCol(prevBrickCol , ballBrickRow)) {
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }
            }
            if(prevBrickRow != ballBrickRow) {
                if(!isBrickAtRowCol(ballBrickCol , prevBrickRow)) {
                    ballSpeedY *= -1;
                    bothTestFailed = false;
                }
            }
           if(bothTestFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
           }
        }
    }
}

function ballPaddleHandling() {
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICK;
    var paddleLeftEdgeX = paddleX;
    var paddLeRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

    if(ballY > paddleTopEdgeY && ballY < paddleBottomEdgeY && ballX > paddleLeftEdgeX && ballX < paddLeRightEdgeX) {
        ballSpeedY *= -1;

        var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;

        if(brickLeft == 0) {
            brickReset();
        }
    }
}
function moveAll() {
    ballMove();
    ballBrickHandling();
    ballPaddleHandling();

}
function drawBricks() {
    for(var j=0;j<BRICK_ROWS;j++) {
        for (var i = 0; i < BRICK_COLUMNS; i++) {

            var arrayIndex = rowColToArrayIndex(i,j);
            if (brickGrid[arrayIndex])
                colorRect('red', BRICK_W * i, BRICK_H * j, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP);
        }
    }
}

function rowColToArrayIndex(col , row) {
    return BRICK_COLUMNS * row + col;
}
function drawAll() {
    colorRect('black',0,0,canvas.width,canvas.height);
    colorRect('white',paddleX,canvas.height-PADDLE_DIST_FROM_EDGE,PADDLE_WIDTH,PADDLE_THICK);
    drawBricks();
    colorCircle('white',ballX,ballY,10);
}
function colorRect(drawColor,leftX,topY,height,width) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,height,width);
}

function colorCircle(drawColor,centerX,centerY,radius){
    canvasContext.fillStyle = 'white'
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
    canvasContext.fill();
}

function colorText(showWords , textX , textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords,textX,textY);
}