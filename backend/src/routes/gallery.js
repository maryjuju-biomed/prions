import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { query } from '../config/db.js';
import { requireFeatureEnabled } from '../services/settings.js';

const router = Router();
router.use(authRequired);

router.use(async (_req, _res, next) => {
  try {
    await requireFeatureEnabled('feature_gallery');
    return next();
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res) => {
  const rows = await query('SELECT * FROM images WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

router.patch('/:id/favorite', async (req, res) => {
  const [row] = await query(
    'UPDATE images SET is_favorite = NOT is_favorite WHERE id = $1 AND user_id = $2 RETURNING *',
    [req.params.id, req.user.id]
  );
  if (!row) return res.status(404).json({ error: 'Not found' });
  return res.json(row);
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM images WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.status(204).end();
});

export default router;
