const User = require('../modules/user/user.model');
const Session = require('../modules/session/session.model');

const searchMap = {
    user :{
        model : User,
        fieldsToSearch : ['username' , 'email' , 'role','_id'],
    },
    session :{
        model : Session,
        fieldsToSearch : ['userID' , 'tokenSelector' , 'userAgent' , '_id'],
    },
    // add more models as needed
}

module.exports = {
    searchMap,
};

