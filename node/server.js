var express = require('express');
var http = require("http");
var socketio = require("socket.io");
var port = process.env.PORT || 5000;

// setup express
var app = express();
app.configure(function(){
    app.use(express.static( __dirname + '/public'));
});

// setup server
var server = http.createServer(app);
server.listen(port, function(){
    console.log("Demo Express server listening on port %d in %s mode", port, app.settings.env);
});


// setup socket.io
var io = socketio.listen(server);

// socket.io events
io.sockets.on('connection', function(socket){
    console.log('socket.io: connection');

    socket.on('room', function(data){
        console.log(data);
        socket.in(data['roomName']);
        socket.join(data['roomName'], function(){});
        io.sockets.socket('', false);
        socket.emit('message', 'socket.io: You joined ' + data['roomName'] + '!');
    });

    socket.on('message', function(data){
        socket.emit('echo', data);
    });

    socket.on('disconnect', function(){
        console.log('socket.io: disconnect');
    });
});