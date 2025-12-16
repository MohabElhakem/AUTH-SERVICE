const baseToken = require('./base.token');
const constants = require('../../config/constants.js');
require('dotenv').config();

class refreshToken extends baseToken{

    constructor(){
        super(process.env.REFRESH_TOKEN_SECRET , constants.refreshTokenExpiresIn);
    }

}
module.exports = refreshToken;

// Refresh token class
// Extends the base token class
// Uses the refresh token secret and expiration time
// Long lived token for obtaining new access tokens