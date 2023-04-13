const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "https://vc-chat-app-frontend.vercel.app/" // replace with hosted web-app link
    }
});

//---Socket Block -----------

let users=[];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message', (data) => {
      socketIO.emit('messageResponse',data);
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));
    
   //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    users.push(data);
    socketIO.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});

//--------- App routing ----------------------------

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});