const db = require('../config/db');

const Job = {};

// Fonction pour insérer plusieurs offres d'un coup
// On vérifie que l'URL n'existe pas déjà pour éviter les doublons
Job.createMany = async (jobs) => {
  let newJobsCount = 0;
  for (const job of jobs) {
    const checkQuery = 'SELECT id FROM jobs WHERE url = $1';
    const checkResult = await db.query(checkQuery, [job.url]);

    if (checkResult.rows.length === 0) {
      const insertQuery = `
        INSERT INTO jobs (title, company, location, url, source, country)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [job.title, job.company, job.location, job.url, job.source, job.country];
      await db.query(insertQuery, values);
      newJobsCount++;
    }
  }
  return newJobsCount;
};

module.exports = Job;
