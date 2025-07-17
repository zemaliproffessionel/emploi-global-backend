// On importe le "pilote" pour pouvoir parler à PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// On crée un "pool" de connexions.
// C'est plus efficace que de créer une nouvelle connexion à chaque fois.
const pool = new Pool({
  // Les informations de connexion seront stockées dans un fichier .env sécurisé
  // Pour l'instant, on met des valeurs par défaut.
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// On exporte une fonction qui nous permettra d'envoyer des requêtes à la DB
module.exports = {
  query: (text, params) => pool.query(text, params),
};
