'use strict'

const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');

const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');


// ROUTE PUBLIC
router.post('/register', LoginController.register);
router.post('/login', LoginController.login);


// ROUTE PRIVATE
router.get('/auth', Authentication.authenticated, UserController.getUserAuth);
//router.post('/upload-image', Authentication.authenticated, UserController.uploadImage);
router.get('/upload-image', UserController.uploadImage);


router.get('/user/:id', Authentication.authenticated, Authorization.grantAccess('GET_USER_BY_ID'), UserController.show);

router.get('/users', Authentication.authenticated, Authorization.grantAccess('GET_USERS'), UserController.index); // VERIFY IF USER CAN SEE ALL USERS
router.put('/user', Authentication.authenticated, Authorization.grantAccess('UPDATE_USER_AUTH'), UserController.update);
router.put('/user/:id', Authentication.authenticated, Authorization.grantAccess('UPDATE_USERS'), UserController.update);
router.delete('/user/:id', Authentication.authenticated, Authorization.grantAccess('DELETE_USERS'), UserController.delete);

module.exports = router;