const db = require('../config/db');

class Job {
  static async insertMany(jobs) {
    if (!jobs || jobs.length === 0) return 0;
    const values = jobs.flatMap(job => [
      job.title, job.company, job.location, job.url, job.source, job.country, job.description, job.posted_at
    ]);
    const placeholders = jobs.map((_, i) => `($${i*8+1}, $${i*8+2}, $${i*8+3}, $${i*8+4}, $${i*8+5}, $${i*8+6}, $${i*8+7}, $${i*8+8})`).join(',');
    const query = `INSERT INTO jobs (title, company, location, url, source, country, description, posted_at) VALUES ${placeholders} ON CONFLICT (url) DO NOTHING;`;
    try {
      const res = await db.query(query, values);
      return res.rowCount;
    } catch (error) {
      console.error("Erreur lors de l'insertion multiple :", error);
      return 0;
    }
  }

  // ==================== CORRECTION DÉFINITIVE DE LA LOGIQUE DE RECHERCHE ====================
  static async getAll(params = {}) {
    let baseQuery = 'SELECT id, title, company, location, country, url, created_at FROM jobs';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (params.country && params.country !== 'Tous les pays') {
      conditions.push(`country ILIKE $${paramIndex++}`);
      values.push(`%${params.country}%`);
    }
    if (params.query) {
      conditions.push(`(title ILIKE $${paramIndex++})`);
      values.push(`%${params.query}%`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' ORDER BY created_at DESC LIMIT 50';
        
    try {
      const { rows } = await db.query(baseQuery, values);
      return rows;
    } catch (error) {
      console.error("Erreur lors de l'exécution de la requête getAll :", error);
      return [];
    }
  }
  // ========================================================================================

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Job;
