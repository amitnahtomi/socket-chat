/*const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
*/
const app = require("express")();
const cors = require('cors');
app.use(cors())
const http = require("http").createServer(app);
const io = require("socket.io")(http);


io.on("connection", (socket) => {
    console.log(socket);
    socket.on("message", ({ name, message }) => {
      io.emit("messageBack", { name, message });
    });
    socket.on("disconnect", () => {
        io.emit("messageBack", { name: "wow", message: "render" });
      });
  
  });
  
  http.listen(4000, function () {
    console.log("listening on port 4000");
  });