const updateRoom = (data) => {
    rooms[roomNum] = data.room;
    //console.log(data.room);
    // check if client is now the host
    draws = data.room.Plants;
    displayUsers();
}

const updateUsers = (data) => {
    users[data.user.id] = data.user;
    console.log(data.user);

    displayUsers();
}

const updateUserPosition = (data) => {
    //console.log('getMove');
    users[data.id].x = data.newX;
    users[data.id].y = data.newY;
} 

const removeUser = (data) => {
    delete users[data.id];
    rooms[roomNum].UserIds.splice(rooms[roomNum].UserIds.indexOf(data.id), 1);
    displayUsers();
}

const updatePlant = (data) => {
    draws[data.index] = data.plant;
    console.log(data.plant);
}


const updateAllPlants = (data) => {
    draws = data;
    console.log("update all plants");
    //draw();
}

const syncAll = (data) => {
    //console.log("sync all");
    if (data.Time >  lastUpdate){
        lastUpdate = data.Time;
        draws = data.Plants;
        let newerX = users[id].x;
        let newerY = users[id].y;
        users = data.Users;
        users[id].x = newerX;
        users[id].y = newerY;
        //draw();
        displayUsers();
    }
    //console.log(data);
}

const syncName = () => {
    document.querySelector("#nameField").value = users[id].name;
}

const newMessage = (data) => {
    if (messages.push(data) > 20) {
        messages.shift();
    }
    displayMessages();
}

const denied = (data) => {
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
}
