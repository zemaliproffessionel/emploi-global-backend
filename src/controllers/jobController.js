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

module.exports = {
  getAllJobs,
};
