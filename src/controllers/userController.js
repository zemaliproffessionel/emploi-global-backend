const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- Fonction d'inscription ---
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    // Note : nous ajouterons la vérification de l'existence de l'utilisateur plus tard
    // const userExists = await User.findByEmail(email);
    // if (userExists) {
    //   return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    // }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(email, hashedPassword);

    res.status(201).json({ 
      message: `Utilisateur ${newUser.email} enregistré avec succès !`,
      userId: newUser.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de l'inscription." });
  }
};

// --- Fonction de connexion ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'votre_secret_par_defaut',
      { expiresIn: '1h' }
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

// On exporte les deux fonctions pour qu'elles soient utilisables
module.exports = {
  registerUser,
  loginUser,
};
