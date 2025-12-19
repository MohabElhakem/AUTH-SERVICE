const joi = require('joi');

// Validator for authentication-related operations

// Sign Up Validator
exports.signUp = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

exports.login = joi.object({
    email:joi.string().email().required(),
    password: joi.string().min(6).required()
})