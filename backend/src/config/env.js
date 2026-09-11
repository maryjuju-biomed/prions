import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  pgUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/maya',
  stableDiffusionUrl: process.env.STABLE_DIFFUSION_API_URL || 'http://host.docker.internal:7860',
  stableDiffusionApiKey: process.env.STABLE_DIFFUSION_API_KEY || '',
  s3Endpoint: process.env.S3_ENDPOINT || '',
  s3Bucket: process.env.S3_BUCKET || '',
  s3AccessKey: process.env.S3_ACCESS_KEY || '',
  s3SecretKey: process.env.S3_SECRET_KEY || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@maya.local'
};
