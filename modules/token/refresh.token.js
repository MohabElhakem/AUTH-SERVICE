const baseToken = require('./base.token');
const constants = require('../../config/constants.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class refreshToken extends baseToken{

    constructor(){
        super( "null" , constants.refreshTokenExpiresIn);
    }
    
    async sign () {

        //Generate the crypto token with two parts the validator and the selector
        const selector = crypto.randomBytes(16).toString('hex');    // the selector is to identify which token it is 
        const validator = crypto.randomBytes(32).toString('hex');  // the validator is to verify the token

        const token = `${selector}.${validator}`; //combine both parts to form the token
        return {
            token,
            selector,
            hashedSecret: await bcrypt.hash(validator, 10), //hash the validator to store it in the database
        };

    }   

    async verify(token, hashedSecretDB){
        try {
            const parts = token.split('.'); //split the token to get both parts
            if(parts.length !==2) {
                console.error("Invalid token format");
                return false;
            }
            const validator = parts[1]; //get the validator part
            const isValid = await bcrypt.compare( validator, hashedSecretDB); //compare the validator with the secret
            return isValid;
        } catch (error) {
            console.error('Error verifying refresh token:', error);
            return false;
        }
    }

    async rotate(token_to_rotate){
        //to rotate old token
        if (!token_to_rotate) throw new Error("No token provided for rotation");
        const parts = token_to_rotate.split('.'); //split the token to get both parts
        if(parts.length !==2) throw new Error("Invalid token format"); //invalid token format
        const selector = parts[0]; //get the selector part
        const newValidator = crypto.randomBytes(32).toString('hex');  // generate a new validator
        const newToken = `${selector}.${newValidator}`; //combine both parts to form the new token
        return {
            token: newToken,
            selector: selector,
            hashedSecret: await bcrypt.hash(newValidator, 10), //hash the new validator to store it in the database
        };

    }

}
module.exports = refreshToken;

// Refresh token class
// Extends the base token class
// Uses the refresh token secret and expiration time
// Long lived token for obtaining new access tokens