# 🚀 Guia de Configuração - Content Generator

## 📋 Variáveis de Ambiente Necessárias

### 1️⃣ Supabase (Obrigatório)

Acesse: https://app.supabase.com/project/_/settings/api

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (diferente da anon!)
```

**Como pegar:**
- Dashboard Supabase → Settings → API
- **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
- **anon/public** = `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** = `SUPABASE_SERVICE_ROLE_KEY` (mostrar chave secreta!)

### 2️⃣ AI API - Perplexity (Recomendado)

Acesse: https://www.perplexity.ai/settings/api

```env
PERPLEXITY_API_KEY=papi.871a0780-87e1-4bf5-b8d4-f9cae94f9be2.bQZ1b6J5aJbwv37iw9D2kAa3fzF09Yq3
```

**Por que Perplexity?**
- ✅ Mais rápido que Gemini
- ✅ Mais confiável
- ✅ Acesso à internet em tempo real
- ✅ Melhor para geração de conteúdo social

### 3️⃣ AI API - Google Gemini (Fallback Automático)

Acesse: https://makersuite.google.com/app/apikey

```env
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxx
GEMINI_TEXT_MODEL=gemini-2.0-flash-exp
GEMINI_IMAGE_MODEL=gemini-2.5-flash
```

**Nota:** Se Perplexity falhar, o sistema automaticamente usa Gemini!

### 4️⃣ Opcional

```env
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

---

## 🔧 Configuração no Vercel

1. **Acesse:** https://vercel.com/seu-projeto/settings/environment-variables

2. **Adicione cada variável:**
   - Nome: `NEXT_PUBLIC_SUPABASE_URL`
   - Valor: `https://seu-projeto.supabase.co`
   - Environments: ✅ Production ✅ Preview ✅ Development

3. **IMPORTANTE:** Marque **todas as 3 environments** para cada variável!

4. **Variáveis obrigatórias:**
   ```
   ✅ NEXT_PUBLIC_SUPABASE_URL
   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
   ✅ SUPABASE_SERVICE_ROLE_KEY
   ✅ PERPLEXITY_API_KEY (ou GEMINI_API_KEY)
   ```

5. **Depois de adicionar:** Clique em "Redeploy" para aplicar

---

## 🗄️ Configuração do Banco de Dados

1. **Acesse:** Dashboard Supabase → SQL Editor

2. **Copie todo o conteúdo** do arquivo: `supabase-schema-complete.sql`

3. **Cole no SQL Editor** e clique em **Run**

4. **Pronto!** Todas as tabelas, políticas RLS, e triggers foram criados

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] SQL schema rodado no Supabase
- [ ] Build do Vercel passou sem erros
- [ ] Testar API: `POST /api/generate/text`

---

## 🧪 Testar a API

```bash
curl -X POST https://seu-app.vercel.app/api/generate/text \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crie um post sobre tecnologia",
    "type": "social-media",
    "platform": "instagram",
    "tone": "casual"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "content": "...",
    "hashtags": ["tech", "inovacao"]
  }
}
```

---

## 🚨 Problemas Comuns

### Build falha com erro de TypeScript
✅ **Resolvido!** Código já está configurado para permitir build sem env vars

### API retorna erro 500
❌ Verifique se as variáveis de ambiente estão configuradas no Vercel

### Perplexity não funciona
✅ Sistema automaticamente usa Gemini como fallback

---

## 📝 Sua Chave Perplexity

```
PERPLEXITY_API_KEY=papi.871a0780-87e1-4bf5-b8d4-f9cae94f9be2.bQZ1b6J5aJbwv37iw9D2kAa3fzF09Yq3
```

**Cole isso no Vercel agora!** 🚀
