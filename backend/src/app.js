import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import generationRoutes from './routes/generation.js';
import characterRoutes from './routes/characters.js';
import galleryRoutes from './routes/gallery.js';
import adminRoutes from './routes/admin.js';
import planRoutes from './routes/plans.js';
import { env } from './config/env.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/generate', generationRoutes);
  app.use('/api/characters', characterRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/plans', planRoutes);
  app.use('/api/admin', adminRoutes);
  app.use((error, _req, res, _next) => {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message || 'Internal server error' });
  });

  return app;
}
