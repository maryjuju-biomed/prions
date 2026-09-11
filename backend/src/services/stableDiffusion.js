import { env } from '../config/env.js';

export async function generateWithStableDiffusion(payload) {
  const response = await fetch(`${env.stableDiffusionUrl}/sdapi/v1/txt2img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env.stableDiffusionApiKey ? { Authorization: `Bearer ${env.stableDiffusionApiKey}` } : {})
    },
    body: JSON.stringify({
      prompt: payload.prompt,
      negative_prompt: payload.negativePrompt,
      width: payload.width,
      height: payload.height,
      sampler_name: payload.sampler,
      steps: payload.steps,
      cfg_scale: payload.cfgScale,
      seed: payload.seed,
      batch_size: payload.count
    })
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Stable Diffusion error: ${msg}`);
  }

  const data = await response.json();
  return data.images || [];
}
