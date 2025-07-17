const express = require('express');
const router = express.Router();

// Pour l'instant, nous créons une route simple pour tester.
// Plus tard, nous la connecterons au vrai contrôleur.
router.post('/register', (req, res) => {
  res.status(201).json({ message: "Route d'inscription fonctionnelle" });
});

module.exports = router;
