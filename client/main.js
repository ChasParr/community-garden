let canvas;
let ctx;
let socket;
let id;
let roomNum;
let plantSpritesheet;
let UISpritesheet;
let draws = [];
let ui = []
let users = {};
let rooms = [];
let messages = [];
let hoverTarget = -1;
let hoverLock = -1;
let uiHover = -1;
let lastUpdate;
let waterFrame = 0;

// game constants
const HEIGHT = 500;
const WIDTH = 700;
const GROUND_LEVEL = 80;

const handleMove = (e) => {
    let newX = e.clientX - canvas.offsetLeft;
    let newY = e.clientY - canvas.offsetTop;
    users[id].x = newX;
    users[id].y = newY;

    socket.emit('userMove', { x: newX, y: newY });
    
    // check for ui hover
    uiHover = -1;
    for (let i = ui.length - 1; i >= 0; i--){
        if (Math.abs(newX - ui[i].x) < (ui[i].width * ui[i].scale) / 2 && Math.abs(newY - ui[i].y) < (ui[i].height * ui[i].scale) / 2){
            uiHover = i;
            break;
        }
    }
    // check for hover
    hoverTarget = -1;
    for (let i = draws.length - 1; i >= 0; i--){
        if (Math.abs(newX - draws[i].x) < draws[i].width / 2 && draws[i].y - newY < draws[i].height && draws[i].y - newY > 0){
            hoverTarget = i;
            break;
        }
    }
    
}

const handleClick = (e) => {
    if (e.button === 0){
        if (uiHover >= 0){
            socket.emit('changeMode', ui[uiHover].mode);
        } else if (users[id].mode === 'water'){
            socket.emit('changeMode', 'watering');
        } else if (users[id].mode === 'seed'){
            socket.emit('newPlant', {x: users[id].x, type: 'daisy'});
        } else {
            if (hoverTarget >= 0){
                hoverLock = hoverTarget;
            } else if (hoverLock >= 0){
                hoverLock = -1;
            }
        }
    } else if (e.button === 2) {
        socket.emit('changeMode', 'none');
    }
    
    e.preventDefault();
}

const endClick = (e) => {
    if (users[id].mode === 'watering'){
        socket.emit('changeMode', 'water');
    }
    e.preventDefault();
}

const handleLeave = (e) => {
    socket.emit('changeMode', 'none');
}

const setupUI = () => {
    // watering can
    ui.push({
        x: 80,
        y: 60,
        spritesheet: 'ui',
        row: 0,
        col: 0,
        height: 130,
        width: 160,
        scale: 0.70,
        mode: 'water'
    });
    // seed
    ui.push({
        x: 180,
        y: 50,
        spritesheet: 'plant',
        row: 0,
        col: 0,
        height: 40,
        width: 60,
        scale: 1,
        mode: 'seed'
    });
    // store
    /*
    ui.push({
        x: WIDTH - 80,
        y: 50,
        spritesheet: 'ui,
        row: 2,
        col: 1,
        height: 80,
        width: 50,
        scale: 1,
        mode: 'store'
    })
    */
    // help
    ui.push({
        x: WIDTH - 50,
        y: HEIGHT - 50,
        spritesheet: 'ui',
        row: 2,
        col: 0,
        height: 80,
        width: 50,
        scale: .9,
        mode: 'help'
    });
    console.log('ui set up');
}

const init = () => {
    lastUpdate = new Date().getTime();
    plantSpritesheet = document.querySelector('#plantSpritesheet');
    UISpritesheet = document.querySelector('#UISpritesheet');
    
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext('2d');

    socket = io.connect();

    socket.on('connect', () => {
        console.log('connecting');
        socket.emit('join', {});
    });

    socket.on('disconnect', () => {
        socket.emit('leave', {
            uid: id
        });
    });

    socket.on('syncClient', (data) => {
        console.log(data);
        id = data.id;
        draws = data.Plants;
        users = data.Users;
        rooms = data.Rooms;
        roomNum = data.roomNum;
        console.log(data.Rooms);
        console.log(rooms);
        setInterval(draw, 16);
        syncName();
        console.log('synced');
    });

    // in update.js
    socket.on('updateRoom', updateRoom);
    socket.on('updateUsers', updateUsers);
    socket.on('moveUser', updateUserPosition);
    socket.on('removeUser', removeUser);
    socket.on('updatePlant', updatePlant);
    socket.on('updateAllPlants', updateAllPlants);
    socket.on('reset', syncAll);
    socket.on('newMessage', newMessage);
    socket.on('denied', denied);
    socket.on('syncRoom', syncAll);
    // in host.js


    const userForm = document.querySelector("#userSettings");
    const nameField = document.querySelector("#nameField");
    userForm.addEventListener('submit', (e) => {
        socket.emit('changeName', {
            name: nameField.value
        });
        e.preventDefault();
    });

    const messageForm = document.querySelector("#messageForm");
    const messageField = document.querySelector("#messageField");
    messageForm.addEventListener('submit', (e) => {
        socket.emit('sendMessage', {
            message: messageField.value
        });
        messageField.value = "";
        e.preventDefault();
    });
    
    setupUI();

    canvas.onmousemove = handleMove;
    canvas.onmousedown = handleClick;
    canvas.onmouseup = endClick;
    canvas.onmouseleave = handleLeave;

};

window.onload = init;
