const app = require("express")();
const cors = require('cors');
app.use(cors())
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
      origin: '*',
    }
  });

  const users = [];


io.on("connection", (socket) => {
    socket.on("message", (message) => {
      io.emit("messageBack", message);
    });

    socket.on("user", (user)=>{
        console.log(user);
        users.push(user);
        io.emit("userUpdate", users);
    })

    socket.on("disconnect", () => {
        for(let i = 0; i < users.length; i++){
            if(users[i].id === socket.id){
                io.emit("messageBack", { name: users[i].name, message: "disconnected" });
                users.splice(i, 1);
            }
        }
        io.emit("userUpdate", users);
      });
  
  });
  
  http.listen(4000, function () {
    console.log("listening on port 4000");
  });