# Admin Financeiro — Biopharma Farmácia

**Data:** 2026-06-11  
**Status:** Aprovado

## Visão Geral

Página `/admin` protegida por login adicionada ao site existente (farmaciabiopharma.vercel.app). Permite à dona da farmácia registrar boletos de distribuidoras (com OCR automático), registrar vendas manualmente e acompanhar o balanço financeiro mensal com alertas de vencimento.

---

## Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML/CSS/JS vanilla (consistente com o site atual) |
| Autenticação | Supabase Auth (e-mail + senha) |
| Banco de dados | Supabase PostgreSQL |
| Armazenamento de imagens | Supabase Storage |
| OCR de boletos | Groq API — modelo LLaMA 4 Scout (visão, gratuito) |
| Funções serverless | Vercel Serverless Functions |
| Hospedagem | Vercel (projeto existente) |

---

## Arquitetura

O site público permanece intacto. A rota `/admin` carrega uma Single Page Application separada. O fluxo de adição de boleto é o único que exige comunicação com serviços externos:

```
Browser → POST /api/ocr-boleto (Vercel Function)
                    → Groq Vision API
                    ← campos extraídos (fornecedor, valor, vencimento)
Browser → Supabase (salvar registro + imagem)
```

Todas as outras operações (login, leitura de dados, marcar como pago) comunicam diretamente com o Supabase pelo SDK JavaScript no frontend.

---

## Modelo de Dados

### Tabela `boletos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | Chave primária |
| `created_at` | timestamptz | Data de criação |
| `fornecedor` | text | Nome da distribuidora |
| `valor` | numeric(10,2) | Valor do boleto |
| `vencimento` | date | Data de vencimento |
| `pago_em` | date | Data de pagamento (null = pendente) |
| `url_imagem` | text | URL da imagem no Supabase Storage |
| `descricao` | text | Medicamentos pedidos no pedido |

### Tabela `vendas`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | Chave primária |
| `created_at` | timestamptz | Data de criação |
| `data` | date | Data da venda |
| `valor` | numeric(10,2) | Valor total vendido |
| `observacao` | text | Observação opcional |

---

## Telas

### 1. Login (`/admin`)

- Formulário simples: e-mail + senha
- Sem opção de cadastro público — a conta é criada manualmente no painel do Supabase
- Redirecionamento automático para o dashboard após autenticação bem-sucedida
- Sessão persiste via token do Supabase (sem expiração forçada)

### 2. Dashboard (`/admin/dashboard`)

Layout em duas colunas:

**Coluna principal (esquerda, 2/3):**
- Gráfico de barras horizontais: Vendas (azul) vs Gastos em boletos (vermelho) do período selecionado
- Valor do saldo calculado (Vendas − Gastos) com cor verde se positivo, vermelho se negativo
- Lista dos 5 boletos mais recentes com status

**Painel lateral (direita, 1/3):**
- Alertas de vencimento: boletos com vencimento em ≤5 dias (laranja) ou já vencidos e não pagos (vermelho)
- Filtros rápidos: Esta semana / Este mês / Personalizado

**Filtro padrão:** Este mês.

### 3. Lista de Boletos (`/admin/boletos`)

- Tabela com colunas: Fornecedor, Valor, Vencimento, Status, Descrição, Ações
- Filtros: Hoje / Esta semana / Este mês / Personalizado (data início–fim)
- Status: **PENDENTE** (amarelo) ou **PAGO** (verde)
- Botão **PAGO** visível apenas para boletos pendentes — ao clicar, registra `pago_em = hoje` e muda o status
- Botão para abrir a imagem do boleto arquivada
- Botão **+ Adicionar Boleto** no topo

### 4. Adicionar Boleto (`/admin/boletos/novo`)

Tela única com dois momentos:

**Momento 1 — Upload:**
- Área de upload com drag-and-drop ou seleção de arquivo/câmera
- Ao enviar a imagem, exibe spinner "Lendo boleto..."
- A imagem é enviada para `/api/ocr-boleto` (Vercel Function → Groq)

**Momento 2 — Revisão (mesma tela, campos aparecem):**
- Campos preenchidos automaticamente pelo OCR: Fornecedor, Valor, Vencimento
- Campos marcados com ícone ✦ indicando que foram lidos automaticamente
- Campo **Descrição** (medicamentos pedidos) — preenchimento manual obrigatório
- Botão **SALVAR BOLETO** — salva no Supabase e redireciona para a lista
- Se o OCR falhar, os campos ficam em branco para preenchimento manual

### 5. Registrar Venda (`/admin/vendas/nova`)

- Formulário simples: Data (padrão = hoje), Valor (R$), Observação (opcional)
- Botão **SALVAR**
- Sem OCR — entrada totalmente manual

---

## Fluxo de OCR

1. Frontend envia a imagem via `multipart/form-data` para `/api/ocr-boleto`
2. A Vercel Function converte a imagem para base64 e chama a Groq API com o modelo `meta-llama/llama-4-scout-17b-16e-instruct`
3. O prompt instrui o modelo a extrair: fornecedor/cedente, valor total, data de vencimento
4. A resposta é retornada como JSON: `{ fornecedor, valor, vencimento }`
5. Se a extração falhar ou o modelo retornar campos vazios, o frontend exibe os campos em branco para preenchimento manual

---

## Alertas de Vencimento

Calculados no frontend ao carregar o dashboard, consultando todos os boletos pendentes do Supabase:

- **Vermelho:** vencidos e não pagos (`vencimento < hoje` e `pago_em IS NULL`)
- **Laranja:** vencem nos próximos 5 dias (`vencimento BETWEEN hoje AND hoje+5` e `pago_em IS NULL`)
- **Sem alerta:** pagos ou com vencimento distante

---

## Segurança

- A rota `/admin` e todas as sub-rotas redirecionam para o login se não houver sessão ativa
- As tabelas `boletos` e `vendas` no Supabase têm Row Level Security (RLS) habilitada, permitindo acesso apenas ao usuário autenticado
- A chave da Groq API fica exclusivamente na Vercel Function (variável de ambiente), nunca exposta no frontend
- A chave pública do Supabase (anon key) é segura para uso no frontend com RLS ativo

---

## Estrutura de Arquivos

```
/admin/
  index.html         ← login
  dashboard.html     ← dashboard principal
  boletos.html       ← lista de boletos
  boleto-novo.html   ← adicionar boleto
  venda-nova.html    ← registrar venda
  admin.css          ← estilos do painel (separado do site público)
  admin.js           ← lógica compartilhada (auth, filtros, Supabase client)

/api/
  ocr-boleto.js      ← Vercel Serverless Function (OCR via Groq)
```

---

## Fora de Escopo

- Múltiplos usuários ou permissões diferenciadas
- Notificações por e-mail ou WhatsApp
- Integração com sistema de caixa da farmácia
- Relatórios exportáveis (PDF/Excel)
- Histórico de edições dos registros
