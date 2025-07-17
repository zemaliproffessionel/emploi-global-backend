// Importe le framework Express pour créer le serveur
const express = require('express');
const cors = require('cors');

// Crée l'application Express
const app = express();

// Configure l'application pour qu'elle puisse communiquer avec le site web (frontend)
app.use(cors());

// Configure l'application pour qu'elle puisse lire les données JSON
app.use(express.json());

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le serveur EmploiGlobal fonctionne !');
});

// Exporte l'application pour qu'elle puisse être utilisée par d'autres fichiers
module.exports = app;
