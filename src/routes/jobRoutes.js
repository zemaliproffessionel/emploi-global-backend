const express = require("express");
const router = express.Router();
const { getAllJobs, getJobById, getUniqueCountries } = require("../controllers/jobController");

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.get("/countries", getUniqueCountries); // Nouvelle route pour les pays uniques

module.exports = router;
