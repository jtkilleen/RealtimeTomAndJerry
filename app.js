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

var queue = new Queue();
var mousequeue = new Queue();
var players = [];

    app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/index.html')
	});

	app.get('/animate', function (req, res) {
	    res.sendFile(__dirname + '/animate.html')
	});

	io.on('connection', function(socket) {
		players.push(socket);
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

		socket.on('GAMEOVER', function()
		{
			console.log("GAME OVER!");
		})

		socket.on('disconnect', function() {
			console.log("disconnect");
			var i = players.indexOf(socket);
			console.log(i);
			players = players.splice(1,i);
			io.emit('playerLeft', i);
		});
	});

http.listen(3000, function() {
	console.log('listening on *:3000');
});


setInterval(function(){
		if (queue.peek() != undefined){
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
	      		cat.x = -75;
	      	}
	      	else if(cat.x < -75)
	      	{
	      		cat.x = 500
	      	}
	      	if(cat.y < -75)
	      	{
	      		cat.y = 375
	      	}
	      	else if(cat.y > 375)
	      	{
	      		cat.y = -75;
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
	      		mouse.x = -75;
	      	}
	      	else if(mouse.x < -75)
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
