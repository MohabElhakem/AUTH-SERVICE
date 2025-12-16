const baseToken = require('./base.token');
const constants = require('../../config/constants.js');
require('dotenv').config();

class accessToken extends baseToken{
    constructor(){
        super(process.env.ACCESS_TOKEN_SECRET , constants.accessTokenExpiration);
}  
}

module.exports = accessToken;

// Access token class
// Extends the base token class
// Uses the access token secret and expiration time
// Short lived token for authenticating user requests