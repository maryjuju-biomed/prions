import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;
export const pool = new Pool({ connectionString: env.pgUrl });

export async function query(text, params = []) {
  const res = await pool.query(text, params);
  return res.rows;
}
