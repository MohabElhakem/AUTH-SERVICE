const express = require('express');
const router = express.Router();
const authController = require('./auth.controller.js');
const middleware = require('../../middlewares/middleware.auth');
const { signUp,login,logoutall} = require('../../validators/validators.auth');

// All the routers will be mounted here 
// EXAMPLE
//router.post('/login', authController.login);
router.post('/signUp', middleware.validate(signUp), authController.sign);
router.post('/login',middleware.validate(login),authController.login);
//you will add the middleware for the acces token to logout if needed ▼
router.get('/internal/logout',middleware.extractCookie,authController.logout)
//logout from all router
router.post(
    '/internal/logoutAll',
    middleware.validate(logoutall),
    middleware.extractCookie,
    authController.logoutAll
)

module.exports = router; 