import { randomUUID } from 'crypto';

export async function uploadBase64Image(base64Image) {
  const id = randomUUID();
  return {
    key: `generated/${id}.png`,
    url: `data:image/png;base64,${base64Image}`
  };
}
