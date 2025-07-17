const db = require('../config/db');

const User = {};

User.create = async (email, hashedPassword) => {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at;
  `;
  const values = [email, hashedPassword];
  
  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
};

// FONCTION AJOUTÉE : trouver un utilisateur par son email
User.findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  
  try {
    const res = await db.query(query, values);
    return res.rows[0]; // Retourne l'utilisateur s'il est trouvé, sinon undefined
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
};

module.exports = User;
