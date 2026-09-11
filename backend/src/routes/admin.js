import { Router } from 'express';
import { authRequired, adminRequired } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();
router.use(authRequired, adminRequired);

router.get('/users', async (_req, res) => {
  const rows = await query('SELECT id, email, role, plan, credits_remaining, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

router.get('/stats', async (_req, res) => {
  const [totals] = await query(
    `SELECT
      (SELECT COUNT(*)::int FROM users) AS users,
      (SELECT COUNT(*)::int FROM images) AS images,
      (SELECT COUNT(*)::int FROM generations) AS generations`
  );
  res.json(totals);
});

router.get('/settings', async (_req, res) => {
  const rows = await query('SELECT key, value, description FROM app_settings ORDER BY key ASC');
  res.json(rows.map((row) => ({ ...row, enabled: row.value === 'true' })));
});

router.put('/settings/:key', async (req, res) => {
  const { enabled } = req.body;
  const [row] = await query(
    'UPDATE app_settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING key, value, description',
    [String(Boolean(enabled)), req.params.key]
  );
  if (!row) return res.status(404).json({ error: 'Setting not found' });
  return res.json({ ...row, enabled: row.value === 'true' });
});

router.patch('/users/:id/credits', async (req, res) => {
  const { credits } = req.body;
  const [row] = await query('UPDATE users SET credits_remaining = $1 WHERE id = $2 RETURNING id, email, credits_remaining', [credits, req.params.id]);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json(row);
});

router.post('/users/:id/credits/add', async (req, res) => {
  const amount = Number(req.body.amount || 0);
  if (amount <= 0) return res.status(400).json({ error: 'Amount must be > 0' });

  const [row] = await query(
    'UPDATE users SET credits_remaining = credits_remaining + $1 WHERE id = $2 RETURNING id, email, credits_remaining',
    [amount, req.params.id]
  );
  if (!row) return res.status(404).json({ error: 'User not found' });
  return res.json(row);
});

router.patch('/users/:id/plan', async (req, res) => {
  const { plan } = req.body;
  if (!['free', 'basic', 'premium', 'pro'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }
  const [row] = await query('UPDATE users SET plan = $1 WHERE id = $2 RETURNING id, email, plan', [plan, req.params.id]);
  if (!row) return res.status(404).json({ error: 'User not found' });
  return res.json(row);
});

router.delete('/images/:id', async (req, res) => {
  await query('DELETE FROM images WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

export default router;
