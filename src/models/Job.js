const db = require('../config/db');

class Job {
  static async getAll(params = {}) {
    console.log('[Backend Job.js] Réception de la requête avec les filtres :', params);
    let baseQuery = 'SELECT id, title, company, location, country, url, created_at FROM jobs';
    const values = [];
    const conditions = [];
    let paramIndex = 1;

    if (params.query) {
      conditions.push(`title ILIKE $${paramIndex++}`);
      values.push(`%${params.query}%`);
    }
    if (params.country) {
      conditions.push(`country ILIKE $${paramIndex++}`);
      values.push(`%${params.country}%`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    baseQuery += ' ORDER BY created_at DESC LIMIT 50';

    console.log('[Backend Job.js] Exécution de la requête SQL :', baseQuery);
    console.log('[Backend Job.js] Avec les valeurs :', values);

    try {
      const { rows } = await db.query(baseQuery, values);
      console.log(`[Backend Job.js] ${rows.length} offres trouvées dans la base de données.`);
      return rows;
    } catch (error) {
      console.error("[Backend Job.js] ERREUR LORS DE L'EXECUTION DE LA REQUETE :", error);
      return [];
    }
  }

  static async findById(id) {
    console.log('[Backend Job.js] Recherche de l\'offre avec l\'ID :', id);
    const query = 'SELECT * FROM jobs WHERE id = $1';
    
    try {
      const { rows } = await db.query(query, [id]);
      console.log(`[Backend Job.js] Résultat de la recherche :`, rows.length > 0 ? 'Offre trouvée' : 'Aucune offre trouvée');
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("[Backend Job.js] ERREUR LORS DE LA RECHERCHE PAR ID :", error);
      throw error;
    }
  }

  static async insertMany(jobs) {
    console.log('[Backend Job.js] Insertion de', jobs.length, 'offres dans la base de données');
    
    if (jobs.length === 0) {
      console.log('[Backend Job.js] Aucune offre à insérer');
      return;
    }

    const query = `
      INSERT INTO jobs (id, title, company, location, country, url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO NOTHING
    `;

    try {
      for (const job of jobs) {
        await db.query(query, [
          job.id,
          job.title,
          job.company,
          job.location,
          job.country,
          job.url,
          job.created_at || new Date()
        ]);
      }
      console.log('[Backend Job.js] Insertion terminée avec succès');
    } catch (error) {
      console.error("[Backend Job.js] ERREUR LORS DE L'INSERTION :", error);
      throw error;
    }
  }
}

module.exports = Job;
