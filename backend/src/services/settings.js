import { query } from '../config/db.js';

export async function getSetting(key, fallback = true) {
  const [row] = await query('SELECT value FROM app_settings WHERE key = $1', [key]);
  if (!row) return fallback;
  return row.value === 'true';
}

export async function requireFeatureEnabled(key) {
  const enabled = await getSetting(key, true);
  if (!enabled) {
    const error = new Error('Feature disabled by admin');
    error.statusCode = 403;
    throw error;
  }
}
