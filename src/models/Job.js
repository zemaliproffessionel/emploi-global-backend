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

  static async getAll(params = {}) {
    let baseQuery = 'SELECT * FROM jobs';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Filtre par pays (recherche si le nom du pays est CONTENU dans le champ)
    if (params.country && params.country !== '') {
      // ==================== CORRECTION CRITIQUE ICI ====================
      conditions.push(`country ILIKE $${paramIndex++}`);
      values.push(`%${params.country}%`); // On ajoute les '%' pour chercher n'importe où dans la chaîne
      // ===============================================================
    }
        
    // Filtre par mot-clé (insensible à la casse)
    if (params.query && params.query !== '') {
      conditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
      values.push(`%${params.query}%`);
      values.push(`%${params.query}%`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' ORDER BY posted_at DESC LIMIT 50';

    const { rows } = await db.query(baseQuery, values);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Job;
