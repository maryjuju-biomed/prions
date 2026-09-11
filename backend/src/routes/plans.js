import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { updatePlanCredits } from '../services/credits.js';

const router = Router();
router.use(authRequired);

router.post('/change', async (req, res) => {
  const { plan } = req.body;
  if (!['free', 'basic', 'premium', 'pro'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }
  await updatePlanCredits(req.user.id, plan);
  return res.json({ ok: true, plan });
});

export default router;
