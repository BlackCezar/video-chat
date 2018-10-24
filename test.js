var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
	file.serve(req, res);
}).listen(8081, ()=>{
    console.log('OKK');
});

var io = require('socket.io').listen(app);

var managers = [], iterator = 0;


io.on('connection', function(socket) {
    let remoteId;
    socket.on('msg', data => {
        socket.broadcast.to(remoteId).emit('msg', data);
    })
    
    socket.on('manager', data => {
        if (data.manager) {
            managers.push(socket.id);
        }
    })

    socket.on('find', function(data) {
        if (data.find) {
            socket.to(managers[iterator]).emit('notification', socket.id);
        } else 
        if (data.managerForUserId) {
            clearManagers(socket.id);
            remoteId = data.managerForUserId;
            socket.broadcast.to(data.managerForUserId).emit('response', socket.id);
        } else if (data.id){
            remoteId = data.id;
        } 
        else {
            iterator++;
            socket.to(managers[iterator]).emit('notification', socket.id);
        }
    })

    socket.on('disconnect', reasen => {
        managers = clearManagers(socket.id);
    })
})

function clearManagers (id) {
    let i = managers.indexOf(id);
    managers.splice(i, 1);
    return managers;
}