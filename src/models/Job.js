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
  // Les autres fonctions (insertMany, findById) restent inchangées
}

module.exports = Job;
