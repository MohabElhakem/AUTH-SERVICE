const express = require('express');
const router = express.Router();
const authController = require('./auth.controller.js');

// All the routers will be mounted here 
// EXAMPLE
//router.post('/login', authController.login);
router.post('/signUp', authController.sign);


module.exports = router; 