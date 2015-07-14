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


var blinkyInterval;
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
       [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
       [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
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
	blinky = new Blinky(ws);
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

function Blinky(wS) {
	this.currX = 13;
	this.currY = 11;
	this.mapX = 13;
	this.mapY = 11;
	this.prevX = 0;
	this.prevY = 0;	
	this.ws = wS;	
}

function drawBlinky(ws) {
	ws.send(JSON.stringify({pacman:"blinkyImg",x:((blinky.currX)  * 16).toString()
											  ,y:((blinky.currY + 0.5) * 16).toString()}));
    blinky.prevX = blinky.mapX;
	blinky.prevY = blinky.mapY;
}

Blinky.prototype.initSearch = function (){	
	blinkyInterval = setInterval(blinky.move,500);
}
Blinky.prototype.move = function (){
	console.log("!!");
	var validPoints = blinky.resolveValidNewPoints();
	var targetPoint = blinky.findTargetPoint(validPoints);
	blinky.drawNewBlinky(blinky.ws,targetPoint.points.x,targetPoint.points.y);
}
Blinky.prototype.resolveValidNewPoints = function(){
	var validPoints = [];
	if (coinsMap[blinky.mapY][blinky.mapX - 1] !== 0) {
		validPoints.push({ "x":blinky.mapX - 1, "y": blinky.mapY });
	}
	if (coinsMap[blinky.mapY - 1][blinky.mapX ] !== 0) {
		validPoints.push({ "x":blinky.mapX, "y": blinky.mapY - 1 });
	}
	if (coinsMap[blinky.mapY][blinky.mapX + 1] !== 0) {
		validPoints.push({ "x":blinky.mapX + 1, "y": blinky.mapY });
	}
	if (coinsMap[blinky.mapY + 1][blinky.mapX] !== 0) {
		validPoints.push({ "x":blinky.mapX, "y": blinky.mapY + 1 });
	}
	console.log(validPoints);	
	return validPoints;
}
Blinky.prototype.findTargetPoint = function(validPoints){
	var targetPoints = validPoints;
	for (var i = 0; i < targetPoints.length; i++) {
		if(targetPoints[i].x === blinky.prevX && targetPoints[i].y === blinky.prevY){
			targetPoints[i] = null;
		}
	}
	
	var pointsWithoutTurningBack = [];
	for (var j = 0; j < targetPoints.length; j++) {
		if(targetPoints[j] !== null){
			pointsWithoutTurningBack.push(targetPoints[j]);
		}		
	}
	console.log(targetPoints);
	var vectorToPacman = [];
	if(pointsWithoutTurningBack.length === 1){
		vectorToPacman[0] = {};
		vectorToPacman[0].points = {x: pointsWithoutTurningBack[0].x,
								 y: pointsWithoutTurningBack[0].y };
		return vectorToPacman[0];
	}
	
	for (var k = 0; k < pointsWithoutTurningBack.length; k++) {
		var vectorX = Math.abs( pacman.x - pointsWithoutTurningBack[k].x ) * Math.abs( pacman.x - pointsWithoutTurningBack[k].x );
		var vectorY = Math.abs( pacman.y - pointsWithoutTurningBack[k].y ) * Math.abs( pacman.y - pointsWithoutTurningBack[k].y );
		vectorToPacman[k] = {};
		vectorToPacman[k].value =  Math.sqrt(vectorX + vectorY);
		vectorToPacman[k].points = {x: pointsWithoutTurningBack[k].x,
									y: pointsWithoutTurningBack[k].y }; 
	}
	vectorToPacman.sort(function(a,b){return a.value - b.value});
	console.log(vectorToPacman);
	
	return vectorToPacman[0];		
}
Blinky.prototype.drawNewBlinky = function(ws,x,y){
	
	console.log(x,y);
	ws.send(JSON.stringify({pacman:"blinkyImg",x:((x)  * 16).toString()
											  ,y:((y + 0.5) * 16).toString()}));
    blinky.prevX = blinky.mapX;
	blinky.prevY = blinky.mapY;
	blinky.mapX = x;
	blinky.mapY = y;
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

