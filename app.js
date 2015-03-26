var app = require('express')();
var express = require('express');
var js = require('js/Queue.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static(__dirname + "/public"));

//code.stephenmorley.org
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};

var cat = {
	x: 30,
	y: 30
};

var queue = new Queue();

    app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/index.html')
	})

	io.on('connection', function(socket) {
		socket.on('movement', function(msg){
			//io.emit('movement', msg);
			queue.enqueue(msg)
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
  			io.emit('movement', msg2)
  		}
	}, 500);