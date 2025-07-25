const db = require('../config/db');

class Job {
  static async create(jobData) {
    const { title, company, location, country, description, source, url, posted_at } = jobData;
    const query = `
      INSERT INTO jobs (title, company, location, country, description, source, url, posted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (url) DO NOTHING;
    `;
    const values = [title, company, location, country, description, source, url, posted_at];
    await db.query(query, values);
  }

  static async getAll(params = {}) {
    let baseQuery = 'SELECT * FROM jobs';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (params.country) {
      conditions.push(`country = $${paramIndex++}`);
      values.push(params.country);
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
