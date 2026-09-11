'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('token', data.token);
    router.push('/dashboard');
  };

  return <div className="max-w-md mx-auto mt-20 card space-y-3"><h2 className="text-xl">Login</h2><input className="w-full p-2 bg-black/30" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input type="password" className="w-full p-2 bg-black/30" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={submit} className="w-full p-2 bg-neon text-black">Sign in</button></div>;
}
