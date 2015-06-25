var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 1337

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("\nhttp server listening on %d", port)

var wss = new WebSocketServer({ server: server })
console.log("\nwebsocket server created")


var coinsMap = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
       [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
       [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
       [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
       [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
       [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
       [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
       [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
       [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
       [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,1,1,3,1,1,3,1,1,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,0,2,2,0,0,0,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,1,1,1,0,0,2,2,2,2,0,0,1,1,1,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,2,2,2,2,0,0,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
       [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
       [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
       [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
       [0,1,1,1,0,0,1,1,1,1,1,1,3,1,1,3,1,1,1,1,1,1,0,0,1,1,1,0],
       [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
       [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
       [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
       [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
       [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
       [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];


/*
Game initializing
*/

function gameInit(ws){
	console.log("\nmainGameInit...")
	pacmanInit(ws);
}

function drawCoinsMap(ws){
	for (var i = 0; i < 28; i++) {
		for(var j = 0; j < 31; j ++){
			if (coinsMap[j][i] === 1) {
				ws.send(JSON.stringify({pacman:"pacmanCoinsMap",x: (16 * (i + 0.5)).toString(), y: (16 * (j + 0.5)).toString() }))
			}
		}
	}
}




function pacmanInit(ws){
	console.log("\npacmanInit...")
	pacman = new Pacman();
	blinky = new Blinky();
	console.log(blinky['initSearch']);
	blinky.initSearch();
	ws.send(JSON.stringify({pacman:"hello!"}));
}

/*######################################*/


/*
Pacman 
*/

var pacman = null;

function Pacman(){
	this.x = 13.5;
	this.y = 23.5;
}

function drawPacmanImg(ws) {
	ws.send(JSON.stringify({pacman:"pacmanImg",x:((pacman.x)  * 16).toString()
											  ,y:((pacman.y) * 16).toString()}));
}

function pacmanMove(keyCode,ws){
	if (!pacmanNextPointValidation(keyCode)) {
		console.log("wrong point");
		return;
	}
	console.log("move");
	if(keyCode == 37){
		ws.send(JSON.stringify({pacman:"pacmanMovement"
							   ,left:(pacman.x * 16 - 16).toString()
							   ,top:((pacman.y) * 16 + 0).toString()}));
		pacman.x -= 1;		
		return;
	}else if(keyCode == 38){
		ws.send(JSON.stringify({pacman:"pacmanMovement"
							   ,left:(pacman.x * 16).toString()
							   ,top:((pacman.y) * 16 - 16).toString()}));
		pacman.y -= 1;	
		return;
	}else if(keyCode == 39){
		ws.send(JSON.stringify({pacman:"pacmanMovement"
							   ,left:(pacman.x * 16 + 16).toString()
							   ,top:((pacman.y) * 16 + 0).toString()}));
		pacman.x += 1;	
		return;
	}else if(keyCode == 40){
		ws.send(JSON.stringify({pacman:"pacmanMovement"
							   ,left:(pacman.x * 16).toString()
							   ,top:((pacman.y) * 16 + 16).toString()}));
		pacman.y += 1;	
		return;
	}
	return;
}

function pacmanNextPointValidation(keyCode) {
	var currentX = pacman.x - 0.5;
	var currentY = pacman.y - 0.5;
	
	if (keyCode == 37){		
		if ( coinsMap[currentY][currentX - 1] !== 0 ) {			
			return true;
		}
	}else if (keyCode == 38) {
		if (coinsMap[currentY - 1][currentX] !== 0 ) {
			return true;
		}
	}else if (keyCode == 39) {
		if (coinsMap[currentY][currentX + 1] !== 0 ) {
			return true;
		}
	}else if (keyCode == 40) {
		if (coinsMap[currentY + 1][currentX] !== 0 ) {
			return true;
		}
	}
	return false;
}



/*
 *Blinky
 */

var blinky = null;

function Blinky() {
	this.currX = 13.5;
	this.currY = 11.5;
	this.prevX = 0;
	this.prevY = 0;
	
}

function drawBlinky(ws) {
	ws.send(JSON.stringify({pacman:"blinkyImg",x:((blinky.currX)  * 16).toString()
											  ,y:((blinky.currY) * 16).toString()}));
}

Blinky.prototype.move = function (){
	console.log("!!");
	var validPoints = blinky.resolveValidNewPoints();
	console.log(validPoints);
}
Blinky.prototype.findTargetPoint = function(){
	
}
Blinky.prototype.resolveValidNewPoints = function(){
	var validPoints = [];
	if (coinsMap[blinky.currY][blinky.currX - 1] !== 0) {
		validPoints.push({ "x":blinkty.currX - 1, "y": blinky.currY });
	}
	if (coinsMap[blinky.currY- 1][blinky.currX ] !== 0) {
		validPoints.push({ "x":blinkty.currX, "y": blinky.currY - 1 });
	}
	if (coinsMap[blinky.currY][blinky.currX + 1] !== 0) {
		validPoints.push({ "x":blinkty.currX + 1, "y": blinky.currY });
	}
	if (coinsMap[blinky.currY + 1][blinky.currX] !== 0) {
		validPoints.push({ "x":blinkty.currX, "y": blinky.currY + 1 });
	}
	
	return validPoints;
}

Blinky.prototype.initSearch = function (){
	
	while(blinky.currX != pacman.x && blinky.currY != pacman.y){
		console.log("!!");
		blinky.move();
	}
}






/*######################################*/


wss.on("connection", function (ws) {
    ws.on("message", function (message) {
        var clientMessage = JSON.parse(message);
        switch(clientMessage.method){
        	case "init":
        		gameInit(ws);
				drawPacmanImg(ws);
				drawCoinsMap(ws);
				drawBlinky(ws);
        		break;
        	case "pacman":
        		pacmanMove(clientMessage.keyCode,ws);
        		break;
        	default:
        		break;
        }     
                     
    })
    
    ws.on("close", function () {
       
    })

});

