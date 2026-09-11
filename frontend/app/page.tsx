import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold text-neon">Maya AI Studio</h1>
      <p className="text-gray-300 mt-3">Gere imagens com IA e administre créditos, recursos e usuários no painel administrativo.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="px-4 py-2 rounded bg-neon text-black font-semibold" href="/auth/login">Entrar</Link>
        <Link className="px-4 py-2 rounded border border-neon" href="/auth/register">Criar conta</Link>
        <Link className="px-4 py-2 rounded border border-purple-600" href="/dashboard">Ir para Dashboard</Link>
        <Link className="px-4 py-2 rounded border border-purple-600" href="/admin">Painel Admin</Link>
      </div>
    </main>
  );
}
