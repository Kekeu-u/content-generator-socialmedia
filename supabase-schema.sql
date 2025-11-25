-- ============================================
-- CONTENT GENERATOR - SUPABASE SCHEMA
-- ============================================
-- Schema para geração de conteúdo para redes sociais
-- Integrado com Gemini API (texto e imagem)

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: profiles
-- ============================================
-- Estende a tabela auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TABELA: social_media_posts
-- ============================================
-- Armazena posts gerados para redes sociais
CREATE TABLE IF NOT EXISTS public.social_media_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok')) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')) NOT NULL,
  hashtags TEXT[], -- Array de hashtags
  prompt_used TEXT, -- Prompt usado para gerar o conteúdo
  model_used TEXT DEFAULT 'gemini-2.5-flash', -- Modelo usado
  generation_metadata JSONB, -- Metadados da geração
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_posts_user_id ON public.social_media_posts(user_id);
CREATE INDEX idx_posts_platform ON public.social_media_posts(platform);
CREATE INDEX idx_posts_status ON public.social_media_posts(status);
CREATE INDEX idx_posts_created_at ON public.social_media_posts(created_at DESC);

-- RLS para posts
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
  ON public.social_media_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts"
  ON public.social_media_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.social_media_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.social_media_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABELA: generated_images
-- ============================================
-- Armazena imagens geradas pelo Gemini
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.social_media_posts(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL, -- URL da imagem gerada
  storage_path TEXT, -- Caminho no Supabase Storage
  width INTEGER,
  height INTEGER,
  model_used TEXT DEFAULT 'gemini-2.5-flash', -- Modelo usado
  generation_metadata JSONB, -- Metadados da geração
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_images_user_id ON public.generated_images(user_id);
CREATE INDEX idx_images_post_id ON public.generated_images(post_id);
CREATE INDEX idx_images_created_at ON public.generated_images(created_at DESC);

-- RLS para imagens
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own images"
  ON public.generated_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own images"
  ON public.generated_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.generated_images FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABELA: prompts_library
-- ============================================
-- Biblioteca de prompts salvos e reutilizáveis
CREATE TABLE IF NOT EXISTS public.prompts_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  category TEXT, -- categoria do prompt
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[], -- Tags para organização
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_prompts_user_id ON public.prompts_library(user_id);
CREATE INDEX idx_prompts_category ON public.prompts_library(category);
CREATE INDEX idx_prompts_is_favorite ON public.prompts_library(is_favorite);

-- RLS para prompts
ALTER TABLE public.prompts_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prompts"
  ON public.prompts_library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prompts"
  ON public.prompts_library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
  ON public.prompts_library FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
  ON public.prompts_library FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABELA: generation_history
-- ============================================
-- Histórico completo de todas as gerações
CREATE TABLE IF NOT EXISTS public.generation_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  generation_type TEXT CHECK (generation_type IN ('text', 'image')) NOT NULL,
  prompt TEXT NOT NULL,
  result TEXT, -- Resultado da geração (texto ou URL da imagem)
  model_used TEXT NOT NULL,
  tokens_used INTEGER, -- Tokens consumidos (para texto)
  generation_time_ms INTEGER, -- Tempo de geração em ms
  cost DECIMAL(10, 4), -- Custo estimado
  metadata JSONB, -- Metadados adicionais
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_history_user_id ON public.generation_history(user_id);
CREATE INDEX idx_history_type ON public.generation_history(generation_type);
CREATE INDEX idx_history_created_at ON public.generation_history(created_at DESC);

-- RLS para histórico
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history"
  ON public.generation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own history"
  ON public.generation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TABELA: usage_statistics
-- ============================================
-- Estatísticas de uso por usuário
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

-- Índices
CREATE INDEX idx_stats_user_id ON public.usage_statistics(user_id);
CREATE INDEX idx_stats_date ON public.usage_statistics(date DESC);

-- RLS para estatísticas
ALTER TABLE public.usage_statistics ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.social_media_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Criar bucket para imagens geradas (executar no dashboard do Supabase)
-- insert into storage.buckets (id, name, public) values ('generated-images', 'generated-images', true);

-- Política de storage para imagens
-- CREATE POLICY "Users can upload their own images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view all images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'generated-images');

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View para estatísticas do usuário
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
-- DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir categorias de prompts padrão
-- INSERT INTO public.prompts_library (user_id, title, prompt_text, category, tags)
-- VALUES
--   (auth.uid(), 'Post Motivacional', 'Crie um post motivacional sobre...', 'motivacional', ARRAY['motivação', 'inspiração']),
--   (auth.uid(), 'Descrição de Produto', 'Escreva uma descrição envolvente para...', 'produto', ARRAY['vendas', 'marketing']);

-- ============================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================

COMMENT ON TABLE public.profiles IS 'Perfis de usuários estendendo auth.users';
COMMENT ON TABLE public.social_media_posts IS 'Posts gerados para redes sociais';
COMMENT ON TABLE public.generated_images IS 'Imagens geradas pela IA';
COMMENT ON TABLE public.prompts_library IS 'Biblioteca de prompts salvos';
COMMENT ON TABLE public.generation_history IS 'Histórico completo de gerações';
COMMENT ON TABLE public.usage_statistics IS 'Estatísticas de uso por usuário';
