'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);

  const load = async () => setImages(await api('/api/gallery'));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await api(`/api/gallery/${id}`, { method: 'DELETE' });
    load();
  };

  const favorite = async (id: string) => {
    await api(`/api/gallery/${id}/favorite`, { method: 'PATCH' });
    load();
  };

  return <div className="p-6"><h2 className="text-2xl mb-4">Gallery</h2><div className="grid md:grid-cols-4 gap-4">{images.map((img) => <div className="card" key={img.id}><img src={img.image_url} alt="Generated" className="rounded" /><div className="flex gap-2 mt-2"><a className="text-xs underline" href={img.image_url} download>Download</a><button className="text-xs" onClick={() => favorite(img.id)}>{img.is_favorite ? '★' : '☆'}</button><button className="text-xs text-red-400" onClick={() => remove(img.id)}>Delete</button></div></div>)}</div></div>;
}
