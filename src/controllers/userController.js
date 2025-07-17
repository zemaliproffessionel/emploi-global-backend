// On importe la librairie pour hacher les mots de passe
const bcrypt = require('bcryptjs');

// Cette fonction sera la logique pour l'inscription
const registerUser = async (req, res) => {
  try {
    // 1. On récupère l'email et le mot de passe
    const { email, password } = req.body;

    // 2. On vérifie si les données sont complètes
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    // 3. Hachage du mot de passe
    // On génère un "sel" pour rendre le hachage unique
    const salt = await bcrypt.genSalt(10);
    // On hache le mot de passe avec le sel
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`Email: ${email}`);
    console.log(`Mot de passe original: ${password}`);
    console.log(`Mot de passe haché: ${hashedPassword}`);

    // 4. Enregistrement dans la base de données (simulation pour l'instant)
    // Plus tard, on appellera notre "Modèle" ici pour faire le vrai enregistrement.
    // const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ 
      message: `Utilisateur ${email} prêt à être enregistré avec un mot de passe sécurisé.`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de l'inscription." });
  }
};

// On exporte notre fonction
module.exports = {
  registerUser,
};
