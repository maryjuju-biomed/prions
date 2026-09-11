import { query } from '../config/db.js';

const PLAN_LIMITS = {
  free: 10,
  basic: 200,
  premium: 800,
  pro: 2500
};

export async function ensureCreditBalance(userId, requestedCount) {
  const [user] = await query('SELECT id, plan, credits_remaining, last_credit_reset FROM users WHERE id = $1', [userId]);
  if (!user) throw new Error('User not found');

  const today = new Date().toISOString().slice(0, 10);
  const resetDay = user.last_credit_reset?.toISOString?.().slice(0, 10);

  if (user.plan === 'free' && resetDay !== today) {
    const limit = PLAN_LIMITS.free;
    await query('UPDATE users SET credits_remaining = $1, last_credit_reset = NOW() WHERE id = $2', [limit, userId]);
    user.credits_remaining = limit;
  }

  if (user.credits_remaining < requestedCount) {
    throw new Error('Insufficient credits');
  }

  await query('UPDATE users SET credits_remaining = credits_remaining - $1 WHERE id = $2', [requestedCount, userId]);
}

export async function updatePlanCredits(userId, plan) {
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  await query('UPDATE users SET plan = $1, credits_remaining = $2, last_credit_reset = NOW() WHERE id = $3', [plan, limit, userId]);
}
