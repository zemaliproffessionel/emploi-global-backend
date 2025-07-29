const db = require('../config/db');

class Job {
  // ==================== NOUVELLE FONCTION AJOUTÉE ====================
  static async insertMany(jobs) {
    if (!jobs || jobs.length === 0) {
      return 0;
    }
    // Prépare les données pour une insertion en masse sécurisée
    const values = jobs.flatMap(job => [
      job.title,
      job.company,
      job.location,
      job.url,
      job.source,
      job.country,
      job.description,
      job.posted_at
    ]);
        
    // Crée une chaîne de placeholders ($1, $2, $3), ($4, $5, $6), etc.
    const placeholders = jobs.map((_, index) => {
      const i = index * 8;
      return `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6}, $${i + 7}, $${i + 8})`;
    }).join(',');

    const query = `
      INSERT INTO jobs (title, company, location, url, source, country, description, posted_at)
      VALUES ${placeholders}
      ON CONFLICT (url) DO NOTHING;
    `;

    try {
      const res = await db.query(query, values);
      return res.rowCount; // Retourne le nombre de lignes réellement insérées
    } catch (error) {
      console.error("Erreur lors de l'insertion multiple :", error);
      return 0;
    }
  }
  // ===================================================================

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

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Job;
