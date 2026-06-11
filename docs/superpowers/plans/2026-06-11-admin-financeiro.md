# Admin Financeiro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar área `/admin` protegida por login ao site da Biopharma para gestão financeira — registro de boletos com OCR automático, lançamento manual de vendas, dashboard de balanço e alertas de vencimento.

**Architecture:** Páginas HTML/CSS/JS vanilla em `/admin/` compartilham um cliente Supabase (auth, DB, Storage) carregado via CDN. Uma Vercel Serverless Function em `/api/ocr-boleto.js` recebe imagens de boletos em base64 e retorna campos extraídos via Groq Vision API. O site público existente não é alterado.

**Tech Stack:** Supabase (auth + PostgreSQL + Storage), Groq API (meta-llama/llama-4-scout-17b-16e-instruct), Vercel Serverless Functions (Node.js 20), Chart.js 4 via CDN, vanilla HTML/CSS/JS

---

## Estrutura de Arquivos

```
/admin/
  index.html          ← tela de login
  dashboard.html      ← dashboard com balanço e alertas
  boletos.html        ← lista de boletos com filtros e botão PAGO
  boleto-novo.html    ← upload de boleto + OCR + formulário de revisão
  venda-nova.html     ← formulário de lançamento de venda
  admin.css           ← estilos exclusivos do painel (não afeta site público)
  admin.js            ← cliente Supabase, guarda de auth, utilitários
  config.js           ← chaves públicas do Supabase (gitignored)

/api/
  ocr-boleto.js       ← Vercel Serverless Function: OCR via Groq

/__tests__/
  ocr-boleto.test.js  ← testes da função serverless

package.json          ← novo: deps da function + Jest
vercel.json           ← novo: rewrites de URL
.gitignore            ← atualizar: node_modules/, admin/config.js
```

---

## Task 1: Supabase — Criar Projeto, Tabelas e Storage

**Files:**
- Nenhum arquivo no repositório — configuração feita no painel do Supabase

- [ ] **Step 1: Criar conta e projeto Supabase**

  Acesse https://supabase.com, crie uma conta gratuita e clique em "New project".
  - Name: `biopharma-admin`
  - Database Password: escolha uma senha forte e anote
  - Region: South America (São Paulo)

  Aguarde o projeto provisionar (~2 min).

- [ ] **Step 2: Executar SQL para criar tabelas**

  No painel do Supabase, vá em **SQL Editor → New query** e execute:

  ```sql
  -- Tabela de boletos
  CREATE TABLE boletos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    fornecedor text NOT NULL,
    valor numeric(10,2) NOT NULL,
    vencimento date NOT NULL,
    pago_em date,
    url_imagem text,
    descricao text
  );

  -- Tabela de vendas
  CREATE TABLE vendas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    data date NOT NULL,
    valor numeric(10,2) NOT NULL,
    observacao text
  );

  -- Habilitar Row Level Security
  ALTER TABLE boletos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

  -- Políticas: apenas usuários autenticados têm acesso total
  CREATE POLICY "Auth: boletos full access"
    ON boletos FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

  CREATE POLICY "Auth: vendas full access"
    ON vendas FOR ALL TO authenticated
    USING (true) WITH CHECK (true);
  ```

  Clique em **Run**. Resultado esperado: `Success. No rows returned`.

- [ ] **Step 3: Criar bucket de storage para imagens de boletos**

  No painel do Supabase, vá em **Storage → New bucket**:
  - Name: `boletos-imagens`
  - Public bucket: **SIM** (marcado)

  Clique em **Save**.

- [ ] **Step 4: Criar conta da dona da farmácia**

  No painel do Supabase, vá em **Authentication → Users → Add user → Create new user**:
  - Email: o e-mail da dona
  - Password: uma senha forte

  Anote o e-mail e senha para dar a ela.

- [ ] **Step 5: Anotar credenciais do projeto**

  No painel do Supabase, vá em **Project Settings → API**.
  Anote:
  - **Project URL** (ex: `https://abcdefgh.supabase.co`)
  - **anon public** key (começa com `eyJ...`)

  Estas serão usadas no Task 3.

---

## Task 2: Infraestrutura do Projeto

**Files:**
- Create: `package.json`
- Create: `vercel.json`
- Modify: `.gitignore`

- [ ] **Step 1: Verificar se `.gitignore` existe**

  ```bash
  cat .gitignore
  ```

- [ ] **Step 2: Atualizar `.gitignore`**

  Adicione ao final do arquivo `.gitignore`:

  ```
  node_modules/
  admin/config.js
  ```

- [ ] **Step 3: Criar `package.json`**

  Crie o arquivo `/package.json`:

  ```json
  {
    "name": "biopharma",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "test": "jest"
    },
    "dependencies": {
      "groq-sdk": "^0.9.1"
    },
    "devDependencies": {
      "jest": "^29.7.0"
    }
  }
  ```

- [ ] **Step 4: Criar `vercel.json`**

  Crie o arquivo `/vercel.json`:

  ```json
  {
    "rewrites": [
      { "source": "/admin", "destination": "/admin/index.html" },
      { "source": "/admin/dashboard", "destination": "/admin/dashboard.html" },
      { "source": "/admin/boletos", "destination": "/admin/boletos.html" },
      { "source": "/admin/boletos/novo", "destination": "/admin/boleto-novo.html" },
      { "source": "/admin/vendas/nova", "destination": "/admin/venda-nova.html" }
    ]
  }
  ```

- [ ] **Step 5: Instalar dependências**

  ```bash
  npm install
  ```

  Resultado esperado: pasta `node_modules/` criada com `groq-sdk` e dependências de Jest.

- [ ] **Step 6: Configurar variável de ambiente da Groq no Vercel**

  No painel do Vercel (vercel.com), vá em seu projeto → **Settings → Environment Variables** e adicione:
  - Key: `GROQ_API_KEY`
  - Value: sua chave da Groq (obtenha em console.groq.com)
  - Environments: Production, Preview, Development

  Clique em **Save**.

- [ ] **Step 7: Commit**

  ```bash
  git add package.json vercel.json .gitignore
  git commit -m "feat: add project infrastructure for admin panel"
  ```

---

## Task 3: Função Serverless OCR (`api/ocr-boleto.js`)

**Files:**
- Create: `api/ocr-boleto.js`
- Create: `__tests__/ocr-boleto.test.js`

- [ ] **Step 1: Escrever o teste**

  Crie `/__tests__/ocr-boleto.test.js`:

  ```javascript
  const handler = require('../api/ocr-boleto');

  function mockReq(body, method = 'POST') {
    return { method, body };
  }

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  jest.mock('groq-sdk', () => {
    return jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: '{"fornecedor":"Distribuidora ABC","valor":"1200.00","vencimento":"2026-06-15"}'
              }
            }]
          })
        }
      }
    }));
  });

  test('extrai campos do boleto com sucesso', async () => {
    const req = mockReq({ image: 'base64data', mimeType: 'image/jpeg' });
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      fornecedor: 'Distribuidora ABC',
      valor: '1200.00',
      vencimento: '2026-06-15'
    });
  });

  test('retorna 405 para métodos não-POST', async () => {
    const req = mockReq({}, 'GET');
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  test('lida com JSON malformado do Groq', async () => {
    const Groq = require('groq-sdk');
    Groq.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Não consegui extrair os dados.' } }]
          })
        }
      }
    }));
    const req = mockReq({ image: 'base64data', mimeType: 'image/jpeg' });
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      fornecedor: null,
      valor: null,
      vencimento: null
    });
  });
  ```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

  ```bash
  npx jest __tests__/ocr-boleto.test.js
  ```

  Resultado esperado: `Cannot find module '../api/ocr-boleto'`

- [ ] **Step 3: Implementar a função**

  Crie `/api/ocr-boleto.js`:

  ```javascript
  const Groq = require('groq-sdk');

  const PROMPT = `Você é um especialista em leitura de boletos bancários brasileiros.
  Extraia do boleto: cedente/beneficiário (nome da empresa), valor total, data de vencimento.
  Responda SOMENTE com JSON válido no formato:
  {"fornecedor":"Nome da Empresa","valor":"1234.56","vencimento":"YYYY-MM-DD"}
  Se não encontrar um campo, use null. Não inclua texto fora do JSON.`;

  module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image, mimeType } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({ error: 'image and mimeType are required' });
    }

    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${image}` }
            },
            { type: 'text', text: PROMPT }
          ]
        }],
        max_tokens: 256,
        temperature: 0.1
      });

      const text = completion.choices[0].message.content || '';
      const match = text.match(/\{[\s\S]*\}/);

      if (!match) {
        return res.status(200).json({ fornecedor: null, valor: null, vencimento: null });
      }

      const parsed = JSON.parse(match[0]);
      return res.status(200).json({
        fornecedor: parsed.fornecedor ?? null,
        valor: parsed.valor ?? null,
        vencimento: parsed.vencimento ?? null
      });
    } catch (err) {
      console.error('OCR error:', err);
      return res.status(500).json({ error: 'OCR failed', detail: err.message });
    }
  };
  ```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

  ```bash
  npx jest __tests__/ocr-boleto.test.js
  ```

  Resultado esperado: `3 passed, 3 total`

- [ ] **Step 5: Commit**

  ```bash
  git add api/ocr-boleto.js __tests__/ocr-boleto.test.js
  git commit -m "feat: add boleto OCR serverless function with Groq Vision"
  ```

---

## Task 4: Configuração e Estilos Compartilhados

**Files:**
- Create: `admin/config.js` (gitignored — preencher com dados reais)
- Create: `admin/admin.js`
- Create: `admin/admin.css`

- [ ] **Step 1: Criar `admin/config.js` com as credenciais do Supabase**

  Crie `/admin/config.js` (este arquivo NÃO será commitado — já está no `.gitignore`):

  ```javascript
  // Credenciais públicas do Supabase (seguras com RLS ativo)
  window.SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
  window.SUPABASE_ANON_KEY = 'sua_anon_key_aqui';
  ```

  Substitua pelos valores anotados no Task 1, Step 5.

- [ ] **Step 2: Criar `admin/admin.js`**

  Crie `/admin/admin.js`:

  ```javascript
  const { createClient } = supabase;
  const db = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  async function requireAuth() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
      window.location.href = '/admin';
    }
    return session;
  }

  async function signOut() {
    await db.auth.signOut();
    window.location.href = '/admin';
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function getDateRange(period, customStart, customEnd) {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (period === 'today') {
      const iso = toISO(today);
      return { start: iso, end: iso };
    }
    if (period === 'week') {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return { start: toISO(start), end: toISO(today) };
    }
    if (period === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: toISO(start), end: toISO(today) };
    }
    if (period === 'custom') {
      return { start: customStart, end: customEnd };
    }
    // fallback: month
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start: toISO(start), end: toISO(today) };
  }

  function addDays(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function todayISO() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function formatDateBR(isoDate) {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  }
  ```

- [ ] **Step 3: Criar `admin/admin.css`**

  Crie `/admin/admin.css`:

  ```css
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #f1f5f9;
    color: #1e293b;
    min-height: 100vh;
  }

  /* ── Topbar ── */
  .topbar {
    background: #007BB6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 6px rgba(0,0,0,.15);
  }
  .topbar-logo { font-weight: 700; font-size: 1.1rem; letter-spacing: .5px; }
  .topbar-nav { display: flex; gap: 8px; }
  .topbar-nav a {
    color: rgba(255,255,255,.85);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: .875rem;
    transition: background .15s;
  }
  .topbar-nav a:hover, .topbar-nav a.active { background: rgba(255,255,255,.2); color: white; }
  .btn-signout {
    background: transparent;
    border: 1px solid rgba(255,255,255,.5);
    color: white;
    padding: 5px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: .875rem;
    transition: background .15s;
  }
  .btn-signout:hover { background: rgba(255,255,255,.15); }

  /* ── Page wrapper ── */
  .page { max-width: 1100px; margin: 0 auto; padding: 28px 20px; }
  .page-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; color: #0f172a; }

  /* ── Cards de resumo ── */
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .summary-card {
    background: white;
    border-radius: 12px;
    padding: 18px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.07);
  }
  .summary-card .label { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; color: #64748b; margin-bottom: 6px; }
  .summary-card .value { font-size: 1.5rem; font-weight: 800; }
  .summary-card.blue .value { color: #0369a1; }
  .summary-card.red .value  { color: #dc2626; }
  .summary-card.green .value{ color: #16a34a; }

  /* ── Dashboard grid ── */
  .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
  @media (max-width: 700px) { .dashboard-grid { grid-template-columns: 1fr; } }

  /* ── Panels ── */
  .panel {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.07);
  }
  .panel-title { font-size: .875rem; font-weight: 700; color: #374151; margin-bottom: 14px; text-transform: uppercase; letter-spacing: .5px; }

  /* ── Alertas ── */
  .alert-item {
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 8px;
    font-size: .875rem;
  }
  .alert-item.red { background: #fee2e2; border-left: 3px solid #dc2626; }
  .alert-item.orange { background: #fff3cd; border-left: 3px solid #f59e0b; }
  .alert-item .alert-supplier { font-weight: 600; }
  .alert-item .alert-detail { color: #64748b; font-size: .8rem; margin-top: 2px; }

  /* ── Filtros ── */
  .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; align-items: center; }
  .filter-btn {
    padding: 6px 16px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    font-size: .875rem;
    transition: all .15s;
    color: #374151;
  }
  .filter-btn:hover { border-color: #007BB6; color: #007BB6; }
  .filter-btn.active { background: #007BB6; color: white; border-color: #007BB6; }
  .filter-custom { display: flex; gap: 6px; align-items: center; }
  .filter-custom input[type="date"] {
    padding: 5px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: .875rem;
    color: #374151;
  }
  .filter-custom-group { display: none; }
  .filter-custom-group.visible { display: flex; gap: 6px; align-items: center; }

  /* ── Tabela ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: .875rem; }
  th { text-align: left; padding: 10px 14px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600; font-size: .75rem; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }

  /* ── Badges ── */
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: .75rem;
    font-weight: 700;
    letter-spacing: .3px;
  }
  .badge.pendente { background: #fef3c7; color: #92400e; }
  .badge.pago { background: #dcfce7; color: #166534; }
  .badge.vencido { background: #fee2e2; color: #991b1b; }

  /* ── Botões ── */
  .btn {
    display: inline-block;
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: .875rem;
    font-weight: 600;
    text-decoration: none;
    transition: opacity .15s;
  }
  .btn:hover { opacity: .88; }
  .btn-primary { background: #007BB6; color: white; }
  .btn-success { background: #16a34a; color: white; }
  .btn-pago { background: #16a34a; color: white; padding: 4px 12px; font-size: .8rem; border-radius: 6px; }
  .btn-sm { padding: 4px 12px; font-size: .8rem; border-radius: 6px; }
  .btn-secondary { background: #e2e8f0; color: #374151; }
  .btn-danger { background: #dc2626; color: white; }

  /* ── Formulário ── */
  .form-card { background: white; border-radius: 12px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,.07); max-width: 540px; }
  .form-group { margin-bottom: 18px; }
  .form-group label { display: block; font-size: .875rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
  .form-group input, .form-group textarea, .form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: .9rem;
    color: #1e293b;
    transition: border-color .15s;
  }
  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: #007BB6;
    box-shadow: 0 0 0 3px rgba(0,123,182,.12);
  }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  .ocr-hint { font-size: .75rem; color: #3b82f6; font-weight: 500; margin-left: 6px; }

  /* ── Upload area ── */
  .upload-area {
    border: 2px dashed #93c5fd;
    border-radius: 10px;
    padding: 28px;
    text-align: center;
    background: #eff6ff;
    cursor: pointer;
    transition: background .15s;
    margin-bottom: 20px;
  }
  .upload-area:hover { background: #dbeafe; }
  .upload-area input[type="file"] { display: none; }
  .upload-area .upload-icon { font-size: 2.5rem; margin-bottom: 8px; }
  .upload-area p { color: #3b82f6; font-weight: 600; font-size: .95rem; }
  .upload-area small { color: #64748b; font-size: .8rem; }
  .upload-preview { max-width: 200px; max-height: 200px; border-radius: 8px; margin: 12px auto 0; display: block; }

  /* ── OCR spinner ── */
  .ocr-loading { display: none; text-align: center; padding: 16px; color: #007BB6; font-weight: 600; }
  .ocr-loading.visible { display: block; }

  /* ── Login ── */
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #007BB6 0%, #005f8f 100%); }
  .login-card { background: white; border-radius: 16px; padding: 40px 36px; width: 100%; max-width: 380px; box-shadow: 0 8px 32px rgba(0,0,0,.15); }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-logo img { height: 48px; }
  .login-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 6px; }
  .login-subtitle { font-size: .875rem; color: #64748b; text-align: center; margin-bottom: 24px; }
  .login-error { background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 8px; font-size: .875rem; margin-bottom: 16px; display: none; }
  .login-error.visible { display: block; }

  /* ── Chart container ── */
  .chart-container { position: relative; height: 120px; }
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add admin/admin.js admin/admin.css
  git commit -m "feat: add shared admin JS utilities and CSS"
  ```

  > Nota: `admin/config.js` está no `.gitignore` e **não será commitado** — isso é intencional.

---

## Task 5: Página de Login (`admin/index.html`)

**Files:**
- Create: `admin/index.html`

- [ ] **Step 1: Criar `admin/index.html`**

  ```html
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin — Biopharma Farmácia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/admin/admin.css" />
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    <script src="/admin/config.js"></script>
  </head>
  <body>
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">
          <img src="/logo.png" alt="Biopharma" />
        </div>
        <h1 class="login-title">Painel Administrativo</h1>
        <p class="login-subtitle">Biopharma Farmácia</p>

        <div class="login-error" id="loginError"></div>

        <form id="loginForm">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" placeholder="seu@email.com" required />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;padding:11px;" id="submitBtn">
            Entrar
          </button>
        </form>
      </div>
    </div>

    <script>
      const { createClient } = supabase;
      const db = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

      // Se já tem sessão, redireciona direto
      (async () => {
        const { data: { session } } = await db.auth.getSession();
        if (session) window.location.href = '/admin/dashboard';
      })();

      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const errorEl = document.getElementById('loginError');
        errorEl.classList.remove('visible');
        btn.textContent = 'Entrando...';
        btn.disabled = true;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { error } = await db.auth.signInWithPassword({ email, password });

        if (error) {
          errorEl.textContent = 'E-mail ou senha incorretos.';
          errorEl.classList.add('visible');
          btn.textContent = 'Entrar';
          btn.disabled = false;
          return;
        }

        window.location.href = '/admin/dashboard';
      });
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Testar manualmente**

  Abra o Vercel dev local:
  ```bash
  npx vercel dev
  ```
  
  Acesse http://localhost:3000/admin e verifique:
  - Formulário de login aparece com logo
  - Tentar senha errada mostra mensagem de erro
  - Login com credenciais corretas redireciona para `/admin/dashboard` (pode dar 404 — o dashboard ainda não existe, isso é esperado)

- [ ] **Step 3: Commit**

  ```bash
  git add admin/index.html
  git commit -m "feat: add admin login page with Supabase auth"
  ```

---

## Task 6: Dashboard (`admin/dashboard.html`)

**Files:**
- Create: `admin/dashboard.html`

- [ ] **Step 1: Criar `admin/dashboard.html`**

  ```html
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard — Biopharma Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/admin/admin.css" />
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
    <script src="/admin/config.js"></script>
  </head>
  <body>
    <nav class="topbar">
      <span class="topbar-logo">Biopharma Admin</span>
      <div class="topbar-nav">
        <a href="/admin/dashboard" class="active">Dashboard</a>
        <a href="/admin/boletos">Boletos</a>
      </div>
      <button class="btn-signout" onclick="signOut()">Sair</button>
    </nav>

    <div class="page">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h1 class="page-title" style="margin-bottom:0">Dashboard</h1>
        <div class="filter-bar" style="margin-bottom:0">
          <button class="filter-btn" onclick="setFilter('today',this)">Hoje</button>
          <button class="filter-btn" onclick="setFilter('week',this)">Esta semana</button>
          <button class="filter-btn active" onclick="setFilter('month',this)" id="filterMonth">Este mês</button>
          <button class="filter-btn" onclick="setFilter('custom',this)" id="filterCustomBtn">Personalizado</button>
          <div class="filter-custom-group" id="customGroup">
            <input type="date" id="customStart" />
            <span>até</span>
            <input type="date" id="customEnd" />
            <button class="btn btn-primary btn-sm" onclick="applyCustomFilter()">Aplicar</button>
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card blue">
          <div class="label">Vendas</div>
          <div class="value" id="totalVendas">—</div>
        </div>
        <div class="summary-card red">
          <div class="label">Gastos (boletos)</div>
          <div class="value" id="totalGastos">—</div>
        </div>
        <div class="summary-card" id="saldoCard">
          <div class="label">Saldo estimado</div>
          <div class="value" id="totalSaldo">—</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-title">Balanço do período</div>
          <div class="chart-container">
            <canvas id="balanceChart"></canvas>
          </div>
          <div class="panel-title" style="margin-top:24px;">Últimos 5 boletos</div>
          <div id="recentBoletos"><p style="color:#94a3b8;font-size:.875rem;">Carregando...</p></div>
        </div>

        <div>
          <div class="panel" style="margin-bottom:16px;">
            <div class="panel-title">⚠️ Alertas de vencimento</div>
            <div id="alertsPanel"><p style="color:#94a3b8;font-size:.875rem;">Verificando...</p></div>
          </div>
          <div style="display:flex;gap:10px;">
            <a href="/admin/boletos/novo" class="btn btn-primary" style="flex:1;text-align:center;">+ Boleto</a>
            <a href="/admin/vendas/nova" class="btn btn-success" style="flex:1;text-align:center;">+ Venda</a>
          </div>
        </div>
      </div>
    </div>

    <script src="/admin/admin.js"></script>
    <script>
      let currentFilter = 'month';
      let chartInstance = null;

      async function init() {
        await requireAuth();
        await loadDashboard();
      }

      function setFilter(period, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = period;
        const customGroup = document.getElementById('customGroup');
        if (period === 'custom') {
          customGroup.classList.add('visible');
          return;
        }
        customGroup.classList.remove('visible');
        loadDashboard();
      }

      function applyCustomFilter() {
        const start = document.getElementById('customStart').value;
        const end = document.getElementById('customEnd').value;
        if (!start || !end) return alert('Selecione as duas datas.');
        loadDashboard(start, end);
      }

      async function loadDashboard(customStart, customEnd) {
        const range = getDateRange(currentFilter, customStart, customEnd);

        const [{ data: boletos }, { data: vendas }] = await Promise.all([
          db.from('boletos').select('valor,vencimento,pago_em').gte('vencimento', range.start).lte('vencimento', range.end),
          db.from('vendas').select('valor').gte('data', range.start).lte('data', range.end)
        ]);

        const totalGastos = (boletos || []).reduce((s, b) => s + Number(b.valor), 0);
        const totalVendas = (vendas || []).reduce((s, v) => s + Number(v.valor), 0);
        const saldo = totalVendas - totalGastos;

        document.getElementById('totalVendas').textContent = formatCurrency(totalVendas);
        document.getElementById('totalGastos').textContent = formatCurrency(totalGastos);
        document.getElementById('totalSaldo').textContent = formatCurrency(saldo);
        const saldoCard = document.getElementById('saldoCard');
        saldoCard.className = 'summary-card ' + (saldo >= 0 ? 'green' : 'red');

        renderChart(totalVendas, totalGastos);
        await loadRecentBoletos();
        await loadAlerts();
      }

      function renderChart(vendas, gastos) {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Vendas', 'Gastos'],
            datasets: [{
              data: [vendas, gastos],
              backgroundColor: ['#3b82f6', '#ef4444'],
              borderRadius: 6
            }]
          },
          options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { callback: (v) => 'R$ ' + Number(v).toLocaleString('pt-BR') }
              }
            }
          }
        });
      }

      async function loadRecentBoletos() {
        const { data } = await db.from('boletos').select('fornecedor,valor,vencimento,pago_em').order('created_at', { ascending: false }).limit(5);
        const el = document.getElementById('recentBoletos');
        if (!data || !data.length) { el.innerHTML = '<p style="color:#94a3b8;font-size:.875rem;">Nenhum boleto registrado.</p>'; return; }
        el.innerHTML = `<table style="width:100%"><thead><tr><th>Fornecedor</th><th>Valor</th><th>Vencimento</th><th>Status</th></tr></thead><tbody>
          ${data.map(b => {
            const today = todayISO();
            let badge = b.pago_em ? 'pago' : (b.vencimento < today ? 'vencido' : 'pendente');
            let label = b.pago_em ? 'PAGO' : (b.vencimento < today ? 'VENCIDO' : 'PENDENTE');
            return `<tr><td>${b.fornecedor}</td><td>${formatCurrency(b.valor)}</td><td>${formatDateBR(b.vencimento)}</td><td><span class="badge ${badge}">${label}</span></td></tr>`;
          }).join('')}
        </tbody></table>`;
      }

      async function loadAlerts() {
        const today = todayISO();
        const in5days = addDays(today, 5);
        const { data } = await db.from('boletos').select('fornecedor,valor,vencimento').is('pago_em', null).lte('vencimento', in5days).order('vencimento');
        const el = document.getElementById('alertsPanel');
        if (!data || !data.length) { el.innerHTML = '<p style="color:#16a34a;font-size:.875rem;">✅ Nenhum boleto urgente.</p>'; return; }
        el.innerHTML = data.map(b => {
          const overdue = b.vencimento < today;
          const cls = overdue ? 'red' : 'orange';
          const detail = overdue ? `Venceu em ${formatDateBR(b.vencimento)}` : `Vence em ${formatDateBR(b.vencimento)}`;
          return `<div class="alert-item ${cls}"><div class="alert-supplier">${b.fornecedor}</div><div class="alert-detail">${detail} · ${formatCurrency(b.valor)}</div></div>`;
        }).join('');
      }

      init();
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Testar manualmente**

  Com `npx vercel dev` rodando, acesse http://localhost:3000/admin/dashboard:
  - Deve redirecionar para login se não autenticada
  - Após login, deve mostrar o dashboard com cards de resumo
  - Filtros devem atualizar os valores e o gráfico
  - Alertas devem aparecer em laranja/vermelho se houver boletos próximos

- [ ] **Step 3: Commit**

  ```bash
  git add admin/dashboard.html
  git commit -m "feat: add admin dashboard with balance chart and due date alerts"
  ```

---

## Task 7: Lista de Boletos (`admin/boletos.html`)

**Files:**
- Create: `admin/boletos.html`

- [ ] **Step 1: Criar `admin/boletos.html`**

  ```html
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Boletos — Biopharma Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/admin/admin.css" />
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    <script src="/admin/config.js"></script>
  </head>
  <body>
    <nav class="topbar">
      <span class="topbar-logo">Biopharma Admin</span>
      <div class="topbar-nav">
        <a href="/admin/dashboard">Dashboard</a>
        <a href="/admin/boletos" class="active">Boletos</a>
      </div>
      <button class="btn-signout" onclick="signOut()">Sair</button>
    </nav>

    <div class="page">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h1 class="page-title" style="margin-bottom:0">Boletos</h1>
        <a href="/admin/boletos/novo" class="btn btn-primary">+ Adicionar Boleto</a>
      </div>

      <div class="filter-bar">
        <button class="filter-btn" onclick="setFilter('today',this)">Hoje</button>
        <button class="filter-btn" onclick="setFilter('week',this)">Esta semana</button>
        <button class="filter-btn active" onclick="setFilter('month',this)">Este mês</button>
        <button class="filter-btn" onclick="setFilter('custom',this)">Personalizado</button>
        <div class="filter-custom-group" id="customGroup">
          <input type="date" id="customStart" />
          <span>até</span>
          <input type="date" id="customEnd" />
          <button class="btn btn-primary btn-sm" onclick="applyCustomFilter()">Aplicar</button>
        </div>
      </div>

      <div class="panel">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fornecedor</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="boletosTableBody">
              <tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:32px;">Carregando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script src="/admin/admin.js"></script>
    <script>
      let currentFilter = 'month';

      async function init() {
        await requireAuth();
        await loadBoletos();
      }

      function setFilter(period, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = period;
        const customGroup = document.getElementById('customGroup');
        if (period === 'custom') { customGroup.classList.add('visible'); return; }
        customGroup.classList.remove('visible');
        loadBoletos();
      }

      function applyCustomFilter() {
        const start = document.getElementById('customStart').value;
        const end = document.getElementById('customEnd').value;
        if (!start || !end) return alert('Selecione as duas datas.');
        loadBoletos(start, end);
      }

      async function loadBoletos(customStart, customEnd) {
        const range = getDateRange(currentFilter, customStart, customEnd);
        const { data, error } = await db.from('boletos').select('*').gte('vencimento', range.start).lte('vencimento', range.end).order('vencimento');
        const tbody = document.getElementById('boletosTableBody');
        if (error || !data || !data.length) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:32px;">Nenhum boleto encontrado.</td></tr>';
          return;
        }
        const today = todayISO();
        tbody.innerHTML = data.map(b => {
          let badgeClass = b.pago_em ? 'pago' : (b.vencimento < today ? 'vencido' : 'pendente');
          let badgeLabel = b.pago_em ? 'PAGO' : (b.vencimento < today ? 'VENCIDO' : 'PENDENTE');
          const acoes = b.pago_em
            ? `<span style="color:#94a3b8;font-size:.8rem;">Pago em ${formatDateBR(b.pago_em)}</span>`
            : `<button class="btn-pago" onclick="marcarPago('${b.id}',this)">PAGO</button>`;
          const imgBtn = b.url_imagem
            ? `<a href="${b.url_imagem}" target="_blank" class="btn btn-secondary btn-sm" style="margin-left:6px;">Ver boleto</a>`
            : '';
          return `<tr>
            <td>${b.fornecedor}</td>
            <td>${formatCurrency(b.valor)}</td>
            <td>${formatDateBR(b.vencimento)}</td>
            <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${b.descricao || ''}">${b.descricao || '—'}</td>
            <td>${acoes}${imgBtn}</td>
          </tr>`;
        }).join('');
      }

      async function marcarPago(id, btn) {
        btn.textContent = 'Salvando...';
        btn.disabled = true;
        const { error } = await db.from('boletos').update({ pago_em: todayISO() }).eq('id', id);
        if (error) { alert('Erro ao salvar. Tente novamente.'); btn.textContent = 'PAGO'; btn.disabled = false; return; }
        await loadBoletos();
      }

      init();
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Testar manualmente**

  Acesse http://localhost:3000/admin/boletos:
  - Tabela aparece com dados (se houver boletos cadastrados)
  - Filtros alteram o período exibido
  - Botão PAGO registra a data de pagamento e atualiza o status na tabela

- [ ] **Step 3: Commit**

  ```bash
  git add admin/boletos.html
  git commit -m "feat: add boletos list with filters and PAGO button"
  ```

---

## Task 8: Adicionar Boleto com OCR (`admin/boleto-novo.html`)

**Files:**
- Create: `admin/boleto-novo.html`

- [ ] **Step 1: Criar `admin/boleto-novo.html`**

  ```html
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Novo Boleto — Biopharma Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/admin/admin.css" />
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    <script src="/admin/config.js"></script>
  </head>
  <body>
    <nav class="topbar">
      <span class="topbar-logo">Biopharma Admin</span>
      <div class="topbar-nav">
        <a href="/admin/dashboard">Dashboard</a>
        <a href="/admin/boletos" class="active">Boletos</a>
      </div>
      <button class="btn-signout" onclick="signOut()">Sair</button>
    </nav>

    <div class="page">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <a href="/admin/boletos" style="color:#64748b;text-decoration:none;font-size:.875rem;">← Voltar</a>
        <h1 class="page-title" style="margin-bottom:0">Novo Boleto</h1>
      </div>

      <div class="form-card">
        <label class="upload-area" for="boletoFile" id="uploadArea">
          <input type="file" id="boletoFile" accept="image/*,application/pdf" onchange="handleFileSelect(this)" />
          <div class="upload-icon">📎</div>
          <p>Toque para fotografar ou escolher imagem</p>
          <small>O sistema vai ler os dados automaticamente</small>
        </label>
        <img id="uploadPreview" class="upload-preview" style="display:none;" alt="Preview do boleto" />

        <div class="ocr-loading" id="ocrLoading">⚡ Lendo boleto... aguarde</div>

        <div id="formFields" style="display:none;">
          <div class="form-group">
            <label>Fornecedor <span class="ocr-hint" id="hintFornecedor"></span></label>
            <input type="text" id="fornecedor" placeholder="Nome da distribuidora" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Valor (R$) <span class="ocr-hint" id="hintValor"></span></label>
              <input type="number" id="valor" step="0.01" min="0" placeholder="0,00" required />
            </div>
            <div class="form-group">
              <label>Vencimento <span class="ocr-hint" id="hintVencimento"></span></label>
              <input type="date" id="vencimento" required />
            </div>
          </div>
          <div class="form-group">
            <label>Descrição — medicamentos pedidos</label>
            <textarea id="descricao" placeholder="Ex: Dipirona 500mg cx50, Amoxicilina 500mg, ..."></textarea>
          </div>
          <button type="button" class="btn btn-primary" style="width:100%;padding:12px;" onclick="salvarBoleto()" id="saveBtn">
            SALVAR BOLETO
          </button>
        </div>

        <div id="manualEntry" style="text-align:center;margin-top:12px;display:none;">
          <button class="btn btn-secondary btn-sm" onclick="showFormManual()">Preencher manualmente</button>
        </div>
      </div>
    </div>

    <script src="/admin/admin.js"></script>
    <script>
      let selectedFile = null;

      async function init() {
        await requireAuth();
      }

      function handleFileSelect(input) {
        selectedFile = input.files[0];
        if (!selectedFile) return;

        // Mostrar preview
        if (selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const preview = document.getElementById('uploadPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(selectedFile);
        }

        runOCR(selectedFile);
      }

      async function runOCR(file) {
        document.getElementById('ocrLoading').classList.add('visible');
        document.getElementById('manualEntry').style.display = 'none';

        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target.result.split(',')[1];
          try {
            const resp = await fetch('/api/ocr-boleto', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: base64, mimeType: file.type })
            });
            const data = await resp.json();
            fillForm(data);
          } catch (err) {
            fillForm({ fornecedor: null, valor: null, vencimento: null });
          }
        };
        reader.readAsDataURL(file);
      }

      function fillForm({ fornecedor, valor, vencimento }) {
        document.getElementById('ocrLoading').classList.remove('visible');

        if (fornecedor) {
          document.getElementById('fornecedor').value = fornecedor;
          document.getElementById('hintFornecedor').textContent = '✦ lido automaticamente';
        }
        if (valor) {
          document.getElementById('valor').value = parseFloat(valor).toFixed(2);
          document.getElementById('hintValor').textContent = '✦ lido automaticamente';
        }
        if (vencimento) {
          document.getElementById('vencimento').value = vencimento;
          document.getElementById('hintVencimento').textContent = '✦ lido automaticamente';
        }

        document.getElementById('formFields').style.display = 'block';
        document.getElementById('manualEntry').style.display = 'none';
      }

      function showFormManual() {
        document.getElementById('formFields').style.display = 'block';
        document.getElementById('manualEntry').style.display = 'none';
      }

      async function salvarBoleto() {
        const fornecedor = document.getElementById('fornecedor').value.trim();
        const valor = document.getElementById('valor').value;
        const vencimento = document.getElementById('vencimento').value;
        const descricao = document.getElementById('descricao').value.trim();

        if (!fornecedor || !valor || !vencimento) {
          alert('Preencha fornecedor, valor e vencimento.');
          return;
        }

        const btn = document.getElementById('saveBtn');
        btn.textContent = 'Salvando...';
        btn.disabled = true;

        let url_imagem = null;

        if (selectedFile) {
          const fileName = `${Date.now()}-boleto.${selectedFile.name.split('.').pop()}`;
          const { data: uploadData, error: uploadError } = await db.storage
            .from('boletos-imagens')
            .upload(fileName, selectedFile, { contentType: selectedFile.type });

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = db.storage.from('boletos-imagens').getPublicUrl(uploadData.path);
            url_imagem = publicUrl;
          }
        }

        const { error } = await db.from('boletos').insert({
          fornecedor,
          valor: parseFloat(valor),
          vencimento,
          descricao: descricao || null,
          url_imagem
        });

        if (error) {
          alert('Erro ao salvar boleto. Tente novamente.');
          btn.textContent = 'SALVAR BOLETO';
          btn.disabled = false;
          return;
        }

        window.location.href = '/admin/boletos';
      }

      // Mostrar botão "preencher manualmente" se não houver arquivo selecionado após 1s de carregamento
      document.getElementById('boletoFile').addEventListener('change', () => {
        setTimeout(() => {
          if (document.getElementById('formFields').style.display === 'none') {
            document.getElementById('manualEntry').style.display = 'block';
          }
        }, 500);
      });

      init();
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Testar manualmente**

  Acesse http://localhost:3000/admin/boletos/novo:
  - Clicar na área de upload abre seletor de arquivo
  - Após selecionar uma foto de boleto, aparece "Lendo boleto..."
  - Campos preenchidos com ✦ indicam dados extraídos pelo OCR
  - Preencher descrição e clicar SALVAR redireciona para a lista
  - Boleto aparece na lista com os dados corretos

- [ ] **Step 3: Commit**

  ```bash
  git add admin/boleto-novo.html
  git commit -m "feat: add new boleto page with Groq OCR auto-fill"
  ```

---

## Task 9: Registrar Venda (`admin/venda-nova.html`)

**Files:**
- Create: `admin/venda-nova.html`

- [ ] **Step 1: Criar `admin/venda-nova.html`**

  ```html
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nova Venda — Biopharma Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/admin/admin.css" />
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    <script src="/admin/config.js"></script>
  </head>
  <body>
    <nav class="topbar">
      <span class="topbar-logo">Biopharma Admin</span>
      <div class="topbar-nav">
        <a href="/admin/dashboard">Dashboard</a>
        <a href="/admin/boletos">Boletos</a>
      </div>
      <button class="btn-signout" onclick="signOut()">Sair</button>
    </nav>

    <div class="page">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <a href="/admin/dashboard" style="color:#64748b;text-decoration:none;font-size:.875rem;">← Voltar</a>
        <h1 class="page-title" style="margin-bottom:0">Registrar Venda</h1>
      </div>

      <div class="form-card">
        <div class="form-group">
          <label for="data">Data da venda</label>
          <input type="date" id="data" required />
        </div>
        <div class="form-group">
          <label for="valor">Total vendido (R$)</label>
          <input type="number" id="valor" step="0.01" min="0" placeholder="0,00" required />
        </div>
        <div class="form-group">
          <label for="observacao">Observação (opcional)</label>
          <textarea id="observacao" placeholder="Ex: semana do Dia das Mães, promoção dipirona..."></textarea>
        </div>
        <button type="button" class="btn btn-success" style="width:100%;padding:12px;" onclick="salvarVenda()" id="saveBtn">
          SALVAR VENDA
        </button>
      </div>
    </div>

    <script src="/admin/admin.js"></script>
    <script>
      async function init() {
        await requireAuth();
        document.getElementById('data').value = todayISO();
      }

      async function salvarVenda() {
        const data = document.getElementById('data').value;
        const valor = document.getElementById('valor').value;
        const observacao = document.getElementById('observacao').value.trim();

        if (!data || !valor || parseFloat(valor) <= 0) {
          alert('Preencha a data e o valor.');
          return;
        }

        const btn = document.getElementById('saveBtn');
        btn.textContent = 'Salvando...';
        btn.disabled = true;

        const { error } = await db.from('vendas').insert({
          data,
          valor: parseFloat(valor),
          observacao: observacao || null
        });

        if (error) {
          alert('Erro ao salvar. Tente novamente.');
          btn.textContent = 'SALVAR VENDA';
          btn.disabled = false;
          return;
        }

        window.location.href = '/admin/dashboard';
      }

      init();
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Testar manualmente**

  Acesse http://localhost:3000/admin/vendas/nova:
  - Data pré-preenchida com hoje
  - Preencher valor e clicar SALVAR redireciona para o dashboard
  - Dashboard atualiza o total de vendas com o novo valor

- [ ] **Step 3: Commit**

  ```bash
  git add admin/venda-nova.html
  git commit -m "feat: add new sale registration page"
  ```

---

## Task 10: Deploy Final

**Files:**
- Nenhum arquivo novo — configuração no Vercel

- [ ] **Step 1: Testar o fluxo completo localmente**

  Com `npx vercel dev` rodando, percorra o fluxo completo:
  1. Acesse `/admin` → faça login
  2. No dashboard, clique em **+ Boleto** → faça upload de uma foto de boleto → confirme OCR → preencha descrição → salve
  3. Clique em **+ Venda** → preencha data e valor → salve
  4. Verifique se o dashboard mostra valores corretos e saldo
  5. Acesse Boletos → clique **PAGO** em um boleto → status muda para PAGO
  6. Aplique filtros diferentes e verifique se os dados mudam

- [ ] **Step 2: Fazer push para produção**

  ```bash
  git push origin main
  ```

  O Vercel fará o deploy automaticamente.

- [ ] **Step 3: Verificar variáveis de ambiente no Vercel**

  No painel do Vercel → **Settings → Environment Variables**, confirme que `GROQ_API_KEY` está configurada.

- [ ] **Step 4: Testar em produção**

  Acesse https://farmaciabiopharma.vercel.app/admin e repita o fluxo completo em produção.

  Confirme que:
  - Login funciona
  - Upload de boleto e OCR funcionam (requer `GROQ_API_KEY` no Vercel)
  - Botão PAGO funciona
  - Alertas de vencimento aparecem no dashboard
