-- ============================================
-- CONTENT GENERATOR - SUPABASE SCHEMA COMPLETO
-- ============================================
-- Execute este script completo no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query > Cole e Execute

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: social_media_posts
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_media_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok')) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')) NOT NULL,
  hashtags TEXT[],
  prompt_used TEXT,
  model_used TEXT DEFAULT 'gemini-2.5-flash',
  generation_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: generated_images
-- ============================================
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.social_media_posts(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  width INTEGER,
  height INTEGER,
  model_used TEXT DEFAULT 'gemini-2.5-flash',
  generation_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: prompts_library
-- ============================================
CREATE TABLE IF NOT EXISTS public.prompts_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  category TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: generation_history
-- ============================================
CREATE TABLE IF NOT EXISTS public.generation_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  generation_type TEXT CHECK (generation_type IN ('text', 'image')) NOT NULL,
  prompt TEXT NOT NULL,
  result TEXT,
  model_used TEXT NOT NULL,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  cost DECIMAL(10, 4),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: usage_statistics
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  text_generations_count INTEGER DEFAULT 0,
  image_generations_count INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.social_media_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON public.social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.social_media_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_images_user_id ON public.generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_post_id ON public.generated_images(post_id);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON public.generated_images(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts_library(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts_library(category);
CREATE INDEX IF NOT EXISTS idx_prompts_is_favorite ON public.prompts_library(is_favorite);

CREATE INDEX IF NOT EXISTS idx_history_user_id ON public.generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_type ON public.generation_history(generation_type);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON public.generation_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stats_user_id ON public.usage_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_stats_date ON public.usage_statistics(date DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_statistics ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para social_media_posts
DROP POLICY IF EXISTS "Users can view their own posts" ON public.social_media_posts;
CREATE POLICY "Users can view their own posts"
  ON public.social_media_posts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own posts" ON public.social_media_posts;
CREATE POLICY "Users can create their own posts"
  ON public.social_media_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.social_media_posts;
CREATE POLICY "Users can update their own posts"
  ON public.social_media_posts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.social_media_posts;
CREATE POLICY "Users can delete their own posts"
  ON public.social_media_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para generated_images
DROP POLICY IF EXISTS "Users can view their own images" ON public.generated_images;
CREATE POLICY "Users can view their own images"
  ON public.generated_images FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own images" ON public.generated_images;
CREATE POLICY "Users can create their own images"
  ON public.generated_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own images" ON public.generated_images;
CREATE POLICY "Users can delete their own images"
  ON public.generated_images FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para prompts_library
DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts_library;
CREATE POLICY "Users can view their own prompts"
  ON public.prompts_library FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own prompts" ON public.prompts_library;
CREATE POLICY "Users can create their own prompts"
  ON public.prompts_library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts_library;
CREATE POLICY "Users can update their own prompts"
  ON public.prompts_library FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts_library;
CREATE POLICY "Users can delete their own prompts"
  ON public.prompts_library FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para generation_history
DROP POLICY IF EXISTS "Users can view their own history" ON public.generation_history;
CREATE POLICY "Users can view their own history"
  ON public.generation_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own history" ON public.generation_history;
CREATE POLICY "Users can create their own history"
  ON public.generation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para usage_statistics
DROP POLICY IF EXISTS "Users can view their own statistics" ON public.usage_statistics;
CREATE POLICY "Users can view their own statistics"
  ON public.usage_statistics FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.social_media_posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.social_media_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts_library;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stats_updated_at ON public.usage_statistics;
CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON public.usage_statistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar profile automaticamente quando user é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar profile automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS
-- ============================================

-- View para estatísticas do usuário (SEM SECURITY DEFINER)
DROP VIEW IF EXISTS user_stats_summary;
CREATE OR REPLACE VIEW user_stats_summary AS
SELECT
  u.id,
  u.email,
  u.full_name,
  COUNT(DISTINCT p.id) as total_posts,
  COUNT(DISTINCT i.id) as total_images,
  COALESCE(SUM(s.text_generations_count), 0) as total_text_generations,
  COALESCE(SUM(s.image_generations_count), 0) as total_image_generations,
  COALESCE(SUM(s.total_cost), 0) as total_spent
FROM public.profiles u
LEFT JOIN public.social_media_posts p ON u.id = p.user_id
LEFT JOIN public.generated_images i ON u.id = i.user_id
LEFT JOIN public.usage_statistics s ON u.id = s.user_id
GROUP BY u.id, u.email, u.full_name;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE public.profiles IS 'Perfis de usuários estendendo auth.users';
COMMENT ON TABLE public.social_media_posts IS 'Posts gerados para redes sociais';
COMMENT ON TABLE public.generated_images IS 'Imagens geradas pela IA';
COMMENT ON TABLE public.prompts_library IS 'Biblioteca de prompts salvos';
COMMENT ON TABLE public.generation_history IS 'Histórico completo de gerações';
COMMENT ON TABLE public.usage_statistics IS 'Estatísticas de uso por usuário';
