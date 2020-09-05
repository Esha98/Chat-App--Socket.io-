const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formateMessage = require("./Util/messages");
const {
  userJoin,
  currentUser,
  userLeave,
  getRoomUsers,
} = require("./Util/Users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set Static folder
app.use(express.static(path.join(__dirname, "Client")));

const botName = "Admin Bot";
//Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome Current User
    socket.emit("message", formateMessage(botName, "Welcome to chatChord"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formateMessage(botName, `${user.username} has joined the chat`)
      );


      //send users and room info
      io.to(user.room).emit('roomUsers', {
          room: user.room,
          users:getRoomUsers(user.room)
      });
    //Runs when client disconnect
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formateMessage(botName, `${user.username} has left the chat`)
        );
      }

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users:getRoomUsers(user.room)
        });
    });
  });

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = currentUser(socket.id);
    io.to(user.room).emit("message", formateMessage(`${user.username}`, msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running in ${PORT}`));
