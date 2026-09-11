import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const role = email.toLowerCase() === env.adminEmail.toLowerCase() ? 'admin' : 'user';

  try {
    const [user] = await query(
      'INSERT INTO users (email, password_hash, role, plan, credits_remaining) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, plan, credits_remaining',
      [email, hash, role, 'free', 10]
    );
    return res.status(201).json(user);
  } catch {
    return res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [user] = await query('SELECT id, email, role, password_hash, plan, credits_remaining FROM users WHERE email = $1', [email]);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role, plan: user.plan, creditsRemaining: user.credits_remaining } });
});

export default router;
