CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  plan TEXT NOT NULL DEFAULT 'free',
  credits_remaining INT NOT NULL DEFAULT 10,
  last_credit_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL,
  appearance TEXT,
  body_type TEXT,
  personality TEXT,
  style TEXT,
  base_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  image_url TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  model TEXT NOT NULL,
  content_tag TEXT NOT NULL DEFAULT 'general',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  style_preset TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_settings (key, value, description) VALUES
  ('feature_generation', 'true', 'Permite gerar novas imagens'),
  ('feature_prompt_builder', 'true', 'Permite usar o construtor de prompts'),
  ('feature_character_creator', 'true', 'Permite criar e editar personagens'),
  ('feature_gallery', 'true', 'Permite acessar e gerenciar a galeria')
ON CONFLICT (key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_images_user ON images(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_characters_user ON characters(user_id, created_at DESC);
