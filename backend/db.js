import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbPort = Number.parseInt(process.env.DB_PORT || '3306', 10);
const dbName = process.env.DB_NAME || 'employee_search_db';

export async function initDb() {
  const sqlPath = path.resolve(__dirname, '../database/employee_search_db.sql');
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL seed file not found at: ${sqlPath}`);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Connect to MySQL server without selecting a database first
  const connection = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort,
    multipleStatements: true,
  });

  try {
    console.log(`[db] Executing seed SQL from ${sqlPath}...`);
    await connection.query(sql);
    console.log('[db] SQL script executed successfully.');
  } finally {
    await connection.end();
  }

  // Verify that the table and records are accessible
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM employees');
  const count = rows[0]?.count ?? 0;
  console.log(`[db] Database '${dbName}' ready with ${count} employees.`);
}

export const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
