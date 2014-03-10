var express = require('express');
var http = require("http");
var socketio = require("socket.io");
var port = process.env.PORT || 5000;
var password = "1234";

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

io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {
        console.log(handshakeData);
        //callback(null, true); // error first callback style 
        if(handshakeData.query.password == password){
            callback(null, true);
        }else{
            callback(null, false);
        }
    });
});

// socket.io events
var chat = io.sockets.on('connection', function(socket){
    console.log('socket.io: connection');

    socket.on('room', function(data){
        var roomName = data['roomName'];
        socket.join(roomName);
        socket.set('roomName', roomName);

        console.log("room");
        console.log(data);
        console.log(io.sockets.manager.rooms);
        console.log(socket.id);
        console.log(socket.handshake);
        console.log();

        chat.to(roomName).emit(
            'message',
             {
                    devName: "admin",
                    msg: socket.id + ' is logged in ' + roomName + '!'
             }
         );
    });

    socket.on('message', function(data){

        var roomName, devName;

        socket.get('roomName', function(err, _val) {
            roomName = _val;
        });

        chat.to(roomName).emit(
            'message', 
            {
                devName: socket.id,
                msg: data.msg
            }
        );
    });

    socket.on('disconnect', function(){
        console.log('socket.io: disconnect');
    });
});