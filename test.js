var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
	file.serve(req, res);
}).listen(8080, ()=>{
    console.log('OKK');
});

var io = require('socket.io').listen(app);

console.log(io);