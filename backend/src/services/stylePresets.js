export const STYLE_PRESETS = {
  realistic: { suffix: 'photorealistic, detailed skin, high detail', sampler: 'DPM++ 2M', steps: 30, cfgScale: 7 },
  anime: { suffix: 'anime style, cel shading, clean line art', sampler: 'Euler a', steps: 28, cfgScale: 8 },
  fantasy: { suffix: 'fantasy concept art, magical atmosphere', sampler: 'DPM++ SDE', steps: 32, cfgScale: 7 },
  cinematic: { suffix: 'cinematic lighting, film grain, dramatic composition', sampler: 'DPM++ 2M Karras', steps: 34, cfgScale: 6.5 },
  portrait: { suffix: 'studio portrait, softbox lighting, high sharpness', sampler: 'DPM++ 2M', steps: 26, cfgScale: 7 },
  illustration: { suffix: 'digital illustration, polished details, stylized', sampler: 'Euler', steps: 24, cfgScale: 8 },
  waifu: { suffix: 'vibrant anime portrait, expressive eyes', sampler: 'Euler a', steps: 28, cfgScale: 8.5 }
};

export function applyPreset(prompt, params, presetKey) {
  const preset = STYLE_PRESETS[presetKey];
  if (!preset) return { prompt, params };

  return {
    prompt: `${prompt}, ${preset.suffix}`,
    params: {
      ...params,
      sampler: params.sampler || preset.sampler,
      steps: params.steps || preset.steps,
      cfgScale: params.cfgScale || preset.cfgScale
    }
  };
}
