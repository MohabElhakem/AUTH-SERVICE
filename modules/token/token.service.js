// HERE IS ALL THE LOGIC BEHIND ANYTHING RELATED TO A TOKENS THAT IS NOT IN ITS CLASS ITSELF
// LIKE STORING REFRESH TOKENS IN DB , INVALIDATING TOKENS , ROTATING TOKENS ETC.
const accessToken = require('./access.token');
const refreshToken = require('./refresh.token');
exports.create_refresh_token = async () => {
    const refresh_token_instance = new refreshToken();
    return refresh_token_instance.sign();
    // this function returns an object containing the token, selector, and hashedSecret
}

exports.validate_refresh_token = async (token, hashedSecretDB) => {
    const refresh_token_instance = new refreshToken();
    return await refresh_token_instance.verify(token, hashedSecretDB);
    // this function returns true if valid, false otherwise chick the console for more details
}

exports.create_access_token = (_id , username , email , role= "user") => {
    const access_token_instance = new accessToken();
    return access_token_instance.sign(_id , username , email , role);
    // this function returns the signed access token JWT 
}

exports.rotate_refresh_token =async (token) => {
    const refresh_token_instance= new refreshToken();
    return await refresh_token_instance.rotate(token) ;
    // this function output is object with token , selector and hasedSecret
}

exports.validate_access_token = (token) => {
    const access_token_instance = new accessToken();
    return access_token_instance.verify(token);
    // this funtion return an object with valid , safe and decode or reason
}

exports.validate_the_role = (roleFromTheToken , role) => {
    const access_token_instance = new accessToken();
    return access_token_instance.hasRole(roleFromTheToken , role) 
    // this function return true or false 
}