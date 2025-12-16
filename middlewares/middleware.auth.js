const joiValidators = require('../validators/validators.auth');





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