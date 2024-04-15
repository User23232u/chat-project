const express = require('express');
const authController = require('../controllers/authController');

// authController.js

const router = express.Router();

// Importa el controlador

// Define las rutas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;