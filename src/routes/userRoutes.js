const express = require('express');
const router = express.Router();
// On importe notre nouveau contrôleur
const { registerUser } = require('../controllers/userController.js');

// Au lieu d'une fonction simple, on dit à la route d'utiliser
// la fonction registerUser de notre contrôleur.
router.post('/register', registerUser);

module.exports = router;
