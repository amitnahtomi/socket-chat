const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
      origin: '*',
    }
  });

  const users = [];


io.on("connection", (socket) => {
    socket.on("message", (message) => {
        if(message.sendTo.name !== 'everyone') {
            io.to(message.sendTo.id).emit("messageBack", message);
        }
        else {
            io.emit("messageBack", message);
        }
    });

    socket.on("user", (user)=>{
        users.push(user);
        io.emit("userUpdate", users);
    })

    socket.on("disconnect", () => {
        for(let i = 0; i < users.length; i++){
            if(users[i].id === socket.id){
                io.emit("messageBack", { name: users[i].username, message: "disconnected", time: new Date().toLocaleString().slice(11, 17), type: 'message', sendTo: {name: 'everyone', id: ''} });
                users.splice(i, 1);
                break;
            }
        }
        io.emit("userUpdate", users);
      });
  
  });
  
  http.listen(4000, function () {
    console.log("listening on port 4000");
  });