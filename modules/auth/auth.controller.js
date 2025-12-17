const authService = require('./auth.service');
const tokenService = require("../token/token.service");
const sessionService = require("../session/session.service");
const helpers = require("../../helpers/helpers.js");
require('dotenv').config();


const sign = async (req, res) => {

    try {
        console.log("Sign up controller started");
        // Sign up request and response here only the big logic
        const {username , email , password} = req.body;
        const user = await authService.Sign_To_the_database(username,email, password);
        console.log("user is signed up with no issues");
    
    
        // He is signed up now i need to give him his tokens
        const refreshToken = await tokenService.create_refresh_token();
        const accessToken = tokenService.create_access_token(user.userId , user.username , user.email , user.role);
        console.log("tokens are created successfully for the signed up user");
    
        // make a session for the user and store the refresh token selector and hashed secret in it
        // Get the ip and user agent from the request
        const {ipAddress, userAgent} = helpers.get_meta_request(req);
        const session = await sessionService.Create_new_Session(user.userId, refreshToken.selector, refreshToken.hashedSecret, ipAddress, userAgent);
        console.log("session created successfully for the signed up user And in the database");
    
        // Save the refresh token in the http only cookie
        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    
        })
        console.log("refresh token is set in the http only cookie");
    
        //now for the final output
        return res.status(201).json({
            message:"Welcom to our platform",
            user,
            accessToken,
        })
    } catch (error) {
        console.error("Error in sign up controller:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }

}

module.exports = {
    sign,
}