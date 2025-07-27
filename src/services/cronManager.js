const axios = require('axios');
const cron = require('node-cron');
const Job = require('../models/Job');

const JOBICY_API_URL = 'https://jobicy.com/api/v2/remote-jobs?count=50';

// Notre liste de pays cibles
const TARGET_COUNTRIES = ['france', 'canada', 'spain', 'germany', 'italy', 'portugal', 'belgium'];

const fetchAndSaveFromJobicy = async () => {
  console.log('[Jobicy] Lancement de la tâche de récupération des offres...');
  try {
    const response = await axios.get(JOBICY_API_URL);

    if (response.data && response.data.jobs && response.data.jobs.length > 0) {
          
      // --- NOUVELLE ÉTAPE DE FILTRAGE ---
      const allJobs = response.data.jobs;
      console.log(`[Jobicy] ${allJobs.length} offres brutes récupérées.`);

      const filteredJobs = allJobs.filter(job => {
        if (!job.jobGeo) return false; // On ignore si la localisation est vide
        const locationLowerCase = job.jobGeo.toLowerCase();
        // On vérifie si la localisation contient un de nos pays cibles
        return TARGET_COUNTRIES.some(country => locationLowerCase.includes(country));
      });

      console.log(`[Jobicy] ${filteredJobs.length} offres correspondent à nos pays cibles.`);
      // --- FIN DU FILTRAGE ---

      if (filteredJobs.length > 0) {
        const jobsToSave = filteredJobs.map(job => ({
          title: job.jobTitle,
          company: job.companyName,
          location: job.jobGeo,
          country: job.jobGeo, // On garde la localisation complète pour l'affichage
          description: job.jobDescription,
          url: job.url,
          source: 'Jobicy',
          posted_at: new Date(job.pubDate),
        }));
            
        const newJobsCount = await Job.createMany(jobsToSave);
        console.log(`[Jobicy] Terminé. ${newJobsCount} nouvelles offres ont été ajoutées.`);
      } else {
        console.log('[Jobicy] Aucune des offres récupérées ne correspond à nos pays cibles.');
      }

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
  cron.schedule('0 */6 * * *', fetchAndSaveFromJobicy, { scheduled: true, timezone: "UTC" });
  console.log('Tâche de récupération planifiée.');
      
  console.log('Lancement initial de la récupération...');
  setTimeout(fetchAndSaveFromJobicy, 5000); 
};

module.exports = { initScheduledJobs };
