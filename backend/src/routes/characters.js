import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { query } from '../config/db.js';
import { requireFeatureEnabled } from '../services/settings.js';

const router = Router();
router.use(authRequired);

router.use(async (_req, _res, next) => {
  try {
    await requireFeatureEnabled('feature_character_creator');
    return next();
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res) => {
  const rows = await query('SELECT * FROM characters WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, age, appearance, bodyType, personality, style, basePrompt } = req.body;
  const [row] = await query(
    `INSERT INTO characters (user_id, name, age, appearance, body_type, personality, style, base_prompt)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, name, age, appearance, bodyType, personality, style, basePrompt]
  );
  res.status(201).json(row);
});

export default router;
