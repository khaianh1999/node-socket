const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// const usersRoutes = require('./src/routes/usersRoutes');
// const db = require('./src/config/db'); // Ensure the database connection is initialized

const app = express();
const server = http.createServer(app);

// app.use('/api', usersRoutes);

const roomAll = {
  maleRooms: new Map(),
  femaleRooms: new Map(),
};

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080", // Vue dev server origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (inforUser, callback) => {
    const { userId, userName, gender } = inforUser;
    let joinedRoom = null;

    // Chọn mục tiêu phòng ngược lại
    const targetRooms = gender === 'male' ? roomAll.femaleRooms : roomAll.maleRooms;

    // Tìm phòng của giới tính ngược lại có size là 1 để join vào
    for (const [room, size] of targetRooms.entries()) {
      if (size === 1) {
        socket.join(room);
        targetRooms.set(room, size + 1);
        joinedRoom = room;
        break;
      }
    }

    // Nếu không tìm thấy phòng phù hợp, tạo phòng mới
    if (!joinedRoom) {
      joinedRoom = `${gender}-${Date.now()}`;
      socket.join(joinedRoom);
      const userRooms = gender === 'male' ? roomAll.maleRooms : roomAll.femaleRooms;
      userRooms.set(joinedRoom, 1);
    } else {
      const userRooms = gender === 'male' ? roomAll.maleRooms : roomAll.femaleRooms;
      userRooms.set(joinedRoom, 2); // Cập nhật phòng đã join với size 2
    }

    // Gửi phản hồi về việc join phòng
    if (callback) callback({
      status: "join",
      success: true,
      roomId: joinedRoom,
    });

    const outgoingMessage = {
      userName,
      userId,
      content: `Welcome ${userName} !`,
      type: "welcome",
    };
    io.to(joinedRoom).emit('message', outgoingMessage); // emit to the room
  });

  socket.on("client-send-message", (inforUser) => { // 1 message by client
    console.log('msg:', inforUser);
    io.to(inforUser.roomId).emit('server-send-message', {...inforUser, type: "message"}); // emit to the room
  });

  socket.on('disconnecting', () => {
    console.log('socket.rooms', socket.rooms);
    const roomsArray = Array.from(socket.rooms);
    roomsArray.forEach((room) => {
      if (room !== socket.id) {
        const gender = room.startsWith('male') ? 'male' : 'female';
        const userRooms = gender === 'male' ? roomAll.maleRooms : roomAll.femaleRooms;

        if (userRooms.has(room)) {
          userRooms.set(room, userRooms.get(room) - 1);
          if (userRooms.get(room) === 0) {
            userRooms.delete(room);
          }
        }

        const numMembers = userRooms.get(room) || 0;
        console.log(`Room ${room} left. Total members: ${numMembers}`);
        const data = {
          content: "Đối phương đã thoát khỏi phòng!",
          roomId: room,
          userName: "",
          userId: "",
          type: "disconnecting",
        }
        io.to(room).emit('server-disconnecting', data);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
