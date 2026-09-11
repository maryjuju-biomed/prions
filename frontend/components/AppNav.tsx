'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/gallery', label: 'Galeria' },
  { href: '/characters', label: 'Personagens' },
  { href: '/admin', label: 'Admin' }
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className="border-b border-purple-900/60 bg-card/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-4 items-center justify-between">
        <Link href="/" className="font-bold text-neon">Maya AI</Link>
        <nav className="flex gap-2 flex-wrap">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded ${pathname === link.href ? 'bg-neon text-black' : 'bg-black/30 hover:bg-black/50'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="px-3 py-1 rounded border border-purple-700 text-sm">Sair</button>
      </div>
    </header>
  );
}
