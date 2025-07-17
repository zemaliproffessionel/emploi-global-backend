// On importe notre connecteur à la base de données
const db = require('../config/db');

const User = {};

// Fonction pour créer un nouvel utilisateur dans la base de données
User.create = async (email, hashedPassword) => {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at;
  `;
  const values = [email, hashedPassword];
  
  try {
    const res = await db.query(query, values);
    return res.rows[0]; // Retourne le nouvel utilisateur créé
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
};

// Plus tard, nous ajouterons ici d'autres fonctions, comme pour trouver un utilisateur
// User.findByEmail = async (email) => { ... };

module.exports = User;
