# Content Generator - Aplicação Web Escalável

Plataforma moderna e escalável para geração de conteúdo para redes sociais, construída com as melhores práticas e tecnologias mais recentes do ecossistema React.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript (Strict Mode)
- **Estilização:** Tailwind CSS 4
- **Fontes:** next/font (Google Fonts - Inter)
- **Banco de Dados:** Supabase (PostgreSQL)
- **IA:** Google Gemini 2.5 Flash (Texto e Visão)
- **Node:** >= 18.x

## ✨ Características Principais

### Arquitetura e Performance
- ✅ **Server Components** - Renderização otimizada no servidor por padrão
- ✅ **Client Components** - Interatividade apenas onde necessário
- ✅ **TypeScript Strict** - Type safety completo com `noImplicitAny`
- ✅ **SEO Otimizado** - Metadados configurados para máxima visibilidade
- ✅ **Performance** - React Suspense e loading states para UX superior
- ✅ **Error Handling** - Error boundaries customizados em todas as rotas

### IA e Geração de Conteúdo
- 🤖 **Geração de Texto com IA** - Gemini 2.5 Flash para posts em redes sociais
- 🎯 **Otimizado por Plataforma** - Conteúdo adaptado para Instagram, Facebook, Twitter, LinkedIn e TikTok
- 📝 **Múltiplos Tons** - Profissional, casual, engraçado ou inspiracional
- 🏷️ **Hashtags Inteligentes** - Geração automática de hashtags relevantes
- 🎨 **Análise de Imagens** - Visão computacional para análise e sugestões

### Backend e Banco de Dados
- 💾 **Supabase** - PostgreSQL com Row Level Security (RLS)
- 📊 **Histórico de Gerações** - Rastreamento completo de uso de IA
- 📈 **Estatísticas de Uso** - Métricas detalhadas por usuário
- 🔐 **Autenticação** - Sistema de auth integrado

### UI/UX
- 🎨 **Design System** - Componentes UI reutilizáveis e consistentes
- 🪝 **Custom Hooks** - useDebounce, useAuth e mais
- 📱 **Responsividade** - Mobile-first design
- 🌐 **API Routes** - Backend for Frontend com Route Handlers

## 📁 Estrutura do Projeto

```
/src
  /app                 # Rotas da aplicação (App Router)
    /layout.tsx        # Root Layout
    /page.tsx          # Home Page
    /dashboard         # Rota protegida do Dashboard
      /layout.tsx      # Layout com Sidebar + Header
      /page.tsx        # Página do Dashboard
    /products          # Listagem de produtos
      /page.tsx        # Server Component com fetch
      /loading.tsx     # Loading state
      /error.tsx       # Error boundary
    /api               # Route Handlers (BFF)
      /products        # CRUD de produtos
      /auth            # Autenticação
    /error.tsx         # Error boundary global
    /not-found.tsx     # 404 customizado
  /components
    /ui                # Design System (Button, Card, Input)
    /features          # Componentes de negócio (ProductGrid, Sidebar, Header)
  /lib                 # Utilitários (SEO config)
  /hooks               # Custom Hooks
  /types               # Definições TypeScript globais
  /services            # Lógica de API
```

## ⚙️ Configuração

### 1. Configurar Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o schema SQL do arquivo `supabase-schema.sql` no SQL Editor do Supabase
4. Copie as credenciais do projeto:
   - URL do projeto
   - Anon/Public Key
   - Service Role Key (apenas para servidor)

### 2. Configurar Gemini API

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma API Key gratuita
3. Copie a chave gerada

### 3. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha as variáveis de ambiente:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Gemini AI
GEMINI_API_KEY=sua_gemini_api_key_aqui
GEMINI_TEXT_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=gemini-2.5-flash

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃 Como Executar

### Pré-requisitos

- Node.js >= 18.x
- npm ou yarn
- Conta Supabase configurada
- Gemini API Key

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Lint
npm run lint
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🎨 Design System

Componentes UI reutilizáveis localizados em `/src/components/ui`:

- **Button** - Variantes: primary, secondary, outline, ghost
- **Card** - Componente modular com Header, Content, Footer
- **Input** - Input controlado com validação e estados de erro

### Exemplo de uso:

```tsx
import { Button, Card, CardHeader, CardTitle } from "@/components/ui";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
      </CardHeader>
      <Button variant="primary">Clique aqui</Button>
    </Card>
  );
}
```

## 🔌 API Routes

### Geração de Conteúdo com IA

#### Geração de Texto
- `POST /api/generate/text` - Gera texto usando Gemini 2.5 Flash

**Parâmetros:**
```typescript
{
  prompt: string;              // Tópico ou assunto
  type?: "general" | "social-media" | "variations" | "improve";
  platform?: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
  tone?: "professional" | "casual" | "funny" | "inspirational";
  targetAudience?: string;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  variationsCount?: number;
  userId?: string;            // Para rastreamento
}
```

**Exemplo:**
```typescript
const response = await fetch('/api/generate/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Lançamento de produto inovador',
    type: 'social-media',
    platform: 'instagram',
    tone: 'professional',
    includeHashtags: true,
    includeEmojis: true
  })
});

const data = await response.json();
// { success: true, data: { content: "...", hashtags: ["#inovacao", ...] } }
```

#### Análise de Imagem
- `POST /api/analyze/image` - Analisa imagem usando Gemini 2.5 Flash (visão)

**Parâmetros:**
```typescript
{
  imageData: string;  // Base64 da imagem
  prompt?: string;    // Pergunta específica sobre a imagem
  userId?: string;
}
```

**Exemplo:**
```typescript
const response = await fetch('/api/analyze/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    prompt: 'Crie uma legenda atraente para Instagram'
  })
});
```

### Produtos (Exemplo)
- `GET /api/products` - Listar produtos (paginado)
- `POST /api/products` - Criar produto
- `GET /api/products/[id]` - Buscar produto por ID
- `PUT /api/products/[id]` - Atualizar produto
- `DELETE /api/products/[id]` - Deletar produto

### Autenticação
- `POST /api/auth/login` - Login de usuário

## 🪝 Custom Hooks

### useDebounce

Otimiza chamadas de API em campos de busca:

```tsx
import { useDebounce } from "@/hooks";

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchSearchResults(debouncedSearch);
  }
}, [debouncedSearch]);
```

### useAuth

Gerenciamento centralizado de autenticação:

```tsx
import { useAuth } from "@/hooks";

const { user, isAuthenticated, login, logout } = useAuth();

if (!isAuthenticated) {
  return <LoginForm onLogin={login} />;
}
```

## 🎯 Boas Práticas Implementadas

### Renderização
- Server Components por padrão
- Client Components apenas nas "folhas" da árvore
- Uso de `'use client'` apenas quando necessário

### Fetch de Dados
- Fetch API nativa do Next.js
- Cache configurado por rota: `force-cache`, `no-store`, `revalidate`
- ISR (Incremental Static Regeneration) para dados semi-estáticos

### Gerenciamento de Estado
- URL Search Params para filtros e paginação
- Client state apenas quando necessário
- Evita prop drilling com composição

### Performance
- next/font para evitar CLS
- next/image para otimização de imagens
- React Suspense para loading states
- Code splitting automático

### Type Safety
- TypeScript Strict Mode
- `noImplicitAny` habilitado
- Interfaces para todas as props e API responses
- Sem uso de `any`

### SEO
- Metadados configurados em todos os layouts e páginas
- Open Graph e Twitter Cards
- Robots meta tags
- Sitemap (adicionar em produção)

## 🚢 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Outras plataformas

A aplicação pode ser deployada em qualquer plataforma que suporte Node.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Roadmap

- [ ] Adicionar autenticação real (NextAuth.js)
- [ ] Implementar banco de dados (Prisma + PostgreSQL)
- [ ] Adicionar testes (Jest + React Testing Library)
- [ ] Implementar CI/CD
- [ ] Adicionar Storybook para Design System
- [ ] Implementar i18n (internacionalização)
- [ ] Adicionar analytics (Google Analytics / Plausible)
- [ ] PWA support

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

Desenvolvido com ❤️ usando Next.js 16, TypeScript e Tailwind CSS
