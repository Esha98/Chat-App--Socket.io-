const Users = [];


//Join users to chat
function userJoin(id, username, room) {
    const user = {id, username, room};

    Users.push(user);

    return user;
}

//Get current user
function currentUser(id) {
    return Users.find(user => user.id === id);
}

//user leaves chat
function userLeave(id) {
    const index = Users.findIndex(user => user.id === id);

    if(index !== -1) {
        return Users.splice(index, 1)[0];
    }
}

//Get room users
function getRoomUsers (room) {
    return Users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    currentUser,
    userLeave,
    getRoomUsers
}