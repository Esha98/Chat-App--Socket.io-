const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Socket } = require('dgram');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set Static folder
app.use(express.static(path.join(__dirname, 'Client')));

//Run when client connects
io.on('connection', socket => {
   
    // Welcome Current User
    socket.emit('message', 'Welcome to chatChord');

    //Broadcast when a user connects
    socket.broadcast.emit('message','A User has joined the chat ');

    //Runs when client disconnect
    socket.on('disconnect', ()=>{
        io.emit('message', 'A User has left the chat');
    });

    //Listen for chat message
    socket.on('chatMessage', (msg)=> {
        io.emit('message', msg);
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running in ${PORT}`) );