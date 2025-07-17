const express = require('express');
const router = express.Router();
// On importe les deux fonctions de notre contrôleur
const { registerUser, loginUser } = require('../controllers/userController.js');

// Route pour l'inscription
router.post('/register', registerUser);

// NOUVELLE ROUTE pour la connexion
router.post('/login', loginUser);

module.exports = router;
