const userDB = require("../user/user.model");
const sessionDB = require("../session/session.model");
const constants = require("../../config/constants");
const tokenService = require("../token/token.service");
const bcrypt = require("bcrypt");




exports.Sign_To_the_database = async (username,email, password) => {
    // Implemention of Sign logic 
    // nothing to do with the req and res
    // normall object

    try {
        if(!email) throw new Error("Email is required");
        if(!password) throw new Error("Password is required");
        if(!username) throw new Error("Username is required");
    
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await userDB.create({
            email,
            password: hashPassword,
            username,
        })
        return {
            userId: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
    } catch (error) {
        // handell if the email is duplicate
        if (error.code === 11000) {
            throw new Error("Email already in use");
        }
        // handell other errors
        else throw new Error(error.message);
    }
    // it returns and object of the user without the password
}


