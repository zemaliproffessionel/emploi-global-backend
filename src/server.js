const app = require('./app');
const { scheduleJobs } = require('./jobScheduler'); // On importe notre nouveau planificateur

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  // On lance la planification des tâches (qui va remplir la DB si elle est vide)
  scheduleJobs();
});
