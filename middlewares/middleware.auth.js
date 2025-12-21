const joiValidators = require('../validators/validators.auth');
const authService = require('../modules/auth/auth.service');





// Middleware for validating sign-up requests
// Same Logic diffrent role so a Higher Order function
exports.validate= (Schema,property = 'body')=> {
    // Return middleware function
    return (req , res , next) =>{
        //What joi returns 
        //run joi validate
        const {error , value} = Schema.validate(req[property],{
            abortEarly :false , // to show all errors not just the first one
            stripUnknown : true // to remove any unwanted fields
        })

        if(error){
            return res.status(400).json({
                message : 'Validation error',
                details : error.details.map(detail => detail.message)
            })
        }

        // If validation is successful, replace the request body with the validated value
        req[property] = value
        next()
    }
}


exports.extractCookie = (req, res, next) => {
    console.log("Extracting cookie information middleware called");
    // Middleware to extract cookie information

    const { refreshToken } = req.cookies;
    if (!refreshToken){
        console.log("No refresh token found in cookies go to the log in route");
        return res.status(401).json({
            message: "Unauthorized: No refresh token provided",
            action: "Please log in",
        })
    }
    const parts = refreshToken.split('.');
    
    if(parts.length !== 2){
        console.log("Invalid refresh token format in cookies");
        // its invailed token delte it 
        authService.clear_refresh_token(res);
        // return the response
        return res.status(400).json({
            message: "Bad Request: Invalid refresh token format",
            action: "Please log in",
        })
    }

    req.refreshToken ={
        selector: parts[0],
        validator: parts[1],
    }
    return next();
    // a middleware to extract refresh token information
}