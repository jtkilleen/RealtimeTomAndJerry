var app = require('express')();
var express = require('express');
var mysql = require('mysql');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pass = require('./password.js');

var connection = mysql.createConnection({
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

connection.end();

app.use('/public', express.static(__dirname + "/public"));

var cat = {
	x: 30,
	y: 30
};

    app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/index.html')
	});

	app.get('/animate', function (req, res) {
	    res.sendFile(__dirname + '/animate.html')
	});

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