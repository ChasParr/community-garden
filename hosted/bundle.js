"use strict";

var plantSpriteSizes = {
    WIDTH: 120,
    HEIGHT: 240
};

var UISpriteSizes = {
    WIDTH: 200,
    HEIGHT: 200
};

var draw = function draw() {
    ctx.fillStyle = "rgb(200,200,250)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // draw ground
    ctx.fillStyle = "rgb(100,50,0)";
    ctx.fillRect(0, HEIGHT - GROUND_LEVEL - 30, canvas.width, canvas.height);

    // draw plants
    if (draws.length > 0) {
        // console.log(draws);
        for (var i = 0; i < draws.length; i++) {
            var drawCall = draws[i];
            ctx.drawImage(plantSpritesheet, plantSpriteSizes.WIDTH * drawCall.stage, plantSpriteSizes.HEIGHT * drawCall.spriteRow, drawCall.width, drawCall.height, drawCall.x - drawCall.width / 2, drawCall.y - drawCall.height, drawCall.width, drawCall.height);
        }

        // draw rollover info
        if (hoverTarget >= 0) {
            var _drawCall = draws[hoverTarget];
            ctx.strokeStyle = 'rgb(250,255,255)';
            if (hoverLocked) {
                ctx.strokeStyle = 'rgb(255,0,0)';
            }
            ctx.strokeRect(_drawCall.x - _drawCall.width / 2, _drawCall.y - _drawCall.height, _drawCall.width, _drawCall.height);

            // water bar
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(_drawCall.x - 70 / 2, _drawCall.y + 5, 70, 5);

            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(_drawCall.x - 70 / 2, _drawCall.y + 5, _drawCall.water * 70 / 100, 5);
            ctx.strokeRect(_drawCall.x - 70 / 2, _drawCall.y + 5, 70, 5);
            // growth bar
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(_drawCall.x - 70 / 2, _drawCall.y + 15, 70, 5);
            ctx.fillStyle = 'rgb(0,195,55)';
            ctx.fillRect(_drawCall.x - 70 / 2, _drawCall.y + 15, _drawCall.age * 70 / _drawCall.maxAge, 5);
            for (var _i = 0; _i < _drawCall.stages - 1; _i++) {
                ctx.strokeRect(_drawCall.x - 70 / 2 + 70 / (_drawCall.stages - 1) * _i, _drawCall.y + 15, 70 / (_drawCall.stages - 1), 5);
            }

            ctx.font = "12px Arial";
            var name = _drawCall.ownerName;
            var length = ctx.measureText('Owned by:').width;
            if (length < ctx.measureText(name).width) {
                length = ctx.measureText(name).width;
            }

            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.globalAlpha = 0.8;
            ctx.fillRect(_drawCall.x - _drawCall.width / 2, _drawCall.y - _drawCall.height - 35, length + 10, 33);

            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0,0,0)';

            ctx.fillText('Owned by:', _drawCall.x - _drawCall.width / 2 + 5, _drawCall.y - _drawCall.height - 20);
            ctx.fillText(name, _drawCall.x - _drawCall.width / 2 + 5, _drawCall.y - _drawCall.height - 7);
        }
    }

    // draw players
    for (var _i2 = 0; _i2 < rooms[roomNum].UserIds.length; _i2++) {
        var _drawCall2 = users[rooms[roomNum].UserIds[_i2]];
        if (_drawCall2.id !== id) {
            ctx.globalAlpha = 0.7;
        }
        if (_drawCall2.mode === 'water') {
            // watering can
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * 0, UISpriteSizes.HEIGHT * 0, 160, 130, _drawCall2.x - 160 / 2, _drawCall2.y - 130 / 2, 160, 130);
        } else if (_drawCall2.mode === 'watering') {
            // watering can
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * 1, UISpriteSizes.HEIGHT * 0, 145, 140, _drawCall2.x - 145 / 2, _drawCall2.y - 140 / 2, 145, 140);

            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * 0, UISpriteSizes.HEIGHT * 1, 85, 185, _drawCall2.x - 145 / 2 - 85, _drawCall2.y + 140 / 2, 85, 185);
        } else if (_drawCall2.mode == 'seed') {
            ctx.drawImage(plantSpritesheet, 0, 0, 60, 40, _drawCall2.x - 60 / 2, _drawCall2.y - 40 / 2, 60, 40);
        }

        // draw nameplate
        if (_drawCall2.id !== id && _drawCall2.mode !== 'none') {
            ctx.font = "12px Arial";
            var uName = _drawCall2.name;
            var _length = ctx.measureText(uName).width;
            var yOffset = -15;

            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.globalAlpha = 0.6;
            ctx.fillRect(_drawCall2.x - _length / 2 - 5, _drawCall2.y - 20 + yOffset, _length + 10, 23);
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(uName, _drawCall2.x - _length / 2, _drawCall2.y - 3 + yOffset);
        }

        ctx.globalAlpha = 1;

        if (_drawCall2.id === id && (_drawCall2.mode === 'water' || _drawCall2.mode === 'watering')) {
            // water bar
            var offx = -20;
            var offy = 30;
            var width = 60;
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(_drawCall2.x + offx, _drawCall2.y + offy, width, 5);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(_drawCall2.x + offx, _drawCall2.y + offy, _drawCall2.water * width / 100, 5);
            ctx.strokeRect(_drawCall2.x + offx, _drawCall2.y + offy, width, 5);
        }
    }

    // draw UI

    for (var _i3 = 0; _i3 < ui.length; _i3++) {
        var _drawCall3 = ui[_i3];
        if (users[id].mode === _drawCall3.mode) {
            ctx.globalAlpha = 0.7;
        }
        if (uiHover === _i3) {
            ctx.fillStyle = 'rgb(250,255,255)';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(_drawCall3.x - _drawCall3.width * _drawCall3.scale / 2, _drawCall3.y - _drawCall3.height * _drawCall3.scale / 2, _drawCall3.width * _drawCall3.scale, _drawCall3.height * _drawCall3.scale);
            ctx.globalAlpha = 1;
        }
        if (_drawCall3.spritesheet === 'ui') {
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * _drawCall3.col, UISpriteSizes.HEIGHT * _drawCall3.row, _drawCall3.width, _drawCall3.height, _drawCall3.x - _drawCall3.width * _drawCall3.scale / 2, _drawCall3.y - _drawCall3.height * _drawCall3.scale / 2, _drawCall3.width * _drawCall3.scale, _drawCall3.height * _drawCall3.scale);
        } else if (_drawCall3.spritesheet === 'plant') {
            ctx.drawImage(plantSpritesheet, plantSpriteSizes.WIDTH * _drawCall3.col, plantSpriteSizes.HEIGHT * _drawCall3.row, _drawCall3.width, _drawCall3.height, _drawCall3.x - _drawCall3.width * _drawCall3.scale / 2, _drawCall3.y - _drawCall3.height * _drawCall3.scale / 2, _drawCall3.width * _drawCall3.scale, _drawCall3.height * _drawCall3.scale);
        }
        if (_drawCall3.mode === 'water') {
            // water bar
            var _offx = -20 * _drawCall3.scale;
            var _offy = 30 * _drawCall3.scale;
            var _width = 60 * _drawCall3.scale;
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(_drawCall3.x + _offx, _drawCall3.y + _offy, _width, 5);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(_drawCall3.x + _offx, _drawCall3.y + _offy, users[id].water * _width / 100, 5);
            ctx.strokeRect(_drawCall3.x + _offx, _drawCall3.y + _offy, _width, 5);
        }
        ctx.globalAlpha = 1;
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
        user.innerHTML += users[rooms[roomNum].UserIds[i]].name;
        if (rooms[roomNum].host === rooms[roomNum].UserIds[i]) {
            user.innerHTML += " (host)";
        }
        user.innerHTML += " (" + users[rooms[roomNum].UserIds[i]].mode + ")";
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
var plantSpritesheet = void 0;
var UISpritesheet = void 0;
var draws = [];
var ui = [];
var users = {};
var rooms = [];
var messages = [];
var hoverTarget = -1;
var hoverLocked = false;
var uiHover = -1;

// game constants
var HEIGHT = 500;
var WIDTH = 700;
var GROUND_LEVEL = 80;

var handleMove = function handleMove(e) {
    var newX = e.clientX - canvas.offsetLeft;
    var newY = e.clientY - canvas.offsetTop;
    users[id].x = newX;
    users[id].y = newY;

    socket.emit('userMove', { x: newX, y: newY });

    // check for ui hover
    uiHover = -1;
    for (var i = ui.length - 1; i >= 0; i--) {
        if (Math.abs(newX - ui[i].x) < ui[i].width * ui[i].scale / 2 && Math.abs(newY - ui[i].y) < ui[i].height * ui[i].scale / 2) {
            uiHover = i;
            break;
        }
    }
    // check for hover
    if (!hoverLocked) {
        hoverTarget = -1;
        for (var _i = draws.length - 1; _i >= 0; _i--) {
            if (Math.abs(newX - draws[_i].x) < draws[_i].width / 2 && draws[_i].y - newY < draws[_i].height && draws[_i].y - newY > 0) {
                hoverTarget = _i;
                break;
            }
        }
    }
};

var handleClick = function handleClick(e) {
    if (e.button === 0) {
        if (uiHover >= 0) {
            socket.emit('changeMode', ui[uiHover].mode);
        } else if (users[id].mode === 'water') {
            socket.emit('changeMode', 'watering');
        } else if (users[id].mode === 'seed') {
            socket.emit('newPlant', { x: users[id].x, type: 'daisy' });
        } else {
            if (hoverTarget >= 0 && !hoverLocked) {
                hoverLocked = true;
            } else if (hoverLocked) {
                var x = e.clientX - canvas.offsetLeft;
                var y = e.clientY - canvas.offsetTop;
                var target = draws[hoverTarget];
                if (Math.abs(x - target.x) < target.width / 2 && target.y - y < target.height && target.y - y > 0) {
                    hoverLocked = false;
                }
            }
        }
    } else if (e.button === 2) {
        socket.emit('changeMode', 'none');
    }
    e.preventDefault();
};

var endClick = function endClick(e) {
    if (users[id].mode == 'watering') {
        socket.emit('changeMode', 'water');
    }
    e.preventDefault();
};

var handleLeave = function handleLeave(e) {
    socket.emit('changeMode', 'none');
};

var setupUI = function setupUI() {
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
    console.log('ui set up');
};

var init = function init() {

    plantSpritesheet = document.querySelector('#plantSpritesheet');
    UISpritesheet = document.querySelector('#UISpritesheet');

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
        rooms = data.Rooms;
        roomNum = data.roomNum;
        console.log(data.Rooms);
        console.log(rooms);
        setInterval(draw, HEIGHT - GROUND_LEVEL);
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

    // in host.js


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

    setupUI();

    canvas.onmousemove = handleMove;
    canvas.onmousedown = handleClick;
    canvas.onmouseup = endClick;
    canvas.onmouseleave = handleLeave;
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
    //console.log('getMove');
    users[data.id].x = data.newX;
    users[data.id].y = data.newY;
};

var removeUser = function removeUser(data) {
    delete users[data.id];
    rooms[roomNum].UserIds.splice(rooms[roomNum].UserIds.indexOf(data.id), 1);
    displayUsers();
};

var updatePlant = function updatePlant(data) {
    draws[data.index] = data.plant;
    console.log(data.plant);
};

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
