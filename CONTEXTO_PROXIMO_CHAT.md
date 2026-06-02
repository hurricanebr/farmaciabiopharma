# Contexto — Biopharma Farmácia · Landing Page

> Arquivo gerado em 2026-06-02 para continuar o desenvolvimento em outro chat.

---

## 1. Projeto

**Site estático** (HTML + CSS + JS puro, sem frameworks) da **Biopharma Farmácia**.

| Item | Valor |
|---|---|
| Pasta local | `C:\Users\cfcar\biopharma` |
| URL de produção | https://farmaciabiopharma.vercel.app/ |
| Preview local | `npx serve -p 3004 .` → http://localhost:3004 |
| Arquivos principais | `index.html`, `style.css`, `script.js`, `logo.png` |

---

## 2. Dados da Farmácia

| Campo | Valor |
|---|---|
| Nome oficial | Biopharma Farmácia |
| Endereço | Av. Des. André da Rocha, 328 — Centro Histórico, Porto Alegre - RS, 90050-160 |
| WhatsApp principal | +55 51 99469-7388 → https://wa.me/5551994697388 |
| Telefone fixo | (51) 3226-8979 |
| Google Meu Negócio | ✅ Perfil verificado |
| Nota Google | 5,0 ⭐⭐⭐⭐⭐ (1 avaliação) |
| Avaliação real | *"Farmácia com preço justo, e atendimento impecável! Tudo para sua saúde e bem estar!"* |
| Horário | Aberto · Fecha 21:00 |
| Maps (rotas) | https://www.google.com/maps/dir/?api=1&destination=Av.+Des.+André+da+Rocha,+328,+Porto+Alegre,+RS |

---

## 3. Identidade Visual

```css
:root {
  --bp-primary:     #173571;   /* azul corporativo */
  --bp-blue-night:  #0B2446;   /* azul noite (hero, footer) */
  --bp-blue-main:   #2B66D9;   /* azul de destaque */
  --bp-light:       #F5F7FA;   /* fundo claro (serviços) */
  --bp-blue-ice:    #DCE7F5;   /* fundo pills/badges */
  --bp-gold:        #F9AB00;   /* estrelas */
  --bp-whatsapp:    #25D366;   /* botão WhatsApp */
}
```

- **Fonte headings**: Poppins 600/700
- **Fonte body**: Inter 400/500/600
- **Raio de borda**: `--radius-lg: 16px`
- **Sombra padrão**: `--shadow-soft: 0 18px 45px rgba(11,36,70,.14)`
- **Logo**: `logo.png` — PNG com fundo branco (exibir em pill branca no footer)

---

## 4. Seções do Site (ordem de exibição)

| # | Seção | ID / Classe | Observações |
|---|---|---|---|
| 1 | **Navbar** | `#navbar` | Fixa, branca, logo.png 78px, links + botão WA |
| 2 | **Hero** | `#hero .hero` | Azul escuro, watermark SVG, 3 badges, H1 + subtítulo curto, 2 CTAs |
| 3 | **Serviços** | `#servicos .services` | Grid 2×2: Injetáveis *(destaque)*, Medicamentos, Atend. Farmacêutico, Conveniência |
| 4 | **Localização** | `#localizacao .location` | Mapa embed + card azul (endereço, WhatsApp, horário, 2 CTAs) |
| 5 | **Avaliações** | `#avaliacoes .reviews` | 2 cards: Google Meu Negócio + avaliação real + trust pills |
| 6 | **CTA Final** | `#contato .final-cta` | ⚠️ **Texto LOREM IPSUM** (aguarda conteúdo definitivo) |
| 7 | **Footer** | `.footer` | Logo.png em pill branca centralizado + endereço + copyright |
| 8 | **WA Flutuante** | `.whatsapp-float` | Botão fixo canto inferior direito |

---

## 5. Estado Atual do Código

### ✅ Implementado e funcionando
- Paleta azul premium completa com CSS custom properties
- Hero limpo: título bold + subtítulo de 1 linha + 3 badges + 2 CTAs
- Watermark SVG no hero e no CTA final
- Cards de serviços com featured (injetáveis com borda azul + badge "Serviço disponível")
- Seção de localização com mapa embed + card de contato azul
- Avaliações: Google Meu Negócio verificado + avaliação real + trust pills
- Footer com logo idêntico ao navbar (pill branca) + tudo centralizado
- Botão WhatsApp flutuante
- Responsividade (mobile 375px, tablet 768px, desktop)
- Acessibilidade: skip-link, focus-visible, aria-labels, reduced-motion
- SEO: schema.org Pharmacy, Open Graph, canonical, meta description
- Favicon SVG inline (cruz farmacêutica)
- Preload do logo para LCP

### ⚠️ Pendente / Para fazer
- **CTA Final**: substituir LOREM IPSUM pelo texto definitivo quando aprovado
- **Fachada**: adicionar `fachada.jpg` na pasta quando a foto estiver disponível (slot já existe no HTML — a seção some automaticamente se o arquivo não existir)
- **Google Business — website**: vincular o site `farmaciabiopharma.vercel.app` ao perfil do Google Meu Negócio (atualmente aparece "Adicionar website")
- **Horário de funcionamento**: confirmar horário completo da semana e atualizar o card de localização
- **Deploy**: publicar versão atualizada no Vercel

---

## 6. Arquivos e Estrutura

```
C:\Users\cfcar\biopharma\
├── index.html          ← estrutura completa (≈ 390 linhas)
├── style.css           ← todos os estilos (≈ 1050 linhas)
├── script.js           ← navbar scroll, menu mobile, fade-in, smooth scroll
├── logo.png            ← logo oficial Biopharma (PNG com fundo branco)
├── fachada.jpg         ← ⚠️ AUSENTE — adicionar quando disponível
├── hero.jpg            ← cópia do logo.png (não está sendo usado ativamente)
└── .claude/
    └── launch.json     ← npx serve -p 3004 .
```

---

## 7. Skill UI/UX Pro Max

O skill de design intelligence foi **instalado com sucesso** nesta sessão.

```bash
# Instalação (já feita)
npm install -g uipro-cli
uipro init --ai claude

# Uso (próximo chat pode usar diretamente)
python "C:\Users\cfcar\.claude\skills\ui-ux-pro-max\scripts\search.py" \
  "pharmacy healthcare local trust" --design-system -p "Biopharma"
```

- **Localização dos scripts**: `C:\Users\cfcar\.claude\skills\ui-ux-pro-max\scripts\`
- **Localização dos dados**: `C:\Users\cfcar\.claude\skills\ui-ux-pro-max\data\`
- O skill está registrado e ativo — pode ser invocado via `/ui-ux-pro-max` no próximo chat

---

## 8. Comandos Úteis para o Próximo Chat

```bash
# Iniciar preview local
npx serve -p 3004 "C:\Users\cfcar\biopharma"
# → http://localhost:3004

# Fazer deploy no Vercel
cd C:\Users\cfcar\biopharma && vercel --prod

# Rodar design system para Biopharma
python "C:\Users\cfcar\.claude\skills\ui-ux-pro-max\scripts\search.py" \
  "pharmacy healthcare local Porto Alegre" --design-system -p "Biopharma"
```

---

## 9. Histórico de Sessões Relevantes

| Sessão | ID | Resumo |
|---|---|---|
| Sessão principal | `45866bae-0ce1-44e9-a9f0-f59631031b80` | Refactor completo UI/UX blue identity |
| Sessão atual | `(ver .claude/sessions/)` | 4 ajustes: remove card, Google reviews, lorem ipsum CTA, footer logo |

Transcripts em: `C:\Users\cfcar\.claude\projects\C--Users-cfcar-biopharma\`
