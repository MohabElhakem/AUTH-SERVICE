const express = require('express');
const router = express.Router();
const authController = require('./auth.controller.js');
const middleware = require('../../middlewares/middleware.auth');
const { signUp,login } = require('../../validators/validators.auth');

// All the routers will be mounted here 
// EXAMPLE
//router.post('/login', authController.login);
router.post('/signUp', middleware.validate(signUp), authController.sign);
router.post('/login',middleware.validate(login),authController.login)

module.exports = router; 