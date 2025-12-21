
const { error } = require('console');
const sessionModel =require('./session.model.js');
const bcrypt = require('bcrypt');
const refreshTokenC = require('../token/refresh.token.js') 
const userModel = require('../user/user.model.js');
const refreshToken = require('../token/refresh.token.js');
const constants = require('../../config/constants.js');


// Creating a new session
// used for log in 
// used for refreshes a token 
exports.Create_new_Session = async (userID, tokenSelector, hashedTokenValidator, userAgent, ip) => {

    try {
    
        const Session = new sessionModel({
    
            userID,
            tokenSelector: tokenSelector,
            hashedTokenValidator: hashedTokenValidator,
            userAgent : userAgent || 'Unknown',
            ip: ip || 'Unknown',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    
        });
         const savedSession = await Session.save();
         console.log('New session created:');
         return savedSession;// return session object if successful

    
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;// throw and error so the controller can handel it 
    }
    
    //it returns the created session object or errors if any
}

exports.End_Session = async (session_selector) => {

    const session = await sessionModel.findOneAndDelete({ tokenSelector: session_selector });
    return !session ? false : true ;
    // this function only delete the dession and end it 
}

exports.End_all_sessions = async (user_id) => {
    try {
        const sessions =  await sessionModel.deleteMany({userID: user_id});
        return true 
    } catch (error) {
        console.log('error ending the sessions', error);
        throw new Error('failed to delete sessions')
    }
}

exports.extract_the_user_password_from_the_session = async (session_data) => {
    try {
        const U_id = session_data.userID;
        const user = await userModel.findOne({_id : U_id});
        if(!user) throw new Error ("no user found in the DB");
        return user.password
    } catch (error) {
        console.log("problem getting the password",error.message);
        return error;
    }
}