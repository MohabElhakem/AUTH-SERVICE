// This File have App-wide Constants 

const { access } = require("fs");
const refreshToken = require("../modules/token/refresh.token");

// Token expiration time , cookie name , user roles , rate limit values etc.
userRoles = ['user','admin','superadmin'];
refreshTokenExpiration = '7d';
refreshTokenExpirationInSessions = 7 * 24 * 60 * 60 * 1000;
accessTokenExpiration = '15m';








module.exports = {
    userRoles,
    refreshTokenExpiration,
    accessTokenExpiration,
};