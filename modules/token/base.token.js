const jwt = require('jsonwebtoken');

class baseToken{
    #secret; //Private field to enforce encapsulation

    constructor (secret , expiresIn ){
        this.#secret = secret;
        this.expiresIn = expiresIn;
    }

    sign(_id , username , email , role){
        const payload ={
            _id,
            username,
            email,
            role,
        }
        return jwt.sign(payload , this.#secret , {ewpiresIn: this.expiresIn})
    }
    verify(token){
        try{
            return jwt.verify(token , this.#secret)
        }catch(err){
            return null;
        }
    }
    hasRole(payload , role ){
        return payload.role === role;
    }
}
module.exports = baseToken;

//Base token Abstraction
// containes 
// 1- commen token logic
// 2- verify / sign and a role helper methods
// Prevent code duplication
