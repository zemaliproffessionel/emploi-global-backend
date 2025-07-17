const bcrypt = require('bcryptjs');
// On importe notre nouveau Modèle User
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    // Étape future : vérifier si l'utilisateur existe déjà
    // const userExists = await User.findByEmail(email);
    // if (userExists) {
    //   return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    // }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // On appelle notre Modèle pour créer l'utilisateur dans la DB !
    const newUser = await User.create(email, hashedPassword);

    // Si tout s'est bien passé, on envoie une réponse de succès
    res.status(201).json({ 
      message: `Utilisateur ${newUser.email} enregistré avec succès !`,
      userId: newUser.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de l'inscription." });
  }
};

module.exports = {
  registerUser,
};
