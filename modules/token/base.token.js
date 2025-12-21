const jwt = require('jsonwebtoken');

class baseToken{
    #secret; //Private field to enforce encapsulation

    constructor (secret , expiresIn ){
        this.#secret = secret;
        this.expiresIn = expiresIn;
    }

    secret(){
        return this.#secret;
    }

    sign(){

    }
    verify(){
 
    }
    hasRole( roleFromTheToken , role ){
        return roleFromTheToken === role;
    }
}
module.exports = baseToken;

//Base token Abstraction
// containes 
// 1- commen token logic
// 2- verify / sign and a role helper methods
// Prevent code duplication
