// Cette fonction sera la logique pour l'inscription
const registerUser = (req, res) => {
  // 1. On récupère l'email et le mot de passe envoyés par l'utilisateur
  const { email, password } = req.body;

  // 2. On vérifie si l'email et le mot de passe ont bien été fournis
  if (!email || !password) {
    // Si un des deux manque, on envoie une erreur
    return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
  }

  // 3. Si tout va bien, on affiche un message de succès.
  // (Plus tard, ici, nous ajouterons le code pour enregistrer dans la base de données)
  console.log(`Nouvelle inscription demandée pour l'email : ${email}`);
  
  res.status(201).json({ 
    message: `Utilisateur avec l'email ${email} enregistré avec succès !`,
    // Plus tard, on enverra un "token" de connexion ici
  });
};

// On exporte notre fonction pour que d'autres fichiers puissent l'utiliser
module.exports = {
  registerUser,
};
