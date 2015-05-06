var app = require('express')();
var express = require('express');

var mysql = require('mysql');

var js = require('js/Queue.js');

var http = require('http').Server(app);
var io = require('socket.io')(http);
//var pass = require('./password.js');

/*var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: pass.username(),
	password: pass.password(),
	database: 'news'	
});

connection.connect();

connection.query('SELECT * from accounts', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();*/

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

app.use('/public', express.static(__dirname + "/public"));
app.use('/css', express.static(__dirname + "/css"));

//code.stephenmorley.org
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};

var cat = {
	x: 30,
	y: 30
};

var mouse = {
	x: 50,
	y: 50
};

var line = {
	x: 0
}

var pow = {
  		x: 250,
  		y: 250
  	}
var pow2 = {
		x: 500,
		y: 500
}
var lineClick = false;
var queue = new Queue();
var mousequeue = new Queue();
var players = [];
var lineVisible = false;
var powerUpVisible1 = false;
var powerUpVisible2 = false;
var powerUpVisible3 = false;
var speedPowerUp = false;
var laserBeamVisible = false;

    app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/index.html')
	});

	app.get('/animate', function (req, res) {
	    res.sendFile(__dirname + '/animate.html')
	});

	io.on('connection', function(socket) {
		players.push(socket);
		io.emit("playerCountUpdate", players.length);
		var startmsg = {
			cat: cat,
			mouse: mouse
		}
		socket.emit('start', startmsg);
		console.log(players.indexOf(socket));
		socket.emit('getPlayerId', players.indexOf(socket));
		socket.on('movement', function(msg){
			if(msg.playerid == 0)
			{
				mousequeue.enqueue(msg)
			}
			else
			{
				queue.enqueue(msg);
			}
		});

		socket.on('GAMEOVER', function(player)
		{
			if(player == "TOM")
			{
				io.emit('clearCanvas', "TOM");
			}
			else
			{
				io.emit('clearCanvas', "JERRY");
			}
		})

		socket.on('changeLine', function(msg) {
			lineClick = true;
			line.x = msg;
			io.emit('addLine', msg);
			powerUpVisible1 = false;
			lineVisible = true;
		});

		socket.on('lazor', function(){
			console.log('emitted laser');
			io.emit('showLaser');
			powerUpVisible2 = false;
			laserBeamVisible = true;
		});

		socket.on('speed', function(){
			console.log('emitted speed');
			powerUpVisible3 = false;
			speedPowerUp = true;
		});

		socket.on('disconnect', function() {
			console.log("disconnect");
			var i = players.indexOf(socket);
			console.log(i);
			players = players.splice(1,i);
			io.emit("playerCountUpdate", players.length);
			io.emit('playerLeft', i);
		});

		socket.on('RESET', function() {
			cat.x = 30;
			cat.y = 30;
			mouse.x = 50;
			mouse.y = 50;
			var startmsg = {
				cat: cat,
				mouse: mouse
			}
			start = new Date;
			socket.emit('restart', startmsg);
		});
	});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

var firstPow = Math.floor((Math.random() * 10) + 105);
var secondPow = Math.floor((Math.random() * 10) + 80);
var thirdPow = Math.floor((Math.random() * 10) + 30);
console.log(firstPow);
var start = new Date;
setInterval(function() {
  var secondsLeft = 121 - ((new Date - start) / 1000);
  io.emit('updateTimer', secondsLeft);
  console.log(secondsLeft)
  if (secondsLeft <= 0){
    console.log("GAME OVER - JERRY WINS!");
	io.emit('clearCanvas', "JERRY");
  }
  if(secondsLeft <= firstPow && secondsLeft >= firstPow-1)
  {
  	
  	console.log("Sent powerup");
  	pow.x = Math.floor((Math.random() * 500) + 1);
  	pow.y = Math.floor((Math.random() * 375) + 1);
  	powerUpVisible1 = true;
  	io.emit("linePowerup", pow);
  }
  if(secondsLeft <= secondPow && secondsLeft >= secondPow-1)
  {
  	
  	console.log("Sent powerup2");
  	pow2.x = Math.floor((Math.random() * 500) + 1);
  	pow2.y = Math.floor((Math.random() * 375) + 1);
  	powerUpVisible2 = true;
  	io.emit("laserPowerup", pow2);
  }
  if(secondsLeft <= thirdPow && secondsLeft >= thirdPow-1)
  {
  	
  	console.log("Sent powerup3");
  	pow2.x = Math.floor((Math.random() * 500) + 1);
  	pow2.y = Math.floor((Math.random() * 375) + 1);
  	powerUpVisible3 = true;
  	io.emit("speedPowerup", pow2);
  }
  if (lineVisible){
  	io.emit("addLine", line.x);
  }
  if (powerUpVisible2){
  	io.emit("laserPowerup", pow2);
  }
  if (powerUpVisible1){
  	io.emit("linePowerup", pow);
  }
  if (laserBeamVisible){
  	io.emit("showLaser");
  }
}, 1000);

setInterval(function(){
		if (queue.peek() != undefined && speedPowerUp){
			console.log("Sped up!")
			var msg2 = queue.dequeue();
			console.log(msg2);
			cat.x = msg2.x;
			cat.y = msg2.y;
			if(msg2.key == 87)
	      	{
	      	 cat.y = msg2.y - 20;
	      	}
	      	if(msg2.key == 68)
	      	{
	      	  cat.x = msg2.x + 20;
	      	}
	      	if(msg2.key == 65)
	      	{
	      	  cat.x = msg2.x - 20;
	      	}
	      	if(msg2.key == 83)
	      	{
	      	  cat.y = msg2.y + 20;
	      	}
	      	if(cat.x > 500)
	      	{
	      		cat.x = -250;
	      	}
	      	else if(cat.x < -250)
	      	{
	      		cat.x = 500
	      	}
	      	if(cat.y < -180)
	      	{
	      		cat.y = 375
	      	}
	      	else if(cat.y > 375)
	      	{
	      		cat.y = -180;
	      	}
	      	console.log(cat);
	      	var newmsg = {
	      		cat: cat,
	      		key: msg2.key
	      	};
			io.emit('movement', newmsg)
			if (queue.peek() != undefined){
				io.emit('lookahead', queue.peek());
			} else{
				io.emit('lookahead', "nothing");
			}
		}
		else if (queue.peek() != undefined){
			var msg2 = queue.dequeue();
			console.log(msg2);
			cat.x = msg2.x;
			cat.y = msg2.y;
			if(msg2.key == 87)
	      	{
	      	 cat.y = msg2.y - 10;
	      	}
	      	if(msg2.key == 68)
	      	{
	      	  cat.x = msg2.x + 10;
	      	}
	      	if(msg2.key == 65)
	      	{
	      	  cat.x = msg2.x - 10;
	      	}
	      	if(msg2.key == 83)
	      	{
	      	  cat.y = msg2.y + 10;
	      	}
	      	if(cat.x > 500)
	      	{
	      		cat.x = -250;
	      	}
	      	else if(cat.x < -250)
	      	{
	      		cat.x = 500
	      	}
	      	if(cat.y < -180)
	      	{
	      		cat.y = 375
	      	}
	      	else if(cat.y > 375)
	      	{
	      		cat.y = -180;
	      	}
	      	console.log(cat);
	      	var newmsg = {
	      		cat: cat,
	      		key: msg2.key
	      	};
			io.emit('movement', newmsg)
			if (queue.peek() != undefined){
				io.emit('lookahead', queue.peek());
			} else{
				io.emit('lookahead', "nothing");
			}
		}
		if (mousequeue.peek() != undefined){
			var msg2 = mousequeue.dequeue();
			console.log(msg2);
			mouse.x = msg2.x;
			mouse.y = msg2.y;
			if(msg2.key == 87)
	      	{
	      	 mouse.y = msg2.y - 10;
	      	}
	      	if(msg2.key == 68)
	      	{
	      	  mouse.x = msg2.x + 10;
	      	}
	      	if(msg2.key == 65)
	      	{
	      	  mouse.x = msg2.x - 10;
	      	}
	      	if(msg2.key == 83)
	      	{
	      	  mouse.y = msg2.y + 10;
	      	}
	      	if(mouse.x > 500)
	      	{
	      		mouse.x = -400/3;
	      	}
	      	else if(mouse.x < -400/3)
	      	{
	      		mouse.x = 500
	      	}
	      	if(mouse.y < -75)
	      	{
	      		mouse.y = 375
	      	}
	      	else if(mouse.y > 375)
	      	{
	      		mouse.y = -75;
	      	}

	      	if (lineClick)
            {
              if(mouse.x + 400/3 > line.x - 15 && mouse.x + 400/3 < line.x)
              {
                mouse.x = line.x - 15 - 400/3;
              }
              else if(mouse.x > line.x && mouse.x < line.x + 15)
              {
                mouse.x = line.x + 15;
              }
            }
	      	console.log(mouse);
	      	var newmsg = {
	      		mouse: mouse,
	      		key: msg2.key
	      	};
			io.emit('mouseMovement', newmsg)
			if (mousequeue.peek() != undefined){
				io.emit('lookahead', mousequeue.peek());
			} else{
				io.emit('lookahead', "nothing");
			}
		}
}, 10);
