const plantSpriteSizes = {
    WIDTH: 120,
    HEIGHT: 240
};

const UISpriteSizes = {
    WIDTH: 200,
    HEIGHT: 200
}

const drawOverlay = (drawCall, color) => {
    ctx.strokeStyle = color;

    ctx.strokeRect(
        drawCall.x - drawCall.width / 2,
        drawCall.y - drawCall.height,
        drawCall.width,
        drawCall.height
    );

    // water bar
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(
        drawCall.x - 70 / 2,
        drawCall.y + 5,
        70,
        5
    );

    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.fillStyle = 'rgb(75,105,195)';
    ctx.fillRect(
        drawCall.x - 70 / 2,
        drawCall.y + 5,
        drawCall.water * 70 / 100,
        5
    );
    ctx.strokeRect(
        drawCall.x - 70 / 2,
        drawCall.y + 5,
        70,
        5
    );
    // growth bar
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(
        drawCall.x - 70 / 2,
        drawCall.y + 15,
        70,
        5
    );
    ctx.fillStyle = 'rgb(0,195,55)';
    ctx.fillRect(
        drawCall.x - 70 / 2,
        drawCall.y + 15,
        drawCall.age * 70 / drawCall.maxAge,
        5
    );
    for (let i = 0; i < drawCall.stages - 1; i++) {
        ctx.strokeRect(
            drawCall.x - 70 / 2 + 70 / (drawCall.stages - 1) * i,
            drawCall.y + 15,
            70 / (drawCall.stages - 1),
            5
        );
    }

    ctx.font = "12px Arial";
    let name = drawCall.ownerName;
    let length = ctx.measureText('Owned by:').width;
    if (length < ctx.measureText(name).width) {
        length = ctx.measureText(name).width;
    }

    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(
        drawCall.x - drawCall.width / 2,
        drawCall.y - drawCall.height - 35,
        length + 10,
        33
    );

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgb(0,0,0)';

    ctx.fillText(
        'Owned by:',
        drawCall.x - drawCall.width / 2 + 5,
        drawCall.y - drawCall.height - 20
    );
    ctx.fillText(
        name,
        drawCall.x - drawCall.width / 2 + 5,
        drawCall.y - drawCall.height - 7
    );
};

const draw = () => {
    ctx.fillStyle = "rgb(200,200,250)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // draw ground
    ctx.fillStyle = "rgb(100,50,0)";
    ctx.fillRect(0, HEIGHT - GROUND_LEVEL - 30, canvas.width, canvas.height);

    // draw plants
    if (draws.length > 0) {
        // console.log(draws);
        for (let i = 0; i < draws.length; i++) {
            const drawCall = draws[i];
            ctx.drawImage(
                plantSpritesheet,
                plantSpriteSizes.WIDTH * drawCall.stage,
                plantSpriteSizes.HEIGHT * drawCall.spriteRow,
                drawCall.width,
                drawCall.height,
                drawCall.x - drawCall.width / 2,
                drawCall.y - drawCall.height,
                drawCall.width,
                drawCall.height
            );
        }

    }

    // draw players
    for (let i = 0; i < rooms[roomNum].UserIds.length; i++) {
        const drawCall = users[rooms[roomNum].UserIds[i]];
        if (drawCall.id !== id) {
            ctx.globalAlpha = 0.7;
        }
        if (drawCall.mode === 'water') {
            // watering can
            ctx.drawImage(
                UISpritesheet,
                UISpriteSizes.WIDTH * 0,
                UISpriteSizes.HEIGHT * 0,
                160,
                130,
                drawCall.x - 160 / 2,
                drawCall.y - 130 / 2,
                160,
                130
            );
        } else if (drawCall.mode === 'watering') {
            // watering can
            ctx.drawImage(
                UISpritesheet,
                UISpriteSizes.WIDTH * 1,
                UISpriteSizes.HEIGHT * 0,
                145,
                140,
                drawCall.x - 145 / 2,
                drawCall.y - 140 / 2,
                145,
                140
            );

            ctx.drawImage(
                UISpritesheet,
                UISpriteSizes.WIDTH * 0,
                UISpriteSizes.HEIGHT * 1,
                85,
                185,
                drawCall.x - 145 / 2 - 85,
                drawCall.y + 140 / 2,
                85,
                185
            );
        } else if (drawCall.mode == 'seed') {
            ctx.drawImage(
                plantSpritesheet,
                0,
                0,
                60,
                40,
                drawCall.x - 60 / 2,
                drawCall.y - 40 / 2,
                60,
                40
            );
        }

        // draw nameplate
        if (drawCall.id !== id && drawCall.mode !== 'none') {
            ctx.font = "12px Arial";
            let uName = drawCall.name;
            let length = ctx.measureText(uName).width;
            let yOffset = -15;

            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.globalAlpha = 0.6;
            ctx.fillRect(
                drawCall.x - length / 2 - 5,
                drawCall.y - (20) + yOffset,
                length + 10,
                23
            );
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(
                uName,
                drawCall.x - length / 2,
                drawCall.y - 3 + yOffset
            );
        }

        ctx.globalAlpha = 1;

        if (drawCall.id === id && (drawCall.mode === 'water' || drawCall.mode === 'watering')) {
            // water bar
            const offx = -20;
            const offy = 30;
            const width = 60;
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(
                drawCall.x + offx,
                drawCall.y + offy,
                width,
                5
            );
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(
                drawCall.x + offx,
                drawCall.y + offy,
                drawCall.water * width / 100,
                5
            );
            ctx.strokeRect(
                drawCall.x + offx,
                drawCall.y + offy,
                width,
                5
            );
        }
    }
    
    // draw rollover info
    if (hoverLock >= 0) {
        drawOverlay(draws[hoverLock], 'rgb(255,0,0)');
    }

    if (hoverTarget >= 0 && hoverTarget !== hoverLock) {
        drawOverlay(draws[hoverTarget], 'rgb(250,255,255)');
    }

    // draw UI

    for (let i = 0; i < ui.length; i++) {
        const drawCall = ui[i];
        if (users[id].mode === drawCall.mode) {
            ctx.globalAlpha = 0.7;
        }
        if (uiHover === i) {
            ctx.fillStyle = 'rgb(250,255,255)';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(
                drawCall.x - (drawCall.width * drawCall.scale) / 2,
                drawCall.y - (drawCall.height * drawCall.scale) / 2,
                (drawCall.width * drawCall.scale),
                (drawCall.height * drawCall.scale)
            );
            ctx.globalAlpha = 1;
        }
        if (drawCall.spritesheet === 'ui') {
            ctx.drawImage(
                UISpritesheet,
                UISpriteSizes.WIDTH * drawCall.col,
                UISpriteSizes.HEIGHT * drawCall.row,
                drawCall.width,
                drawCall.height,
                drawCall.x - (drawCall.width * drawCall.scale) / 2,
                drawCall.y - (drawCall.height * drawCall.scale) / 2,
                (drawCall.width * drawCall.scale),
                (drawCall.height * drawCall.scale)
            );
        } else if (drawCall.spritesheet === 'plant') {
            ctx.drawImage(
                plantSpritesheet,
                plantSpriteSizes.WIDTH * drawCall.col,
                plantSpriteSizes.HEIGHT * drawCall.row,
                drawCall.width,
                drawCall.height,
                drawCall.x - (drawCall.width * drawCall.scale) / 2,
                drawCall.y - (drawCall.height * drawCall.scale) / 2,
                (drawCall.width * drawCall.scale),
                (drawCall.height * drawCall.scale)
            );
        }
        if (drawCall.mode === 'water') {
            // water bar
            const offx = -20 * drawCall.scale;
            const offy = 30 * drawCall.scale;
            const width = 60 * drawCall.scale;
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect(
                drawCall.x + offx,
                drawCall.y + offy,
                width,
                5
            );
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.fillStyle = 'rgb(75,105,195)';
            ctx.fillRect(
                drawCall.x + offx,
                drawCall.y + offy,
                users[id].water * width / 100,
                5
            );
            ctx.strokeRect(
                drawCall.x + offx,
                drawCall.y + offy,
                width,
                5
            );
        }
        ctx.globalAlpha = 1;
    }

};

const displayUsers = () => {
    const userList = document.querySelector("#userList");
    // clear box
    userList.innerHTML = "";
    //console.log(users);
    for (let i = 0; i < rooms[roomNum].UserIds.length; i++) {
        let user = document.createElement("LI");
        user.style.color = users[rooms[roomNum].UserIds[i]].color;
        if (id === rooms[roomNum].UserIds[i]) {
            user.style.listStyleType = "disc";
        }
        user.innerHTML += users[rooms[roomNum].UserIds[i]].name;
        if (rooms[roomNum].host === rooms[roomNum].UserIds[i]) {
            user.innerHTML += (" (host)");
        }
        user.innerHTML += (` (${users[rooms[roomNum].UserIds[i]].mode})`);
        userList.appendChild(user);
    }
};

const displayMessages = () => {
    const chatBox = document.querySelector("#chatBox");
    chatBox.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        let message = document.createElement("LI");
        message.style.color = messages[i].color;
        message.innerHTML += messages[i].message;
        chatBox.appendChild(message);
    }
};
