'use strict';

var plantSpriteSizes = {
    WIDTH: 120,
    HEIGHT: 240
};

var UISpriteSizes = {
    WIDTH: 200,
    HEIGHT: 200
};

var drawOverlay = function drawOverlay(drawCall, color) {
    ctx.strokeStyle = color;

    ctx.strokeRect(drawCall.x - drawCall.width / 2, drawCall.y - drawCall.height, drawCall.width, drawCall.height);

    // water bar
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(drawCall.x - 70 / 2, drawCall.y + 5, 70, 5);

    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.fillStyle = 'rgb(75,105,195)';
    ctx.fillRect(drawCall.x - 70 / 2, drawCall.y + 5, drawCall.water * 70 / 100, 5);
    ctx.strokeRect(drawCall.x - 70 / 2, drawCall.y + 5, 70, 5);
    // growth bar
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(drawCall.x - 70 / 2, drawCall.y + 15, 70, 5);
    ctx.fillStyle = 'rgb(0,195,55)';
    ctx.fillRect(drawCall.x - 70 / 2, drawCall.y + 15, drawCall.age * 70 / drawCall.maxAge, 5);
    for (var i = 0; i < drawCall.stages - 1; i++) {
        ctx.strokeRect(drawCall.x - 70 / 2 + 70 / (drawCall.stages - 1) * i, drawCall.y + 15, 70 / (drawCall.stages - 1), 5);
    }

    ctx.font = "12px Arial";
    var name = drawCall.ownerName;
    var length = ctx.measureText('Planted by:').width;
    if (length < ctx.measureText(name).width) {
        length = ctx.measureText(name).width;
    }

    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(drawCall.x - drawCall.width / 2, drawCall.y - drawCall.height - 35, length + 10, 33);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgb(0,0,0)';

    ctx.fillText('Planted by:', drawCall.x - drawCall.width / 2 + 5, drawCall.y - drawCall.height - 20);
    ctx.fillText(name, drawCall.x - drawCall.width / 2 + 5, drawCall.y - drawCall.height - 7);
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
    }

    // draw players
    for (var _i = 0; _i < rooms[roomNum].UserIds.length; _i++) {
        var _drawCall = users[rooms[roomNum].UserIds[_i]];
        if (_drawCall.id !== id) {
            ctx.globalAlpha = 0.7;
        }
        if (_drawCall.mode === 'water') {
            // watering can
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * 0, UISpriteSizes.HEIGHT * 0, 160, 130, _drawCall.x - 160 / 2, _drawCall.y - 130 / 2, 160, 130);
        } else if (_drawCall.mode === 'watering') {
            // watering can
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * 1, UISpriteSizes.HEIGHT * 0, 145, 140, _drawCall.x - 145 / 2, _drawCall.y - 140 / 2, 145, 140);

            // water
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * Math.floor(waterFrame / 3), UISpriteSizes.HEIGHT * 1, 85, 185, _drawCall.x - 145 / 2 - 85 + 5, _drawCall.y + 140 / 2 - 5, 85, 185);
            waterFrame++;
            waterFrame %= 6;
        } else if (_drawCall.mode == 'seed') {
            ctx.drawImage(plantSpritesheet, 0, 0, 60, 40, _drawCall.x - 60 / 2, _drawCall.y - 40 / 2, 60, 40);
        }

        // draw nameplate
        if (_drawCall.id !== id && _drawCall.mode !== 'none') {
            ctx.font = "12px Arial";
            var uName = _drawCall.name;
            var length = ctx.measureText(uName).width;
            var yOffset = -15;

            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.globalAlpha = 0.6;
            ctx.fillRect(_drawCall.x - length / 2 - 5, _drawCall.y - 20 + yOffset, length + 10, 23);
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(uName, _drawCall.x - length / 2, _drawCall.y - 3 + yOffset);
        }

        ctx.globalAlpha = 1;

        if (_drawCall.id === id && (_drawCall.mode === 'water' || _drawCall.mode === 'watering')) {
            // water bar
            var offx = -20;
            var offy = 30;
            var width = 60;
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(_drawCall.x + offx, _drawCall.y + offy, width, 5);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(_drawCall.x + offx, _drawCall.y + offy, _drawCall.water * width / 100, 5);
            ctx.strokeRect(_drawCall.x + offx, _drawCall.y + offy, width, 5);
        }
    }

    // draw rollover info
    if (hoverLock >= 0) {
        drawOverlay(draws[hoverLock], 'rgb(255,0,0)');
    }

    if (hoverTarget >= 0 && hoverTarget !== hoverLock) {
        drawOverlay(draws[hoverTarget], 'rgb(250,255,255)');
    }

    // draw help screen
    if (users[id].mode === 'help') {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;
        ctx.font = "24px Arial";
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillText('Controls:', 20, 300);
        ctx.font = "18px Arial";
        ctx.fillText('R Click: Select/Use Tool', 25, 330);
        ctx.fillText('L Click: Drop Tool', 25, 350);
        ctx.fillText('Move offscreen: Drop Tool', 25, 370);
        ctx.fillText('hover over a plant to show info,', 25, 410);
        ctx.fillText('click to keep info up', 25, 430);
        var _length = ctx.measureText('hover over an element for information').width;
        ctx.fillText('hover over an element for information', (WIDTH - _length) / 2, HEIGHT - 20);
        // water bar
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(25, 440, 70, 5);
        ctx.fillStyle = 'rgb(75,105,195)';
        ctx.fillRect(25, 440, 25, 5);
        ctx.strokeRect(25, 440, 70, 5);
        // growth bar
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(25, 450, 70, 5);
        ctx.fillStyle = 'rgb(0,195,55)';
        ctx.fillRect(25, 450, 30, 5);
        for (var _i2 = 0; _i2 < 3; _i2++) {
            ctx.strokeRect(25 + 70 / 3 * _i2, 450, 70 / 3, 5);
        }
        ctx.font = "12px Arial";
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillText('water', 100, 445);
        ctx.fillText('growth', 100, 457);
    }

    // draw UI

    var money = (users[id].points / 100).toFixed(2);

    for (var _i3 = 0; _i3 < ui.length; _i3++) {
        var _drawCall2 = ui[_i3];
        if (users[id].mode === _drawCall2.mode) {
            ctx.globalAlpha = 0.7;
        }
        var storeOffset = 0;
        if (_drawCall2.mode === 'store') {
            ctx.font = "24px Arial";
            storeOffset = ctx.measureText(money).width;
            if (storeOffset < ctx.measureText('000.00').width) {
                storeOffset = ctx.measureText('000.00').width;
            }
        }
        var scaledWidth = _drawCall2.width * _drawCall2.scale;
        var scaledHeight = _drawCall2.height * _drawCall2.scale;
        if (uiHover === _i3) {
            ctx.fillStyle = 'rgb(250,255,255)';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(_drawCall2.x - scaledWidth / 2 - storeOffset, _drawCall2.y - scaledHeight / 2, scaledWidth + storeOffset + 5, scaledHeight);
            ctx.globalAlpha = 1;
            if (users[id].mode === 'help') {
                ctx.font = "12px Arial";
                ctx.fillStyle = 'rgb(0,0,0)';
                var arr = _drawCall2.help.split(',');
                for (var j = 0; j < arr.length; j++) {
                    ctx.fillText(arr[j], _drawCall2.x - scaledWidth / 2 - storeOffset, _drawCall2.y + scaledHeight / 2 + 10 * (j + 1));
                }
            }
        }
        if (_drawCall2.spritesheet === 'ui') {
            ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * _drawCall2.col, UISpriteSizes.HEIGHT * _drawCall2.row, _drawCall2.width, _drawCall2.height, _drawCall2.x - scaledWidth / 2 - storeOffset, _drawCall2.y - scaledHeight / 2, scaledWidth, scaledHeight);
        } else if (_drawCall2.spritesheet === 'plant') {
            ctx.drawImage(plantSpritesheet, plantSpriteSizes.WIDTH * _drawCall2.col, plantSpriteSizes.HEIGHT * _drawCall2.row, _drawCall2.width, _drawCall2.height, _drawCall2.x - scaledWidth / 2, _drawCall2.y - scaledHeight / 2, scaledWidth, scaledHeight);
            ctx.font = "12px Arial";
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText('x' + users[id].seeds, _drawCall2.x + scaledWidth / 3, _drawCall2.y + scaledHeight / 3);
        }
        if (_drawCall2.mode === 'water') {
            // water bar
            var _offx = -20 * _drawCall2.scale;
            var _offy = 30 * _drawCall2.scale;
            var _width = 60 * _drawCall2.scale;
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(_drawCall2.x + _offx, _drawCall2.y + _offy, _width, 5);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(_drawCall2.x + _offx, _drawCall2.y + _offy, users[id].water * _width / 100, 5);
            ctx.strokeRect(_drawCall2.x + _offx, _drawCall2.y + _offy, _width, 5);
        }
        if (_drawCall2.mode === 'store') {
            // draw karma
            ctx.font = "24px Arial";
            ctx.fillStyle = 'rgb(0,80,0)';
            ctx.fillText(money, _drawCall2.x + scaledWidth / 2 - storeOffset + 5, _drawCall2.y + 10);
        }

        ctx.globalAlpha = 1;
    }

    // draw store
    if (users[id].mode === 'store') {
        for (var _i4 = 0; _i4 < store.length; _i4++) {
            var _drawCall3 = store[_i4];
            var _scaledWidth = _drawCall3.width * _drawCall3.scale;
            var _scaledHeight = _drawCall3.height * _drawCall3.scale;
            if (storeHover === _i4) {
                ctx.fillStyle = 'rgb(250,255,255)';
                ctx.globalAlpha = 0.7;
                ctx.fillRect(_drawCall3.x - _scaledWidth / 2, _drawCall3.y - _scaledHeight / 2, _scaledWidth, _scaledHeight);
                ctx.globalAlpha = 1;
            }
            if (_drawCall3.spritesheet === 'ui') {
                ctx.drawImage(UISpritesheet, UISpriteSizes.WIDTH * _drawCall3.col, UISpriteSizes.HEIGHT * _drawCall3.row, _drawCall3.width, _drawCall3.height, _drawCall3.x - _scaledWidth / 2, _drawCall3.y - _scaledHeight / 2, _scaledWidth, _scaledHeight);
            } else if (_drawCall3.spritesheet === 'plant') {
                ctx.drawImage(plantSpritesheet, plantSpriteSizes.WIDTH * _drawCall3.col, plantSpriteSizes.HEIGHT * _drawCall3.row, _drawCall3.width, _drawCall3.height, _drawCall3.x - _scaledWidth / 2, _drawCall3.y - _scaledHeight / 2, _scaledWidth, _scaledHeight);
            }
            // draw price
            ctx.font = "12px Arial";
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(_drawCall3.item, _drawCall3.x - 30, _drawCall3.y + _scaledHeight / 2 + 15);
            ctx.fillText((_drawCall3.price / 100).toFixed(2) + " karma", _drawCall3.x - 30, _drawCall3.y + _scaledHeight / 2 + 30);
        }
    }
};

var displayUsers = function displayUsers() {
    var userList = document.querySelector("#userList");
    // clear box
    userList.innerHTML = "";
    //console.log(users);
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
        if (users[rooms[roomNum].UserIds[i]].mode !== "none") {
            user.innerHTML += ' (' + users[rooms[roomNum].UserIds[i]].mode + ')';
        }
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
var store = [];
var users = {};
var rooms = [];
var messages = [];
var hoverTarget = -1;
var hoverLock = -1;
var uiHover = -1;
var storeHover = -1;
var lastUpdate = void 0;
var waterFrame = 0;

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

    // check for store hover
    storeHover = -1;
    if (users[id].mode === 'store') {
        for (var i = store.length - 1; i >= 0; i--) {
            if (Math.abs(newX - store[i].x) < store[i].width * store[i].scale / 2 && Math.abs(newY - store[i].y) < store[i].height * store[i].scale / 2) {
                storeHover = i;
                break;
            }
        }
    }
    if (storeHover < 0) {
        // check for ui hover
        uiHover = -1;
        for (var _i = ui.length - 1; _i >= 0; _i--) {
            var storeOffset = 0;
            if (ui[_i].mode === 'store') {
                ctx.font = "24px Arial";
                var money = (users[id].points / 100).toFixed(2);
                storeOffset = ctx.measureText(money).width;
                if (storeOffset < ctx.measureText('000.00').width) {
                    storeOffset = ctx.measureText('000.00').width;
                }
            }
            if (Math.abs(newX - (ui[_i].x - storeOffset / 2)) < ui[_i].width * ui[_i].scale / 2 + storeOffset / 2 + 5 && Math.abs(newY - ui[_i].y) < ui[_i].height * ui[_i].scale / 2) {
                uiHover = _i;
                break;
            }
        }
        // check for hover
        hoverTarget = -1;
        for (var _i2 = draws.length - 1; _i2 >= 0; _i2--) {
            if (Math.abs(newX - draws[_i2].x) < draws[_i2].width / 2 && draws[_i2].y - newY < draws[_i2].height && draws[_i2].y - newY > 0) {
                hoverTarget = _i2;
                break;
            }
        }
    }
};

var handleClick = function handleClick(e) {
    // left mouse button
    if (e.button === 0) {
        // buy from store
        if (users[id].mode === 'store' && storeHover >= 0) {
            socket.emit('buyItem', store[storeHover].name);
        } else if (uiHover >= 0) {
            // change mode
            if (ui[uiHover].mode !== users[id].mode) {
                socket.emit('changeMode', ui[uiHover].mode);
            } else {
                // drop mode
                socket.emit('changeMode', 'none');
            }
        } else if (users[id].mode === 'help') {
            // leave help mode
            socket.emit('changeMode', 'none');
        } else if (users[id].mode === 'water') {
            // begin watering
            socket.emit('changeMode', 'watering');
        } else if (users[id].mode === 'seed') {
            // plant seed
            socket.emit('newPlant', { x: users[id].x, type: 'daisy' });
        } else {
            // lock or unlock hover target
            if (hoverTarget >= 0 && hoverTarget !== hoverLock) {
                hoverLock = hoverTarget;
            } else if (hoverLock >= 0) {
                hoverLock = -1;
            }
        }
    } else if (e.button === 2) {
        // drop mode
        socket.emit('changeMode', 'none');
    }

    e.preventDefault();
};

var endClick = function endClick(e) {
    if (users[id].mode === 'watering') {
        // stop watering
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
        mode: 'water',
        help: 'Watering Can:,-refills over time'
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
        mode: 'seed',
        help: 'Daisy Seed:,-requires water to grow'
    });
    // store
    ui.push({
        x: WIDTH - 60,
        y: 40,
        spritesheet: 'ui',
        row: 2,
        col: 1,
        height: 55,
        width: 55,
        scale: .6,
        mode: 'store',
        help: 'Store:,-spend Karma here'
    });
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
        mode: 'help',
        help: 'Help Button'
    });
    console.log('ui set up');
};

var setupStore = function setupStore() {
    // water refill
    store.push({
        x: WIDTH - 80,
        y: 120,
        spritesheet: 'ui',
        row: 0,
        col: 0,
        height: 130,
        width: 160,
        scale: 0.50,
        name: 'WATER',
        item: 'water refill',
        price: 200
    });
    // daisy seed
    store.push({
        x: WIDTH - 80,
        y: 210,
        spritesheet: 'plant',
        row: 0,
        col: 0,
        height: 40,
        width: 60,
        scale: 1,
        name: 'DAISY',
        item: 'daisy seed',
        price: 100
    });
    console.log('store set up');
};

var init = function init() {
    lastUpdate = new Date().getTime();
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

    document.querySelector("#karmaButton5").addEventListener('click', function (e) {
        socket.emit('buyKarma', 500);
    });
    document.querySelector("#karmaButton10").addEventListener('click', function (e) {
        socket.emit('buyKarma', 1000);
    });
    document.querySelector("#karmaButton50").addEventListener('click', function (e) {
        socket.emit('buyKarma', 5000);
    });

    setupUI();
    setupStore();
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
    //draw();
};

var syncAll = function syncAll(data) {
    //console.log("sync all");
    if (data.Time > lastUpdate) {
        lastUpdate = data.Time;
        draws = data.Plants;
        var newerX = users[id].x;
        var newerY = users[id].y;
        users = data.Users;
        users[id].x = newerX;
        users[id].y = newerY;
        //draw();
        displayUsers();
    }
    //console.log(data);
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
