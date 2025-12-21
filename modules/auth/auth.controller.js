const authService = require('./auth.service');
const tokenService = require("../token/token.service");
const sessionService = require("../session/session.service");
const helpers = require("../../helpers/helpers.js");
require('dotenv').config();

// the sign up controller
const sign = async (req, res) => {

    try {
        console.log("Sign up controller started");
        // Sign up request and response here only the big logic
        const {username , email , password} = req.body;
        const user = await authService.Sign_To_the_database(username,email, password);
        console.log("user is signed up with no issues");
    
    
        // He is signed up now i need to give him his tokens
        const refreshToken = await tokenService.create_refresh_token();
        const accessToken = tokenService.create_access_token(
            user.userId , 
            user.username , 
            user.email , 
            user.role
        );
        console.log("tokens are created successfully for the signed up user");
    
        // make a session for the user and store the refresh token selector and hashed secret in it
        // Get the ip and user agent from the request
        const {ipAddress, userAgent} = helpers.get_meta_request(req);
        const session = await sessionService.Create_new_Session(
            user.userId, 
            refreshToken.selector, 
            refreshToken.hashedSecret, 
            ipAddress, 
            userAgent
        );
        console.log("session created successfully for the signed up user And in the database");
    
        // Save the refresh token in the http only cookie
        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/auth/internal',
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

// The login controller
const login = async (req, res) => {
    try {
        console.log("Login controller starting");
        // take the email and password from the request body
        const { email, password } = req.body;
        if(!email || !password) throw new Error("Email and password are required");
        //2- find the user
        const searchResult = await helpers.Search_By('user', 'email',email);
        if(!searchResult.found || !searchResult.data) throw new Error("User not found");

        const user = searchResult.data;

        //3_ check the password
        const validUser = await helpers.Validate_Password(password, user.password);
        if(!validUser) throw new Error("Invalid password");
        
        //4- create the tokens
        const refreshToken = await tokenService.create_refresh_token();
        const accessToken = tokenService.create_access_token(
            user._id , 
            user.username , 
            user.email , 
            user.role
        );
        console.log("tokens are created successfully for the logged in user");
    
        //5- create the session
        const {ipAddress, userAgent} = helpers.get_meta_request(req);
        const session = await sessionService.Create_new_Session(
            user._id,
            refreshToken.selector,
            refreshToken.hashedSecret,
            ipAddress,
            userAgent
        );
        console.log("session created successfully for the logged in user And in the database");
    
        //6- set the refresh token in the http only cookie
            res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/auth/internal',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
         })
    
         return res.status(200).json({
            message: "Welcome back",
            user: {
                userId: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            accessToken,
         })
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }

}

const logout = async (req ,res) => {
    // first end the session
    const EndSession = await sessionService.End_Session(req.refreshToken.selector);
    EndSession ? console.log('session found and deleted') : console.log("session already out");
    // then clear the cookie
    authService.clear_cookie(res)
    //Then force logout 
    return res.status(200).json({
        forcelogout: true,
        message: "loged out successfully"
    })

}

const logoutAll = async (req, res) => {

    try {
        const {password} = req.body;
        if(!password) throw new Error("the password is nedded")
        
        //the selector in the cookie dont forget
        // first get the session from the selector
        const searchSession = await helpers.Search_By(
            'session',
            'tokenSelector',
            req.refreshToken.selector);

        if (searchSession.found === false || !searchSession.data ){
            return res.status(400).json({
                message: "this session is not in the database",
                action:"go tho the speacial route where you will provide the email and password for this action"
            })
        }
        // 2_ i have the session get the password to vaidate
        const HashedPassword = await sessionService.extract_the_user_password_from_the_session(searchSession.data);
        // 3= validate the passwprd
        const secure = await helpers.Validate_Password(password,HashedPassword);
        if (!secure) throw new Error ("Wrong password!!!")
        // the right password delte all sessions with that user id 
    
        await sessionService.End_all_sessions(searchSession.data.userID);
    
        // clear the cookie
        authService.clear_cookie(res);

        console.log('user have been loged out from all devices no session are active');

        return res.status(201).json({
            message: "user have been loged out from every device "
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error.message
        })
    }
}



module.exports = {
    sign,
    login,
    logout,
    logoutAll,
}