var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static(__dirname + "/public"));

var cat = {
	x: 30,
	y: 30
};

    app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/index.html')
	})

	io.on('connection', function(socket) {
		socket.on('movement', function(msg){
			cat.x = msg.x;
			cat.y = msg.y;
			io.emit('movement', msg);
		});
	});

	http.listen(3000, function() {
		console.log('listening on *:3000');
	});