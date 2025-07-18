const express = require('express');
const router = express.Router();
const { getAllJobs } = require('../controllers/jobController');

// Route pour récupérer toutes les offres (avec filtres possibles)
router.get('/', getAllJobs);

module.exports = router;
