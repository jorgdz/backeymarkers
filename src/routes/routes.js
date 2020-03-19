'use strict'

const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');

const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const FolderController = require('../controllers/FolderController');
const MarkerController = require('../controllers/MarkerController');
const PasswordController = require('../controllers/PasswordController');

const Authentication = require('../middlewares/Authentication');
const Authorization = require('../middlewares/Authorization');

//const MultipartMiddleware = multipart({ uploadDir: './src/tmp' });
const MultipartMiddleware = multipart();

// ROUTE PUBLIC
router.post('/register', LoginController.register);
router.post('/login', LoginController.login);


// ROUTE PRIVATE
router.get('/auth', Authentication.authenticated, UserController.getUserAuth);
router.post('/upload-image', [Authentication.authenticated, MultipartMiddleware], UserController.uploadImage);


// USERS
router.get('/user/:id', Authentication.authenticated, Authorization.hasAuthority('GET_USER_BY_ID'), UserController.show);
router.get('/users', Authentication.authenticated, Authorization.hasAuthority('GET_USERS'), UserController.index);
router.put('/user', Authentication.authenticated, Authorization.hasAuthority('UPDATE_USER_AUTH'), UserController.update);
router.put('/user/:id', Authentication.authenticated, Authorization.hasAuthority('UPDATE_USERS'), UserController.update);
router.delete('/user/:id', Authentication.authenticated, Authorization.hasAuthority('DELETE_USERS'), UserController.delete);


// FOLDERS
router.get('/folders', Authentication.authenticated, Authorization.hasAuthority('GET_FOLDERS'), FolderController.index);
router.get('/myfolders', Authentication.authenticated, Authorization.hasAuthority('GET_MY_FOLDERS'), FolderController.myfolders);
router.get('/folder/:id', Authentication.authenticated, Authorization.hasAuthority('GET_FOLDER_BY_ID'), FolderController.show);
router.post('/folder', Authentication.authenticated, Authorization.hasAuthority('CREATE_FOLDER'), FolderController.save);
router.put('/folder/:id', Authentication.authenticated, Authorization.hasAuthority('UPDATE_FOLDER'), FolderController.update);
router.delete('/folder/:id', Authentication.authenticated, Authorization.hasAuthority('DELETE_FOLDER'), FolderController.delete);


// MARKERS
router.get('/mymarkers/:id', Authentication.authenticated, Authorization.hasAuthority('GET_MY_MARKERS'), MarkerController.mymarkers);
router.get('/marker/:id', Authentication.authenticated, Authorization.hasAuthority('GET_MARKER_BY_ID'), MarkerController.show);
router.post('/marker', Authentication.authenticated, Authorization.hasAuthority('CREATE_MARKER'), MarkerController.save);
router.put('/marker/:id', Authentication.authenticated, Authorization.hasAuthority('UPDATE_MARKER'), MarkerController.update);
router.delete('/marker/:id', Authentication.authenticated, Authorization.hasAuthority('DELETE_MARKER'), MarkerController.delete);


// RANDOM PASSWORD
router.post('/password', Authentication.authenticated, Authorization.hasAuthority('GENERATE_PASSWORD'), PasswordController.generate);

module.exports = router;