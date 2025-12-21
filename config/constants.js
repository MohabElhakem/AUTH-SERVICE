// This File have App-wide Constants 
// Token expiration time , cookie name , user roles , rate limit values etc.
userRoles = ['user','admin','superadmin'];
refreshTokenExpiration = '7d';
accessTokenExpiration = '15m';








module.exports = {
    userRoles,
    refreshTokenExpiration,
    accessTokenExpiration,
};