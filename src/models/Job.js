const db = require('../config/db');

const Job = {};

Job.createMany = async (jobs) => {
  let newJobsCount = 0;
  for (const job of jobs) {
    const checkQuery = 'SELECT id FROM jobs WHERE url = $1';
    const checkResult = await db.query(checkQuery, [job.url]);

    if (checkResult.rows.length === 0 && job.title && job.url) {
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

Job.getAll = async (filters = {}) => {
  let query = 'SELECT id, title, company, location, country, created_at FROM jobs';
  const queryParams = [];
  let whereClauses = [];

  if (filters.country) {
    queryParams.push(filters.country);
    whereClauses.push(`country ILIKE $${queryParams.length}`);
  }
  
  if (filters.title) {
    queryParams.push(`%${filters.title}%`);
    whereClauses.push(`title ILIKE $${queryParams.length}`);
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  query += ' ORDER BY created_at DESC LIMIT 50';

  try {
    const res = await db.query(query, queryParams);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
};

// NOUVELLE FONCTION : trouver une offre par son ID
Job.findById = async (id) => {
  const query = 'SELECT * FROM jobs WHERE id = $1';
  const values = [id];
  
  try {
    const res = await db.query(query, values);
    return res.rows[0]; // Retourne l'offre si elle est trouvée
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
};

module.exports = Job;
