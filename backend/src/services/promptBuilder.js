export function buildPrompt({ bodyType, appearance = {}, scene, mood, extra = '' }) {
  const parts = [
    bodyType,
    appearance.hairColor ? `${appearance.hairColor} hair` : '',
    appearance.eyeColor ? `${appearance.eyeColor} eyes` : '',
    appearance.skinTone ? `${appearance.skinTone} skin tone` : '',
    scene ? `${scene} setting` : '',
    mood,
    extra
  ].filter(Boolean);

  return parts.join(', ');
}
