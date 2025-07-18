const cron = require('node-cron');
const { scrapeIndeed } = require('../scrapers/indeedScraper');
const Job = require('../models/Job');

// Fonction pour lancer le scraping et sauvegarder les résultats
const runIndeedScraping = async () => {
  console.log('Tâche planifiée : Démarrage du scraping Indeed...');
  try {
    const jobs = await scrapeIndeed();
    if (jobs && jobs.length > 0) {
      const newJobsCount = await Job.createMany(jobs);
      console.log(`${newJobsCount} nouvelles offres ont été ajoutées à la base de données.`);
    } else {
      console.log('Aucune offre trouvée ou une erreur est survenue lors du scraping.');
    }
  } catch (error) {
    console.error('Erreur dans la tâche de scraping planifiée :', error);
  }
  console.log('Tâche planifiée : Fin du scraping Indeed.');
};

// Planifier la tâche pour qu'elle s'exécute tous les jours à 2h du matin
// Le format est : 'Minute Heure JourMois Mois JourSemaine'
const initScheduledJobs = () => {
  // '0 2 * * *' = tous les jours à 2h00 du matin
  cron.schedule('0 2 * * *', runIndeedScraping, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  console.log('Tâches de scraping planifiées avec succès.');
  
  // Optionnel : Lancer une fois au démarrage pour tester
  // runIndeedScraping(); 
};

module.exports = { initScheduledJobs };
