'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { connectSocket } from '@/lib/socket';

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality');
  const [stylePreset, setStylePreset] = useState('realistic');
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState('idle');
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return undefined;
    const socket = connectSocket(token);
    socket.on('generation:status', (evt) => setStatus(evt.status));
    socket.on('generation:done', (evt) => {
      setStatus('done');
      setImages(evt.images);
    });
    socket.on('generation:error', () => setStatus('error'));
    return () => {
      socket.disconnect();
    };
  }, []);

  const generate = async () => {
    await api('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, negativePrompt, count, stylePreset, width: 768, height: 1024, steps: 28, cfgScale: 7 })
    });
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <div className="card space-y-3">
        <h2 className="text-2xl">Prompt Studio</h2>
        <textarea className="w-full p-3 bg-black/30 h-32" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your scene..." />
        <textarea className="w-full p-3 bg-black/30 h-20" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Negative prompt" />
        <select className="w-full p-2 bg-black/40" value={stylePreset} onChange={(e) => setStylePreset(e.target.value)}>
          {['realistic', 'anime', 'fantasy', 'cinematic', 'portrait', 'illustration', 'waifu'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <input type="number" min={1} max={4} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-2 bg-black/30" />
        <button className="w-full bg-neon text-black py-2 font-semibold" onClick={generate}>Generate</button>
        <p className="text-sm text-purple-300">Status: {status}</p>
      </div>
      <div className="card">
        <h3 className="text-xl mb-3">Preview</h3>
        <div className="grid grid-cols-2 gap-2">
          {images.map((img) => <img key={img.id} src={img.image_url} className="rounded" alt="Generated" />)}
        </div>
      </div>
    </div>
  );
}
