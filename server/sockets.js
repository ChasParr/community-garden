let io;

let userNum = 0;

const Rooms = [];
const Users = {};
const Names = {};

// game constants
const HEIGHT = 500;
// const WIDTH = 700;
const GROUND_LEVEL = 80;
const WATER_SPREAD = 85;
const WATER_OFFSET = 70;
const PLANTS = {
    daisy: {
        SPRITE_ROW: 0,
        STAGES: 4,
        MAX_AGE: 100,
        AGE_INCR: 33, // = MAX_AGE / STAGES - 1 
        HEIGHT: [40, 85, 170, 205],
        WIDTH: [60, 80, 80, 80],
    }
};

const randColor = () => {
  const red = Math.floor((Math.random() * 255) + 0);
  return `rgb(${red}, ${255 - red}, ${Math.floor((Math.random() * 255) + 0)})`;
};

const checkWaterColl = (x1, x2) => {
    return (x1 - x2 <= WATER_SPREAD + WATER_OFFSET && x1 - x2 >= WATER_OFFSET);
}

// create a new room
const createNewRoom = () => {
  const newRoom = {
    roomName: `room${Rooms.length}`,
    host: 0,
    Plants: [],
    UserIds: [],
    Watering: [],
    Func: {},
  };


  newRoom.Func.updatePlants = function () {
    for (let i = 0; i < newRoom.Plants.length; i++){
        let plant = newRoom.Plants[i]
        if (plant.water > 0){
            plant.water--;
            if (plant.age < PLANTS[plant.type].MAX_AGE){
                plant.age++;
            }
        }
        
        if (plant.age >= (plant.stage + 1) * PLANTS[plant.type].AGE_INCR){
            plant.stage++;
            plant.height = PLANTS[plant.type].HEIGHT[plant.stage];
            plant.width = PLANTS[plant.type].WIDTH[plant.stage];
        }
        newRoom.Plants[i] = plant;
    }
    io.sockets.in(newRoom.roomName).emit('updateAllPlants', newRoom.Plants);
  };
    
  newRoom.Func.checkWatering = function () {
      if (newRoom.Watering.length > 0) {
          for (let i = newRoom.Watering.length - 1; i >= 0; i--){
              let user = Users[newRoom.Watering[i]];
              if (user.mode !== 'watering'){
                  newRoom.Watering.splice(i, 1);
              } else {
                  if (user.water <= 0){
                      user.water = 0;
                      user.mode = 'water';
                  } else {
                      for (let i = 0; i < newRoom.Plants.length; i++){
                        if (checkWaterColl(user.x, newRoom.Plants[i].x) && newRoom.Plants[i].water < 100){
                            newRoom.Plants[i].water++;
                            user.points++;
                            io.sockets.in(newRoom.roomName).emit('updatePlant', {
                                index: i, plant: newRoom.Plants[i]
                            });
                        }
                      }
                      user.water--;
                  }
                  Users[newRoom.Watering[i]] = user;
                  io.sockets.in(newRoom.roomName).emit('updateUsers', {
                      user: user
                  });
              }
          }
      }
  }
    
  Rooms.push(newRoom);
  return (Rooms.length - 1);
};

const onJoin = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.uid = userNum;
    userNum++;

        // find a room that isn't full or make a new one
    socket.rNum = Rooms.findIndex(room => room.UserIds.length < 5);
    if (socket.rNum === -1) {
      socket.rNum = createNewRoom();
    }
    Rooms[socket.rNum].UserIds.push(socket.uid);
    if (Rooms[socket.rNum].UserIds.length === 1) {
      Rooms[socket.rNum].host = socket.uid;
    }
    socket.roomName = `${Rooms[socket.rNum].roomName}`;

    socket.join(socket.roomName);

        // add user to users
    Users[socket.uid] = {
      id: socket.uid,
      color: randColor(),
      name: `player ${socket.uid}`,
      room: socket.rNum,
      x: 20,
      y: HEIGHT - GROUND_LEVEL,
      points: 0,
      water: 100,
      mode: 'none'
    };

        // add name to indicate it is taken
    Names[Users[socket.uid].name] = socket.uid;
        // give the client the state of the server
    socket.emit('syncClient', {
      id: socket.uid,
      Plants: Rooms[socket.rNum].Plants,
      Users,
      Rooms,
      roomNum: socket.rNum,
    });

        // send new user's data to all clients
    io.sockets.in(socket.roomName).emit('updateUsers', {
      user: Users[socket.uid],
    });
    io.sockets.in(socket.roomName).emit('updateRoom', {
      room: Rooms[socket.rNum],
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
    } Rooms[socket.rNum].UserIds.splice(Rooms[socket.rNum].UserIds.indexOf(socket.uid), 1);
    if (Rooms[socket.rNum].UserIds.length > 0) {
      if (socket.uid === Rooms[socket.rNum].host) {
        io.sockets.in(socket.roomName).emit('hostLeft');
        Rooms[socket.rNum].host = Rooms[socket.rNum].UserIds[0];
        io.sockets.in(socket.roomName).emit('newMessage', {
          message: `${Rooms[socket.rNum].host} is new host`,
          color: 'black',
        });
        console.log(`${Rooms[socket.rNum].host} is new host`);
        io.sockets.in(socket.roomName).emit('updateRoom', {
          room: Rooms[socket.rNum],
        });
      }
    } else {
      Rooms[socket.rNum].host = -1;
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
    if (!Users[socket.uid].mode != 'none') {
      //console.log(data);
      Users[socket.uid].x = data.x;
      Users[socket.uid].y = data.y;
            // console.log(data);
      io.sockets.in(socket.roomName).emit('moveUser', {
        id: socket.uid,
        newX: data.x,
        newY: data.y
      });
    }
  });

  socket.on('newPlant', (data) => {
         console.log(data);
    let newPlant = {
        x: data.x,
        y: HEIGHT - GROUND_LEVEL,
        age: 0,
        stage: 0,
        water: 0,
        owner: socket.uid,
        ownerName: Users[socket.uid].name,
        type: data.type,
        maxAge: PLANTS[data.type].MAX_AGE,
        ageIncr: PLANTS[data.type].AGE_INCR,
        stages: PLANTS[data.type].STAGES,
        height: PLANTS[data.type].HEIGHT[0],
        width: PLANTS[data.type].WIDTH[0],
        spriteRow: PLANTS[data.type].SPRITE_ROW
    }
    Rooms[socket.rNum].Plants.push(newPlant);
    let newIndex = Rooms[socket.rNum].Plants.length - 1;
    io.sockets.in(socket.roomName).emit('updatePlant', {
        index: newIndex, plant: Rooms[socket.rNum].Plants[newIndex]
    });
  });

  socket.on('updateUser', (data) => {
    Users[data.id] = data;
    io.sockets.in(socket.roomName).emit('updateUsers', {
      user: Users[data.id],
    });
  });

  socket.on('changeMode', (data) => {
    Users[socket.uid].mode = data;
    if (data === 'watering'){
        Rooms[socket.rNum].Watering.push(socket.uid);
    }
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
    
const updateTime = () => {
    const userKeys = Object.keys(Users);
    
    for (let i = 0; i < userKeys.length; i++){
        if (Users[userKeys[i]].water < 100){
            Users[userKeys[i]].water++;
        }
    }
    for (let i = 0; i < Rooms.length; i++){
        Rooms[i].Func.updatePlants();
    }
}

const updateTick = () => {
    for (let i = 0; i < Rooms.length; i++){
        Rooms[i].Func.checkWatering();
    }
}

const setupSockets = (ioServer) => {
  io = ioServer;
  io.on('connection', (socket) => {
    onJoin(socket);
    console.log('connection');
  });
    setInterval(() => {
      updateTime();
    }, 10000);
    
    setInterval(() => {
       updateTick(); 
    }, 100);
    
};

module.exports.setupSockets = setupSockets;
