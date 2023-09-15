import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const server = createServer(app);
const port = 3000;
app.use(cors());


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("new-user-joined", (payload) => {
    socket.join(payload.roomID);
    socket.to(payload.roomID).emit("user-joined", {
      message: `${payload.userName} has Joined the Room.`,
      position: "center"
    });
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected of ID: ", socket.id);
  });
  socket.on("send_message", (payload) => {
    socket.to(payload.roomId).emit("recieve_message", payload);
  });
});

server.listen(port, () => {
  console.log(`listening to port ${port}`);
});

io.listen(3001);
