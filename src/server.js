const app = require('./app');
const { initScheduledJobs } = require('./services/cronManager'); // <-- LIGNE AJOUTÉE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  
  // Lancer le planificateur de tâches
  initScheduledJobs(); // <-- LIGNE AJOUTÉE
});
