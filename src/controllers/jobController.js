const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  try {
    // On récupère les filtres depuis l'URL (ex: /api/jobs?country=France)
    const filters = req.query;
    const jobs = await Job.getAll(filters);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des offres.' });
  }
};

// NOUVELLE FONCTION
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Offre non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

module.exports = {
  getAllJobs,
  getJobById, // On exporte la nouvelle fonction
};

