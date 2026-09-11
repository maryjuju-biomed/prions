'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type User = {
  id: string;
  email: string;
  role: string;
  plan: 'free' | 'basic' | 'premium' | 'pro';
  credits_remaining: number;
};

type Setting = {
  key: string;
  value: string;
  description: string;
  enabled: boolean;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>({});
  const [settings, setSettings] = useState<Setting[]>([]);
  const [creditAmount, setCreditAmount] = useState<Record<string, number>>({});

  const load = async () => {
    const [usersData, statsData, settingsData] = await Promise.all([
      api('/api/admin/users'),
      api('/api/admin/stats'),
      api('/api/admin/settings')
    ]);
    setUsers(usersData);
    setStats(statsData);
    setSettings(settingsData);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSetting = async (key: string, enabled: boolean) => {
    await api(`/api/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled: !enabled })
    });
    load();
  };

  const addCredits = async (userId: string) => {
    const amount = creditAmount[userId] || 0;
    await api(`/api/admin/users/${userId}/credits/add`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    setCreditAmount((prev) => ({ ...prev, [userId]: 0 }));
    load();
  };

  const changePlan = async (userId: string, plan: User['plan']) => {
    await api(`/api/admin/users/${userId}/plan`, {
      method: 'PATCH',
      body: JSON.stringify({ plan })
    });
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl">Painel Administrativo</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">Usuários: {stats.users || 0}</div>
        <div className="card">Imagens: {stats.images || 0}</div>
        <div className="card">Gerações: {stats.generations || 0}</div>
      </div>

      <section className="card">
        <h2 className="text-lg mb-3">Funcionalidades do App</h2>
        <div className="space-y-2">
          {settings.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-2 border border-purple-900 rounded">
              <div>
                <p className="font-medium">{setting.key}</p>
                <p className="text-xs text-gray-400">{setting.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(setting.key, setting.enabled)}
                className={`px-3 py-1 rounded ${setting.enabled ? 'bg-green-600' : 'bg-red-600'}`}
              >
                {setting.enabled ? 'Ativo' : 'Desativado'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2">Usuários, planos e créditos</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left">
                <th>Email</th>
                <th>Role</th>
                <th>Plano</th>
                <th>Créditos</th>
                <th>Gerar créditos</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-purple-900/50">
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      className="bg-black/30 p-1"
                      value={user.plan}
                      onChange={(e) => changePlan(user.id, e.target.value as User['plan'])}
                    >
                      {['free', 'basic', 'premium', 'pro'].map((plan) => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </td>
                  <td>{user.credits_remaining}</td>
                  <td>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        value={creditAmount[user.id] || ''}
                        onChange={(e) => setCreditAmount((prev) => ({ ...prev, [user.id]: Number(e.target.value) }))}
                        className="bg-black/30 p-1 w-24"
                        placeholder="Qtd"
                      />
                      <button onClick={() => addCredits(user.id)} className="bg-neon text-black px-3 rounded">Adicionar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
