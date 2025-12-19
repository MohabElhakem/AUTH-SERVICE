// This File have App-wide Constants 

const { access } = require("fs");
const refreshToken = require("../modules/token/refresh.token");
const User = require("../modules/user/user.model");
const Session = require("../modules/session/session.model");

// Token expiration time , cookie name , user roles , rate limit values etc.
userRoles = ['user','admin','superadmin'];
refreshTokenExpiration = '7d';
accessTokenExpiration = '15m';








module.exports = {
    userRoles,
    refreshTokenExpiration,
    accessTokenExpiration,
};