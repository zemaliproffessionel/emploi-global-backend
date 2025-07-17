// Importe l'application que nous venons de créer
const app = require('./app');

// Définit le port sur lequel le serveur va écouter. 
// Par défaut, ce sera le port 5000.
const PORT = process.env.PORT || 5000;

// Lance le serveur et affiche un message dans la console pour dire qu'il est prêt
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
