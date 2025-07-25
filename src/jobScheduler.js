const cron = require('node-cron');
const Job = require('./models/Job'); // On garde le modèle Job

// --- Liste de fausses offres d'emploi pour la simulation ---
const fakeJobs = [
  { title: 'Développeur Full-Stack (React/Node)', company: 'Tech Solutions Inc.', location: 'Paris', country: 'France', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/1', description: 'Rejoignez notre équipe dynamique pour développer des applications web innovantes.' },
  { title: 'Ingénieur DevOps Senior', company: 'Cloud Services', location: 'Lyon', country: 'France', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/2', description: 'Automatisez nos infrastructures cloud avec les dernières technologies.' },
  { title: 'Chef de Projet Digital', company: 'Marketing Agency', location: 'Marseille', country: 'France', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/3', description: 'Pilotez des projets web de A à Z pour des clients prestigieux.' },
  { title: 'Data Scientist', company: 'Data Analytics Corp.', location: 'Montréal, QC', country: 'Canada', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/4', description: 'Analysez des grands volumes de données pour en extraire des insights stratégiques.' },
  { title: 'Infirmier / Infirmière', company: 'Hôpital Central de Québec', location: 'Québec, QC', country: 'Canada', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/5', description: 'Poste en soins généraux dans un environnement stimulant.' },
  { title: 'Développeur Front-End (Vue.js )', company: 'Innovatech', location: 'Toronto, ON', country: 'Canada', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/6', description: 'Créez des interfaces utilisateur exceptionnelles pour nos produits SaaS.' },
  { title: 'Spécialiste Marketing Numérique', company: 'Growth Hackers', location: 'Barcelone', country: 'Espagne', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/7', description: 'Gérez nos campagnes publicitaires sur les réseaux sociaux et Google Ads.' },
  { title: 'Architecte Logiciel', company: 'Enterprise Software', location: 'Madrid', country: 'Espagne', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/8', description: 'Concevez l\'architecture de nos futures plateformes logicielles.' },
  { title: 'Business Developer', company: 'Startup Nation', location: 'Lisbonne', country: 'Portugal', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/9', description: 'Développez notre portefeuille de clients sur le marché européen.' },
  { title: 'UI/UX Designer', company: 'Creative Studio', location: 'Porto', country: 'Portugal', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/10', description: 'Imaginez et concevez des expériences utilisateur fluides et esthétiques.' },
  { title: 'Ingénieur Mécanique', company: 'Industrie 4.0', location: 'Berlin', country: 'Allemagne', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/11', description: 'Conception de pièces mécaniques pour le secteur automobile.' },
  { title: 'Responsable Logistique', company: 'Global Transport', location: 'Hambourg', country: 'Allemagne', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/12', description: 'Optimisez notre chaîne d\'approvisionnement internationale.' },
  { title: 'Cuisinier / Chef de Partie', company: 'Grand Hotel Roma', location: 'Rome', country: 'Italie', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/13', description: 'Rejoignez la brigade de notre restaurant gastronomique.' },
  { title: 'Traducteur Anglais - Italien', company: 'Lingua Services', location: 'Milan', country: 'Italie', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/14', description: 'Traduction de documents techniques et marketing.' },
  { title: 'Consultant IT', company: 'Digital Transformation Corp', location: 'Bruxelles', country: 'Belgique', source: 'EmploiGlobal Sim', url: 'https://emploiglobal.com/fake/15', description: 'Accompagnez nos clients dans leur transformation digitale.' }
];


const populateDatabase = async ( ) => {
  console.log('[Simulateur] Vérification de la base de données...');
  try {
    const existingJobs = await Job.getAll();
    if (existingJobs.length === 0) {
      console.log('[Simulateur] La base de données est vide. Remplissage avec des données de simulation...');
      // On utilise Promise.all pour insérer toutes les offres en parallèle
      await Promise.all(fakeJobs.map(job => Job.create(job)));
      console.log(`[Simulateur] ${fakeJobs.length} offres ont été insérées avec succès.`);
    } else {
      console.log('[Simulateur] La base de données contient déjà des offres. Aucune action requise.');
    }
  } catch (error) {
    console.error('[Simulateur] Erreur lors du remplissage de la base de données:', error);
  }
};

const scheduleJobs = () => {
  console.log('Tâches de simulation planifiées.');
  // On lance le remplissage une seule fois au démarrage du serveur
  populateDatabase();

  // On peut garder une tâche cron pour plus tard, mais on la laisse vide pour l'instant.
  cron.schedule('0 2 * * *', () => {
    console.log('Tâche cron nocturne exécutée (actuellement vide).');
  });
};

module.exports = { scheduleJobs };
