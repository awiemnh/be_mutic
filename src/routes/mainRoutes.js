// backend/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const router = express.Router();

router.post('/login', userController.login);
router.post('/signup', userController.signUp);
router.post('/logout', userController.logout);
router.get('/user', userController.user);

module.exports = router;