const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Pour créer le token de connexion
const User = require('../models/User');

// --- Fonction d'inscription (inchangée) ---
const registerUser = async (req, res) => {
  // ... (le code existant reste ici, pas besoin de le copier à nouveau)
};

// --- NOUVELLE FONCTION DE CONNEXION ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Trouver l'utilisateur dans la base de données
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 2. Comparer le mot de passe fourni avec celui qui est haché dans la DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 3. Si tout est bon, créer un token de connexion (JWT)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'votre_secret_par_defaut', // Le secret doit être dans un fichier .env
      { expiresIn: '1h' } // Le token expirera dans 1 heure
    );

    res.status(200).json({
      message: 'Connexion réussie !',
      token: token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de la connexion." });
  }
};

// On exporte les deux fonctions
module.exports = {
  registerUser,
  loginUser,
};
