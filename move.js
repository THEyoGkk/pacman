var pacman = null;
var coinsLayer;
var pacmanLayer;
var blinkyLayer;
var socket = new WebSocket("ws://localhost:1337");

socket.onmessage = function (event) {
    var box = JSON.parse(event.data);
    switch (box.pacman) {
        case "hello!":
            pacman = new KeyBox();          
            break; 
        case "pacmanMovement":        
            pacman.move(parseInt(box.left,10),parseInt(box.top,10));
            break;
        case "pacmanCoinsMap":
            drawCoinsMap(parseInt(box.x,10),parseInt(box.y,10));
            break;
        case "pacmanImg":
            drawPacman(parseInt(box.x,10),parseInt(box.y,10));
            break;
        case "blinkyImg":
            drawBlinky(parseInt(box.x,10),parseInt(box.y,10));
            break;
        default:
            break;
    }
};




function InitBox(){
	document.getElementById("b").addEventListener("keydown",pacmanMove);
    socket.send(JSON.stringify({method:"init"}));
    return;
}

function pacmanMove(e){ 
    console.log(e);  
    socket.send(JSON.stringify({method:"pacman",keyCode:e.keyCode.toString()}));
}

function KeyBox(){
	/*this.node = document.getElementById("square");
	this.left = 0;
    this.top = 0;
    this.width = this.node.clientWidth;
    this.height = this.node.clientHeight;*/
    this.dx = 16;
    this.dy = 16;
}

KeyBox.prototype.move = function(dx,dy) {
    pacmanLayer = document.getElementById("pacman").getContext('2d');
    pacmanLayer.clearRect(0, 0, document.getElementById("pacman").width, document.getElementById("pacman").height);
    drawPacman(dx,dy);
    eatCoin(coinsLayer,dx,dy);
};



function draw(){
        var canvas = document.getElementById('map');
        var mapLayer = canvas.getContext('2d'); 
        base_image = new Image();
        base_image.src = 'img/map.jpg';
        base_image.onload = function(){
        mapLayer.drawImage(base_image, -4, -5, 448 + 8, 496 + 8);        
  }
        coinsLayer = document.getElementById("coins").getContext('2d');
        pacmanLayer = document.getElementById("pacman").getContext('2d');
        blinkyLayer = document.getElementById("blinky").getContext('2d');
}

function drawCoinsMap(x,y) {
    drawCoin(coinsLayer,x,y);
}

function drawCoin(ctx,x,y) {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(x,y,4,4);
}


function drawPacman(x,y) {   
        pacmanLayer.beginPath();
        pacmanLayer.arc(x, y, 8,Math.PI/7,-Math.PI/7,false);
        pacmanLayer.lineTo(x - 2,y + 1);
        pacmanLayer.lineTo(x + 7,y + 4);
        pacmanLayer.fillStyle = "#ff0";
        pacmanLayer.fill();    
}
function eatCoin(ctx,x,y) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x,y,4,4);
}




function drawBlinky(x,y){
   blinkyLayer.beginPath();
    blinkyLayer.fillStyle = "red";
    blinkyLayer.moveTo(x,y + 8);
    blinkyLayer.bezierCurveTo(x,y-16,x+16,y-16,x+16,y + 8);   
    blinkyLayer.fill();     
}

