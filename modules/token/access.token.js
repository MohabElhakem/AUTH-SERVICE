const baseToken = require('./base.token.js');
const constants = require('../../config/constants.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');

class accessToken extends baseToken{
    constructor(){
        super(process.env.ACCESS_TOKEN_SECRET , constants.accessTokenExpiration);
}  
    sign(_id , username , email , role){
        const payload ={
        _id,
        username,
        email,
        role,
        }
        return jwt.sign(payload , this.secret() , {expiresIn: this.expiresIn})
    }

    verify(token){

        try{
            const decoded = jwt.verify(token , this.secret());
            return {valid: true , safe:true, decoded}
        }catch(err){
            if(err.name === 'TokenExpiredError'){
                return {valid: false , safe: true , reason: 'expired'}
            }
            else if(err.name === 'JsonWebTokenError'){
                return {valid: false , safe: false , reason: 'invalid token!!'}
            }
            else if (err.name === 'NotBeforeError'){
                return {valid: false , safe: true , reason: 'not active yet'}
            }
            else {
                return {valid: false , safe: true , reason: err.message }
            }
        }
    }
}

module.exports = accessToken;

// Access token class
// Extends the base token class
// Uses the access token secret and expiration time
// Short lived token for authenticating user requests
// valid is to go to the next step
// safe is for knowing if we can trust the user or this request or not
// reason is for understanding why the token is invalid or not safe