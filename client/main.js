let canvas;
let ctx;
let socket;
let id;
let roomNum;
let draws = [];
let users = {};
let rooms = [];
let messages = [];

// game constants
const HEIGHT = 500;
const WIDTH = 700;
const BOT_MARGIN = 20;

const handleClick = (e) => {
    if (users[id].mode === 'water'){
        socket.emit('changeMode', 'watering');
    } else if (users[id].mode === 'seed'){
        let plant = {
            x: users[id].x,
            y: HEIGHT - BOT_MARGIN,
            color: users[id].color,
            user: id
        }
        socket.emit('newPlant', plant);
    }
}

const endClick = (e) => {
    if (users[id].mode == 'watering'){
        socket.emit('changeMode', 'water');
    }
}

const init = () => {
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
        rooms = data.rooms;
        roomNum = data.roomNum;
        console.log(data.rooms);
        console.log(rooms);
        setInterval(draw, HEIGHT - BOT_MARGIN);
        syncName();
        console.log('synced');
    });

    // in update.js
    socket.on('updateRoom', updateRoom);
    socket.on('updateUsers', updateUsers);
    socket.on('moveUser', updateUserPosition);
    socket.on('removeUser', removeUser);
    //socket.on('updatePlant', updatePlant);
    socket.on('updateAllPlants', updateAllPlants);
    socket.on('reset', syncAll);
    socket.on('newMessage', newMessage);
    socket.on('denied', denied);

    // in host.js


    const body = document.querySelector("body");
    body.addEventListener('mousemove', (e) => {
        
        let newX = e.clientX - canvas.offsetLeft;
        let newY = e.clientY - canvas.offsetTop;
        
        /*
        if (newX < 0) {
            newX = 0;
        } else if (newX > WIDTH) {
            newX = WIDTH;
        }
        */
        socket.emit('userMove', { x: newX, y: newY });
    });

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


    const seedButton = document.querySelector("#seedButton");
    const waterButton = document.querySelector("#waterButton");
    seedButton.addEventListener('click', (e) => {
        document.querySelector("#seedButton").disabled = true;
        document.querySelector("#waterButton").disabled = false;
        socket.emit('changeMode', 'seed');
    });
    
    waterButton.addEventListener('click', (e) => {
        document.querySelector("#waterButton").disabled = true;
        document.querySelector("#seedButton").disabled = false;
        socket.emit('changeMode', 'water');
    });

    canvas.onmousedown = handleClick;
    canvas.onmouseup = endClick;

};

window.onload = init;
