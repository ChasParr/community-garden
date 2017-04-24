let io;

let userNum = 0;

const rooms = [];
const Users = {};
const Names = {};

// game constants
const HEIGHT = 500;
// const WIDTH = 700;
const BOT_MARGIN = 20;

const randColor = () => {
  const red = Math.floor((Math.random() * 255) + 0);
  return `rgb(${red}, ${255 - red}, ${Math.floor((Math.random() * 255) + 0)})`;
};

// create a new room
const createNewRoom = () => {
  const newRoom = {
    roomName: `room${rooms.length}`,
    host: 0,
    Plants: [],
    UserIds: [],
    Func: {},
  };


  newRoom.Func.updatePlants = function () {
    io.sockets.in(newRoom.roomName).emit('updateAllPlants', newRoom.Plants);
  };
    
  rooms.push(newRoom);
  return (rooms.length - 1);
};

const onJoin = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.uid = userNum;
    userNum++;

        // find a room that isn't full or make a new one
    socket.rNum = rooms.findIndex(room => room.UserIds.length < 5);
    if (socket.rNum === -1) {
      socket.rNum = createNewRoom();
    }
    rooms[socket.rNum].UserIds.push(socket.uid);
    if (rooms[socket.rNum].UserIds.length === 1) {
      rooms[socket.rNum].host = socket.uid;
    }
    socket.roomName = `${rooms[socket.rNum].roomName}`;

    socket.join(socket.roomName);

        // add user to users
    Users[socket.uid] = {
      id: socket.uid,
      color: randColor(),
      name: `player ${socket.uid}`,
      room: socket.rNum,
      x: 20,
      y: HEIGHT - BOT_MARGIN,
      points: 0,
      mode: 'none',
      ready: false,
    };

        // add name to indicate it is taken
    Names[Users[socket.uid].name] = socket.uid;
        // give the client the state of the server
    socket.emit('syncClient', {
      id: socket.uid,
      Plants: rooms[socket.rNum].Plants,
      Users,
      rooms,
      roomNum: socket.rNum,
    });

        // send new user's data to all clients
    io.sockets.in(socket.roomName).emit('updateUsers', {
      user: Users[socket.uid],
    });
    io.sockets.in(socket.roomName).emit('updateRoom', {
      room: rooms[socket.rNum],
    });
    io.sockets.in(socket.roomName).emit('newMessage', {
      message: `${Users[socket.uid].name} joined ${socket.roomName}`,
      color: 'black',
    });
    console.log(`someone joined ${socket.roomName}`);
  });

    // remove users if they leave
  socket.on('disconnect', () => {
    socket.leave(socket.roomName);
    if (Users[socket.uid] != null) {
      delete Names[Users[socket.uid].name];
      delete Users[socket.uid];
    } rooms[socket.rNum].UserIds.splice(rooms[socket.rNum].UserIds.indexOf(socket.uid), 1);
    if (rooms[socket.rNum].UserIds.length > 0) {
      if (socket.uid === rooms[socket.rNum].host) {
        io.sockets.in(socket.roomName).emit('hostLeft');
        rooms[socket.rNum].host = rooms[socket.rNum].UserIds[0];
        io.sockets.in(socket.roomName).emit('newMessage', {
          message: `${rooms[socket.rNum].host} is new host`,
          color: 'black',
        });
        console.log(`${rooms[socket.rNum].host} is new host`);
        io.sockets.in(socket.roomName).emit('updateRoom', {
          room: rooms[socket.rNum],
        });
      }
    } else {
      rooms[socket.rNum].host = -1;
    }
    io.sockets.in(socket.roomName).emit('removeUser', {
      id: socket.uid,
    });
    console.log('someone left');
  });

  socket.on('sendMessage', (data) => {
    const newMessage = data.message.replace(/</g, '&lt;');
    io.sockets.in(socket.roomName).emit('newMessage', {
      message: `${Users[socket.uid].name}: ${newMessage}`,
      color: Users[socket.uid].color,
    });
  });

    // get movement on the canvas
  socket.on('userMove', (data) => {
        // check if spectator mode
    if (!Users[socket.uid].spect) {
      Users[socket.uid].x = data.x;
      Users[socket.uid].y = data.y;
            // console.log(data);
      io.sockets.in(socket.roomName).emit('moveUser', {
        id: socket.uid,
        newX: Users[socket.uid].x,
        newY: Users[socket.uid].y,
      });
    }
  });

  socket.on('newPlant', (data) => {
        // console.log(data);
    rooms[socket.rNum].Plants.push(data);
    io.sockets.in(socket.roomName).emit('updateAllPlants', rooms[socket.rNum].Plants);
  });

  socket.on('updateUser', (data) => {
    Users[data.id] = data;
    io.sockets.in(socket.roomName).emit('updateUsers', {
      user: Users[data.id],
    });
  });

  socket.on('changeMode', (data) => {
    Users[socket.uid].mode = data;
    io.sockets.in(socket.roomName).emit('updateUsers', {
      user: Users[socket.uid]
    });
  });

  socket.on('changeName', (data) => {
        // sanitize a bit
    const newName = data.name.replace(/</g, '&lt;');
    console.log(newName);
    if (newName === '') {
      socket.emit('denied', {
        message: 'server: cannot have empty name',
        code: 'name',
      });
    } else if (Names[newName] != null) {
      socket.emit('denied', {
        message: 'server: name already taken',
        code: 'name',
      });
    } else {
            // remove old name
      delete Names[Users[socket.uid].name];
            // add new name
      Names[newName] = socket.uid;
            // set new name
      Users[socket.uid].name = newName;
            // update clients
      io.sockets.in(socket.roomName).emit('updateUsers', {
        user: Users[socket.uid],
      });
    }
  });
};

const setupSockets = (ioServer) => {
  io = ioServer;
  io.on('connection', (socket) => {
    onJoin(socket);
        /*

        */
    console.log('connection');
  });
};

module.exports.setupSockets = setupSockets;
