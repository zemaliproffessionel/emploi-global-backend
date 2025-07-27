const db = require('../config/db');

class Job {
  static async createMany(jobs) {
    let newJobsCount = 0;
    for (const job of jobs) {
      const checkQuery = 'SELECT id FROM jobs WHERE url = $1';
      const checkResult = await db.query(checkQuery, [job.url]);

      if (checkResult.rows.length === 0) {
        const insertQuery = `
          INSERT INTO jobs (title, company, location, country, description, source, url, posted_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const values = [
          job.title, job.company, job.location, job.country, 
          job.description, job.source, job.url, job.posted_at
        ];
        await db.query(insertQuery, values);
        newJobsCount++;
      }
    }
    return newJobsCount;
  }

  // ==================== NOUVELLE VERSION SIMPLIFIÉE ====================
  static async getAll(params = {}) {
    let baseQuery = 'SELECT * FROM jobs';
    const conditions = [];
    const values = [];

    // Filtre par mot-clé (query)
    if (params.query && params.query.trim() !== '') {
      values.push(`%${params.query.trim()}%`);
      conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    // Filtre par pays
    if (params.country && params.country.trim() !== '') {
      values.push(`%${params.country.trim()}%`);
      conditions.push(`country ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' ORDER BY created_at DESC LIMIT 50';

    const { rows } = await db.query(baseQuery, values);
    return rows;
  }
  // =====================================================================

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Job;
