'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', age: 22, appearance: '', bodyType: '', personality: '', style: '', basePrompt: '' });

  const load = async () => setCharacters(await api('/api/characters'));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api('/api/characters', { method: 'POST', body: JSON.stringify(form) });
    await load();
  };

  return <div className="p-6 grid md:grid-cols-2 gap-6"><div className="card space-y-2"><h2 className="text-xl">Create Character</h2>{Object.keys(form).map((k) => <input key={k} className="w-full p-2 bg-black/30" placeholder={k} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: k === 'age' ? Number(e.target.value) : e.target.value })} />)}<button onClick={create} className="bg-neon text-black p-2">Save</button></div><div className="card"><h2 className="text-xl mb-2">Saved Characters</h2><ul className="space-y-2">{characters.map((c) => <li key={c.id} className="border border-purple-900 rounded p-2"><p className="font-semibold">{c.name}</p><p className="text-sm text-gray-400">{c.base_prompt}</p></li>)}</ul></div></div>;
}
