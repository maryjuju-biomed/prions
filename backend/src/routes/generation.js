import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { authRequired } from '../middleware/auth.js';
import { applyPreset } from '../services/stylePresets.js';
import { buildPrompt } from '../services/promptBuilder.js';
import { enqueue } from '../services/queue.js';
import { ensureCreditBalance } from '../services/credits.js';
import { generateWithStableDiffusion } from '../services/stableDiffusion.js';
import { uploadBase64Image } from '../services/storage.js';
import { query } from '../config/db.js';
import { requireFeatureEnabled } from '../services/settings.js';

const router = Router();

function classifyImage(prompt) {
  if (prompt.includes('anime')) return 'anime';
  if (prompt.includes('cinematic')) return 'cinematic';
  if (prompt.includes('portrait')) return 'portrait';
  return 'general';
}

router.use(authRequired);

router.post('/build-prompt', async (req, res, next) => {
  try {
    await requireFeatureEnabled('feature_prompt_builder');
    const prompt = buildPrompt(req.body);
    return res.json({ prompt });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await requireFeatureEnabled('feature_generation');
  const {
    prompt,
    negativePrompt = '',
    width = 768,
    height = 1024,
    count = 1,
    sampler,
    steps,
    cfgScale,
    seed = -1,
    stylePreset,
    characterId
  } = req.body;

  await ensureCreditBalance(req.user.id, count);

  const [character] = characterId
    ? await query('SELECT * FROM characters WHERE id = $1 AND user_id = $2', [characterId, req.user.id])
    : [null];

  const mergedPrompt = [character?.base_prompt, prompt].filter(Boolean).join(', ');
  const withPreset = applyPreset(mergedPrompt, { sampler, steps, cfgScale }, stylePreset);

  const jobId = uuid();
  res.status(202).json({ jobId });

  const io = req.app.get('io');

  enqueue({
    onStatus: (status) => io.to(req.user.id).emit('generation:status', { jobId, status }),
    onComplete: (images) => io.to(req.user.id).emit('generation:done', { jobId, images }),
    onError: (error) => io.to(req.user.id).emit('generation:error', { jobId, error: error.message }),
    handler: async () => {
      const images = await generateWithStableDiffusion({
        prompt: withPreset.prompt,
        negativePrompt,
        width,
        height,
        count,
        sampler: withPreset.params.sampler,
        steps: withPreset.params.steps,
        cfgScale: withPreset.params.cfgScale,
        seed
      });

      const stored = [];
      for (const base64 of images) {
        const uploaded = await uploadBase64Image(base64);
        const [saved] = await query(
          `INSERT INTO images (user_id, character_id, prompt, negative_prompt, image_url, storage_key, width, height, model, content_tag)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
          [req.user.id, characterId || null, withPreset.prompt, negativePrompt, uploaded.url, uploaded.key, width, height, 'stable-diffusion', classifyImage(withPreset.prompt)]
        );
        stored.push(saved);
      }
      return stored;
    }
  });
  } catch (error) {
    return next(error);
  }
});

export default router;
