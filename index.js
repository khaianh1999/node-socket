const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

// const jwt = require('jsonwebtoken');
// // jwt secret
// const JWT_SECRET = 'myRandomHash';


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080", // Vue dev server origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// io.use(async (socket, next) => {
//   console.log('socket', socket);
//   // fetch token from handshake auth sent by FE
//   const token = socket.handshake.auth.token;
//   try {
//     // verify jwt token and get user data
//     const user = await jwt.verify(token, JWT_SECRET);
//     console.log('user', user);
//     // save the user data into socket object, to be used further
//     socket.user = user;
//     next();
//   } catch (e) {
//     // if token is invalid, close connection
//     console.log('error', e.message);
//     return next(new Error(e.message));
//   }
// });

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

io.on("connection", (socket) => {
  console.log("1 thằng connect");

  socket.on("join", (inforUser, callback) => {
    socket.join(inforUser.roomId); // join room
    callback({ // notification
      status: "join",
      succes: true,
    });
    const outgoingMessage = {// data put to room
      userName: inforUser.userName,
      userId: inforUser.userId,
      content: `Welcome ${inforUser.userName} !`,
    };
    // socket.to(inforUser.roomId).emit("message", outgoingMessage);
    io.to(inforUser.roomId).emit('message', outgoingMessage); // emit to the room
  });

  socket.on("client-send-message", (inforUser) => { // 1 message by client
    console.log('msg xxx', inforUser);
    io.to(inforUser.roomId).emit('server-send-message', inforUser); // emit to the room
  });
  return;

  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
  // socket.on("my message", (msg) => {
  //   io.emit("my broadcast", `server: ${msg}`);
  // });


  // join user's own room
  // socket.join(socket.user.id);
  socket.join('myRandomChatRoomId');
  console.log("a user connected2");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("my message", (msg) => {
    console.log("message: " + msg);
    io.emit("my broadcast", `server: ${msg}`);
  });

 

  socket.on("message", ({ message, roomName }, callback) => {
    console.log("message: " + message + " in " + roomName);
    // send socket to all in room except sender
    socket.to(roomName).emit("message", message);
    callback({
      status: "ok"
    });
    const outgoingMessage = {
      name: 'khaidaica',
      id: 1,
      message,
    };
    socket.to('myRandomChatRoomId').emit("message", outgoingMessage);
    // send to all including sender
    // io.to('myRandomChatRoomId').emit("message", outgoingMessage);
  });
  // socket.on('message', ({message, roomName}, callback) => {

  //   console.log("messagexxx: " + message + " in " + roomName);
  
  //   // generate data to send to receivers
  //   const outgoingMessage = {
  //     name: socket.user.name,
  //     id: socket.user.id,
  //     message,
  //   };
  //   // send socket to all in room except sender
  //   socket.to(roomName).emit("message", outgoingMessage);
  //   callback({
  //     status: "ok"
  //   });
  //   // send to all including sender
  //   // io.to(roomName).emit("message", message);
  // });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
