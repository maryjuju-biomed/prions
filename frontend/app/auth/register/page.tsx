'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
    router.push('/auth/login');
  };

  return <div className="max-w-md mx-auto mt-20 card space-y-3"><h2 className="text-xl">Register</h2><input className="w-full p-2 bg-black/30" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input type="password" className="w-full p-2 bg-black/30" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={submit} className="w-full p-2 bg-neon text-black">Create account</button></div>;
}
