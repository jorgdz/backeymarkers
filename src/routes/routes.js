'use strict'

const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');

const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const FolderController = require('../controllers/FolderController');
const MarkerController = require('../controllers/MarkerController');

const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');

const MultipartMiddleware = multipart({ uploadDir: './src/tmp' });

// ROUTE PUBLIC
router.post('/register', LoginController.register);
router.post('/login', LoginController.login);


// ROUTE PRIVATE
router.get('/auth', Authentication.authenticated, UserController.getUserAuth);
router.post('/upload-image', [Authentication.authenticated, MultipartMiddleware], UserController.uploadImage);


// USERS
router.get('/user/:id', Authentication.authenticated, Authorization.grantAccess('GET_USER_BY_ID'), UserController.show);
router.get('/users', Authentication.authenticated, Authorization.grantAccess('GET_USERS'), UserController.index);
router.put('/user', Authentication.authenticated, Authorization.grantAccess('UPDATE_USER_AUTH'), UserController.update);
router.put('/user/:id', Authentication.authenticated, Authorization.grantAccess('UPDATE_USERS'), UserController.update);
router.delete('/user/:id', Authentication.authenticated, Authorization.grantAccess('DELETE_USERS'), UserController.delete);


// FOLDERS
router.get('/folders', Authentication.authenticated, Authorization.grantAccess('GET_FOLDERS'), FolderController.index);
router.get('/myfolders', Authentication.authenticated, Authorization.grantAccess('GET_MY_FOLDERS'), FolderController.myfolders);
router.get('/folder/:id', Authentication.authenticated, Authorization.grantAccess('GET_FOLDER_BY_ID'), FolderController.show);
router.post('/folder', Authentication.authenticated, Authorization.grantAccess('CREATE_FOLDER'), FolderController.save);


// MARKERS
router.get('/mymarkers/:id', Authentication.authenticated, Authorization.grantAccess('GET_MY_MARKERS'), MarkerController.mymarkers);
router.post('/marker', Authentication.authenticated, Authorization.grantAccess('CREATE_MARKER'), MarkerController.save);

module.exports = router;