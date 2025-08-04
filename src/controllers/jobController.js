const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  try {
    // On récupère les filtres depuis l'URL (ex: /api/jobs?country=France)
    const filters = req.query;
    const jobs = await Job.getAll(filters);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des offres." });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: "Offre non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur." });
  }
};

const getUniqueCountries = async (req, res) => {
  try {
    const countries = await Job.getUniqueCountries();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des pays uniques." });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  getUniqueCountries, // On exporte la nouvelle fonction
};
