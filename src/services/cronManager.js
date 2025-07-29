const axios = require('axios');
const cron = require('node-cron');
const Job = require('../models/Job');

const JOBICY_API_URL = 'https://jobicy.com/api/v2/remote-jobs?count=50';

const fetchAndSaveFromJobicy = async () => {
  console.log('[Jobicy] Lancement de la tâche de récupération des offres...');
  try {
    const response = await axios.get(JOBICY_API_URL);

    if (response.data && response.data.jobs && response.data.jobs.length > 0) {
      const jobsToSave = response.data.jobs.map(job => ({
        title: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo || 'Remote',
        country: job.jobGeo ? job.jobGeo.split(',').pop().trim() : 'International',
        description: job.jobDescription,
        url: job.url,
        source: 'Jobicy',
        posted_at: new Date(job.pubDate),
      }));

      console.log(`[Jobicy] ${jobsToSave.length} offres récupérées de l'API.`);
          
      const newJobsCount = await Job.insertMany(jobsToSave);

      console.log(`[Jobicy] Terminé. ${newJobsCount} nouvelles offres ont été ajoutées.`);
    } else {
      console.log('[Jobicy] Aucune offre trouvée dans la réponse de l\'API.');
    }
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = `Status: ${error.response.status} - Data: ${JSON.stringify(error.response.data)}`;
    }
    console.error('[Jobicy] Erreur lors de la récupération ou sauvegarde :', errorMessage);
  }
};

const initScheduledJobs = () => {
  cron.schedule('0 */6 * * *', fetchAndSaveFromJobicy, {
    scheduled: true,
    timezone: "UTC"
  });
  console.log('Tâche de récupération des offres planifiée pour s\'exécuter toutes les 6 heures.');
          
  console.log('Lancement initial de la récupération pour peupler la base de données...');
  setTimeout(fetchAndSaveFromJobicy, 5000); 
};

module.exports = { initScheduledJobs };
