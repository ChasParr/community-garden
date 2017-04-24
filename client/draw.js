const draw = () => {
    ctx.fillStyle = "rgb(250,250,250)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //console.log("clear");
    //console.log(draws)
    

    // draw plants
    if (draws.length > 0){
        //console.log(draws);
        for (let i = 0; i < draws.length; i++) {
            const drawCall = draws[i];
            ctx.fillStyle = drawCall.color;
            ctx.fillRect(drawCall.x, drawCall.y, 10, 30);
        }
    }

    // draw players
    for (let i = 0; i < rooms[roomNum].UserIds.length; i++) {
        const drawCall = users[rooms[roomNum].UserIds[i]];
        //console.log(drawCall);
        if (drawCall.mode == 'water') {
            ctx.fillStyle = drawCall.color;
            ctx.fillRect(drawCall.x, drawCall.y, 10, 20);
        } else if (drawCall.mode == 'watering') {
            ctx.fillStyle = 'blue';
            ctx.fillRect(drawCall.x, drawCall.y, 10, 20);
        } else if (drawCall.mode == 'seed') {
            ctx.fillStyle = drawCall.color;
            ctx.fillRect(drawCall.x, drawCall.y, 5, 5);
        }
    }

};

const displayUsers = () => {
    const userList = document.querySelector("#userList");
    // clear box
    userList.innerHTML = "";

    for (let i = 0; i < rooms[roomNum].UserIds.length; i++) {
        let user = document.createElement("LI");
        user.style.color = users[rooms[roomNum].UserIds[i]].color;
        if (id === rooms[roomNum].UserIds[i]) {
            user.style.listStyleType = "disc";
        }
        user.innerHTML += (users[rooms[roomNum].UserIds[i]].name + " - " + Math.round(users[rooms[roomNum].UserIds[i]].points) + " points");
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
