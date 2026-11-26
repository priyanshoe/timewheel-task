import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import { initDb, pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT || '3030', 10);

app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

// Employee search endpoint
app.get('/api/employees/search', async (req, res) => {
  const query = req.query.q;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Search query cannot be empty.',
      data: [],
    });
  }

  try {
    const trimmed = query.trim();
    const term = `%${trimmed}%`;
    const isNum = /^\d+$/.test(trimmed);

    // Short numbers (1-3 digits) target employee ID rather than matching arbitrary DOB digits
    const searchDob = !isNum || trimmed.length >= 4;

    const conditions = [
      'name LIKE ?',
      'email LIKE ?',
      'department LIKE ?',
      'position LIKE ?',
    ];
    const params = [term, term, term, term];

    if (searchDob) {
      conditions.push("DATE_FORMAT(dob, '%Y-%m-%d') LIKE ?");
      params.push(term);
    }

    if (isNum) {
      conditions.push('id = ?');
      params.push(Number.parseInt(trimmed, 10));
    }

    const sql = `
      SELECT
        id,
        name,
        email,
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
        department,
        position
      FROM employees
      WHERE ${conditions.join(' OR ')}
      ORDER BY id ASC
    `;

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Employees fetched successfully',
      data: rows,
    });
  } catch (error) {
    console.error('[server] Error searching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search employees due to a database error.',
      data: [],
    });
  }
});

async function startServer() {
  try {
    console.log('[server] Initializing database and data seeding...');
    await initDb();
    console.log('[server] Database initialization complete.');

    app.listen(port, '0.0.0.0', () => {
      console.log(`[server] Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('[server] Database initialization failed. Server will not start:');
    console.error(error);
    process.exit(1);
  }
}

startServer();
