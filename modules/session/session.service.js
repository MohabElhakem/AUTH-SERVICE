
const { error } = require('console');
const sessionModel =require('./session.model.js');
const bcrypt = require('bcrypt');
const refreshTokenC = require('../token/refresh.token.js') 
const userModel = require('../user/user.model.js');
const refreshToken = require('../token/refresh.token.js');


// Creating a new session
// used for log in 
// used for refreshes a token 
const Create_new_Session = async (userInfo, refreshToken , userAgent , ip  )=>{

    try {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
    
        const Session = new sessionModel({
    
            userID: userInfo._id,
            refreshTokenHash: hashedToken,
            userAgent : userAgent || 'Unknown',
            ip: ip || 'Unknown',
            expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7 days from now
    
        });
         const savedSession = await Session.save();
         console.log('New session created:');
         return savedSession;// return session object if successful

    
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;// throw and error so the controller can handel it 
    }
}





// Validating an existing session
// use when user sends a refresh token
// rotates the refresh token with new one 
// must have a refresh token and session id
// must replace the new refresh token in the client side storage
const Validate_Rotate_Session = async (session_id , providedRefreshToken) => {

    try {
        const session = await sessionModel.findById(session_id); // search for the session
        if (!session) throw new Error ('session not found'); 
        const valid = await bcrypt.compare(providedRefreshToken, session.refreshTokenHash); // compare the two tokens to know if they match
        if(!valid) throw new Error ('Invalied refresh token'); 
        if (session.expiresAt < new Date()) throw new Error('Session expired');
    
        // all things are good now make a new refresh token and update it 
        const user = await userModel.findById(session.userID);
        if(!user) throw new Error('Could not find the user to rotate a refresh token ');
        
        const newRefreshTokenInstance = new refreshTokenC(); // make a new instance to use the methods
        const newRefreshToken = newRefreshTokenInstance.sign(user._id, user.username , user.email, user.role);
        const newHashedToken = await bcrypt.hash(newRefreshToken, 10); // hash the new token
        
        // update the session with the new hashed token and new expiration date
        session.refreshTokenHash = newHashedToken;
        session.expiresAt = new Date(Date.now() + 7*24*60*60*1000); // 7 days from now
        await session.save();
    
        return {
            sessionID : session._id,
            refreshToken : newRefreshToken,
        };
    } catch (error) {
        console.error('Error validating session:', error);
        throw error;
    }
}


module.exports = {
    Create_new_Session,
    Validate_Rotate_Session
};