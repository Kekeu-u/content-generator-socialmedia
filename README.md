# Content Generator - Aplicação Web Escalável

Plataforma moderna e escalável para geração de conteúdo para redes sociais, construída com as melhores práticas e tecnologias mais recentes do ecossistema React.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript (Strict Mode)
- **Estilização:** Tailwind CSS 4
- **Fontes:** next/font (Google Fonts - Inter)
- **Node:** >= 18.x

## ✨ Características Principais

- ✅ **Server Components** - Renderização otimizada no servidor por padrão
- ✅ **Client Components** - Interatividade apenas onde necessário
- ✅ **TypeScript Strict** - Type safety completo com `noImplicitAny`
- ✅ **SEO Otimizado** - Metadados configurados para máxima visibilidade
- ✅ **Performance** - React Suspense e loading states para UX superior
- ✅ **Error Handling** - Error boundaries customizados em todas as rotas
- ✅ **API Routes** - Backend for Frontend com Route Handlers
- ✅ **Design System** - Componentes UI reutilizáveis e consistentes
- ✅ **Custom Hooks** - useDebounce, useAuth e mais
- ✅ **Responsividade** - Mobile-first design

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

## 🏃 Como Executar

### Pré-requisitos

- Node.js >= 18.x
- npm ou yarn

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

### Endpoints disponíveis:

#### Produtos
- `GET /api/products` - Listar produtos (paginado)
- `POST /api/products` - Criar produto
- `GET /api/products/[id]` - Buscar produto por ID
- `PUT /api/products/[id]` - Atualizar produto
- `DELETE /api/products/[id]` - Deletar produto

#### Autenticação
- `POST /api/auth/login` - Login de usuário

### Exemplo de requisição:

```typescript
const response = await fetch('/api/products?page=1&pageSize=10');
const data = await response.json();
```

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
