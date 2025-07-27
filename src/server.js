const app = require('./app');
// On importe la fonction depuis le bon fichier dans le bon dossier
const { initScheduledJobs } = require('./services/cronManager.js'); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  // On lance la planification des tâches
  initScheduledJobs();
});
