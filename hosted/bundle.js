'use strict';

var draw = function draw() {
    ctx.fillStyle = "rgb(250,250,250)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //console.log("clear");
    //console.log(draws)


    // draw plants
    if (draws.length > 0) {
        //console.log(draws);
        for (var i = 0; i < draws.length; i++) {
            var drawCall = draws[i];
            ctx.fillStyle = drawCall.color;
            ctx.fillRect(drawCall.x, drawCall.y, 10, 30);
        }
    }

    // draw players
    for (var _i = 0; _i < rooms[roomNum].UserIds.length; _i++) {
        var _drawCall = users[rooms[roomNum].UserIds[_i]];
        //console.log(drawCall);
        if (_drawCall.mode == 'water') {
            ctx.fillStyle = _drawCall.color;
            ctx.fillRect(_drawCall.x, _drawCall.y, 10, 20);
        } else if (_drawCall.mode == 'watering') {
            ctx.fillStyle = 'blue';
            ctx.fillRect(_drawCall.x, _drawCall.y, 10, 20);
        } else if (_drawCall.mode == 'seed') {
            ctx.fillStyle = _drawCall.color;
            ctx.fillRect(_drawCall.x, _drawCall.y, 5, 5);
        }
    }
};

var displayUsers = function displayUsers() {
    var userList = document.querySelector("#userList");
    // clear box
    userList.innerHTML = "";

    for (var i = 0; i < rooms[roomNum].UserIds.length; i++) {
        var user = document.createElement("LI");
        user.style.color = users[rooms[roomNum].UserIds[i]].color;
        if (id === rooms[roomNum].UserIds[i]) {
            user.style.listStyleType = "disc";
        }
        user.innerHTML += users[rooms[roomNum].UserIds[i]].name + " - " + Math.round(users[rooms[roomNum].UserIds[i]].points) + " points";
        if (rooms[roomNum].host === rooms[roomNum].UserIds[i]) {
            user.innerHTML += " (host)";
        }
        user.innerHTML += ' (' + users[rooms[roomNum].UserIds[i]].mode + ')';
        userList.appendChild(user);
    }
};

var displayMessages = function displayMessages() {
    var chatBox = document.querySelector("#chatBox");
    chatBox.innerHTML = "";
    for (var i = 0; i < messages.length; i++) {
        var message = document.createElement("LI");
        message.style.color = messages[i].color;
        message.innerHTML += messages[i].message;
        chatBox.appendChild(message);
    }
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var id = void 0;
var roomNum = void 0;
var draws = [];
var users = {};
var rooms = [];
var messages = [];

// game constants
var HEIGHT = 500;
var WIDTH = 700;
var BOT_MARGIN = 20;

var handleClick = function handleClick(e) {
    if (users[id].mode === 'water') {
        socket.emit('changeMode', 'watering');
    } else if (users[id].mode === 'seed') {
        var plant = {
            x: users[id].x,
            y: HEIGHT - BOT_MARGIN,
            color: users[id].color,
            user: id
        };
        socket.emit('newPlant', plant);
    }
};

var endClick = function endClick(e) {
    if (users[id].mode == 'watering') {
        socket.emit('changeMode', 'water');
    }
};

var init = function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext('2d');

    socket = io.connect();

    socket.on('connect', function () {
        console.log('connecting');
        socket.emit('join', {});
    });

    socket.on('disconnect', function () {
        socket.emit('leave', {
            uid: id
        });
    });

    socket.on('syncClient', function (data) {
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


    var body = document.querySelector("body");
    body.addEventListener('mousemove', function (e) {

        var newX = e.clientX - canvas.offsetLeft;
        var newY = e.clientY - canvas.offsetTop;

        /*
        if (newX < 0) {
            newX = 0;
        } else if (newX > WIDTH) {
            newX = WIDTH;
        }
        */
        socket.emit('userMove', { x: newX, y: newY });
    });

    var userForm = document.querySelector("#userSettings");
    var nameField = document.querySelector("#nameField");
    userForm.addEventListener('submit', function (e) {
        socket.emit('changeName', {
            name: nameField.value
        });
        e.preventDefault();
    });

    var messageForm = document.querySelector("#messageForm");
    var messageField = document.querySelector("#messageField");
    messageForm.addEventListener('submit', function (e) {
        socket.emit('sendMessage', {
            message: messageField.value
        });
        messageField.value = "";
        e.preventDefault();
    });

    var seedButton = document.querySelector("#seedButton");
    var waterButton = document.querySelector("#waterButton");
    seedButton.addEventListener('click', function (e) {
        document.querySelector("#seedButton").disabled = true;
        document.querySelector("#waterButton").disabled = false;
        socket.emit('changeMode', 'seed');
    });

    waterButton.addEventListener('click', function (e) {
        document.querySelector("#waterButton").disabled = true;
        document.querySelector("#seedButton").disabled = false;
        socket.emit('changeMode', 'water');
    });

    canvas.onmousedown = handleClick;
    canvas.onmouseup = endClick;
};

window.onload = init;
"use strict";

var updateRoom = function updateRoom(data) {
    rooms[roomNum] = data.room;
    //console.log(data.room);
    // check if client is now the host
    draws = data.room.Plants;
    displayUsers();
};

var updateUsers = function updateUsers(data) {
    users[data.user.id] = data.user;
    console.log(data.user);

    displayUsers();
};

var updateUserPosition = function updateUserPosition(data) {
    users[data.id].x = data.newX;
    users[data.id].y = data.newY;
};

var removeUser = function removeUser(data) {
    delete users[data.id];
    rooms[roomNum].UserIds.splice(rooms[roomNum].UserIds.indexOf(data.id), 1);
    displayUsers();
};
/*
const updatePlant = (data) => {
    users[data.user.id] = data.user;
    console.log(data.user);
}
*/

var updateAllPlants = function updateAllPlants(data) {
    draws = data;
    console.log("update all plants");
    console.log(data);
    //draw();
};

var syncAll = function syncAll(data) {
    console.log("sync all");
    draws = data.Plants;
    users = data.Users;
    //draw();
    displayUsers();
    console.log(data);
};

var syncName = function syncName() {
    document.querySelector("#nameField").value = users[id].name;
};

var newMessage = function newMessage(data) {
    if (messages.push(data) > 20) {
        messages.shift();
    }
    displayMessages();
};

var denied = function denied(data) {
    console.log(data.message);
    if (messages.push({
        message: data.message,
        color: "black"
    }) > 20) {
        messages.shift();
    }
    displayMessages();

    switch (data.code) {
        case "name":
            {
                syncName();
                break;
            }
        default:
            {

                break;
            }
    }
};
