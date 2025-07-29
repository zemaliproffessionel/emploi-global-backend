const db = require('../config/db');

class Job {
  static async createMany(jobs) {
    if (!jobs || jobs.length === 0) {
      return 0;
    }
    const values = jobs.map(job => `(
      '${job.title.replace(/'/g, "''")}',
      '${job.company.replace(/'/g, "''")}',
      '${job.location.replace(/'/g, "''")}',
      '${job.url}',
      '${job.source}',
      '${job.country}'
    )`).join(',');

    const query = `
      INSERT INTO jobs (title, company, location, url, source, country)
      VALUES ${values}
      ON CONFLICT (url) DO NOTHING;
    `;
    try {
      const res = await db.query(query);
      return res.rowCount;
    } catch (error) {
      console.error("Erreur lors de l'insertion multiple :", error);
      return 0;
    }
  }

  static async getAll(params = {}) {
    let baseQuery = 'SELECT * FROM jobs';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (params.country) {
      conditions.push(`country ILIKE $${paramIndex++}`);
      values.push(`%${params.country}%`);
    }
    if (params.query) {
      conditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
      values.push(`%${params.query}%`);
      values.push(`%${params.query}%`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' ORDER BY created_at DESC LIMIT 50';

    // Log de débogage crucial
    console.log('--- REQUÊTE SQL EXÉCUTÉE ---');
    console.log('Query:', baseQuery);
    console.log('Values:', values);
    console.log('-----------------------------');

    try {
      const { rows } = await db.query(baseQuery, values);
      return rows;
    } catch (error) {
      console.error("Erreur lors de l'exécution de la requête getAll :", error);
      return [];
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Job;
