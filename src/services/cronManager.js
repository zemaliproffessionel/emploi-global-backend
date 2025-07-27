const axios = require('axios');
const cron = require('node-cron');
const Job = require('../models/Job'); // Le chemin vers votre modèle Job

// L'URL de l'API Jobicy. On peut la rendre plus générique plus tard.
const JOBICY_API_URL = 'https://jobicy.com/api/v2/remote-jobs?count=50';

/**
 * Cette fonction récupère les dernières offres depuis Jobicy et les sauvegarde en base de données.
 */
const fetchAndSaveFromJobicy = async ( ) => {
  console.log('[Jobicy] Lancement de la tâche de récupération des offres...');
  try {
    // 1. Appeler l'API
    const response = await axios.get(JOBICY_API_URL);

    if (response.data && response.data.jobs && response.data.jobs.length > 0) {
      // 2. Formater les données pour notre base de données
      const jobsToSave = response.data.jobs.map(job => ({
        title: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo || 'Remote', // 'jobGeo' peut être vide
        country: job.jobGeo ? job.jobGeo.split(',').pop().trim() : 'International',
        description: job.jobDescription, // La description est en HTML, le frontend devra la gérer
        url: job.url,
        source: 'Jobicy',
        posted_at: new Date(job.pubDate),
      }));

      console.log(`[Jobicy] ${jobsToSave.length} offres récupérées de l'API.`);
      
      // 3. Sauvegarder les nouvelles offres en base (la fonction createMany évite les doublons)
      const newJobsCount = await Job.createMany(jobsToSave);

      console.log(`[Jobicy] Terminé. ${newJobsCount} nouvelles offres ont été ajoutées.`);
    } else {
      console.log('[Jobicy] Aucune offre trouvée dans la réponse de l'API.');
    }
  } catch (error) {
    // Gestion des erreurs
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = `Status: ${error.response.status} - Data: ${JSON.stringify(error.response.data)}`;
    }
    console.error('[Jobicy] Erreur lors de la récupération ou sauvegarde :', errorMessage);
  }
};

/**
 * Cette fonction initialise la planification des tâches.
 */
const initScheduledJobs = () => {
  // Planifier la tâche pour qu'elle s'exécute toutes les 6 heures
  cron.schedule('0 */6 * * *', fetchAndSaveFromJobicy, {
    scheduled: true,
    timezone: "UTC"
  });
  console.log('Tâche de récupération des offres planifiée pour s\'exécuter toutes les 6 heures.');
  
  // Lancer la tâche une fois immédiatement au démarrage du serveur pour peupler la base de données
  console.log('Lancement initial de la récupération pour peupler la base de données...');
  setTimeout(fetchAndSaveFromJobicy, 5000); // On attend 5 secondes pour être sûr que le serveur est bien prêt
};

module.exports = { initScheduledJobs };
