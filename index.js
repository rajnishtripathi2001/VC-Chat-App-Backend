import { Server, Socket } from "socket.io";

const io = new Server(4000);

io.on("connection",(socket) =>{
    console.log("🔥 : connection stablished")
});
