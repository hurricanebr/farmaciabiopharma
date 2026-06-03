# Biopharma Farmácia — Contexto para novo chat
> Gerado em 2026-06-03. Cole este arquivo inteiro como primeira mensagem do próximo chat.

---

## Projeto

Landing page estática (HTML + CSS + JS puro) da **Biopharma Farmácia**.

| Item | Valor |
|---|---|
| **Pasta local** | `C:\Users\cfcar\biopharma` |
| **Repositório GitHub** | https://github.com/hurricanebr/farmaciabiopharma |
| **URL produção** | https://farmaciabiopharma.vercel.app/ |
| **Preview local** | `npx serve -p 3004 C:\Users\cfcar\biopharma` → http://localhost:3004 |
| **Branch** | `main` |
| **Último commit** | `4f20728` — Reformulação completa para conversão / SEO local / Google Ads |

---

## Dados da Farmácia

| Campo | Valor |
|---|---|
| Nome | Biopharma Farmácia |
| Endereço | Av. Des. André da Rocha, 328 — Centro Histórico, Porto Alegre - RS, CEP 90050-160 |
| WhatsApp | +55 51 99469-7388 → https://wa.me/5551994697388 |
| Telefone fixo | (51) 3226-8979 |
| Google Meu Negócio | ✅ Perfil verificado (sem website vinculado ainda) |
| Nota Google | ⭐ 5,0 — 1 avaliação |
| Avaliação real | *"Farmácia com preço justo, e atendimento impecável! Tudo para sua saúde e bem estar!"* |
| Horário | Aberto · Fecha 21:00 |
| Maps (rotas) | https://www.google.com/maps/dir/?api=1&destination=Av.+Des.+André+da+Rocha,+328,+Porto+Alegre,+RS |

---

## Identidade Visual

```css
/* Paleta principal */
--bp-primary:    #173571;  /* azul corporativo */
--bp-blue-night: #0B2446;  /* hero, footer, CTA final */
--bp-blue-main:  #2B66D9;  /* destaques, ícones, badges */
--bp-light:      #F5F7FA;  /* fundo serviços */
--bp-blue-ice:   #DCE7F5;  /* fundo pills/badges */
--bp-gold:       #F9AB00;  /* estrelas Google */
--bp-whatsapp:   #25D366;  /* botão WhatsApp */
--bp-white:      #FFFFFF;

/* Tipografia */
Headings: Poppins 600/700
Body:     Inter 400/500/600

/* Bordas e sombras */
--radius-lg:   16px
--shadow-soft: 0 18px 45px rgba(11,36,70,.14)
```

**Logo**: `logo.png` — PNG com fundo branco. No **footer** exibir dentro de pill branca (`background: white; border-radius: 14px; padding: 10px 22px`). Na **navbar** funciona direto pois fundo é branco.

---

## Arquivos do Projeto

```
C:\Users\cfcar\biopharma\
├── index.html                  ← HTML completo (~530 linhas) — landing reformulada
├── style.css                   ← todos os estilos (~1250 linhas)
├── script.js                   ← comportamentos JS (~101 linhas)
├── logo.png                    ← logo oficial (PNG, fundo branco, 1182×329px)
├── banner.png / hero.jpg       ← assets de marca (dark blue, não usados como fundo)
├── identidade.png              ← asset de marca
├── endereco_cartao.png         ← asset de marca
├── mockup.png                  ← asset de marca
├── fachada.jpg                 ← ⚠️ AUSENTE — gerar em 1200×630px JPG ≤250KB
├── ebook-ifood-farma/          ← pasta local (não versionada no main)
├── .gitignore                  ← exclui .claude/ do versionamento
└── INICIO_PROXIMO_CHAT.md      ← este arquivo
```

---

## Seções do Site (ordem de exibição)

| # | Nome | Seletor | Estado |
|---|---|---|---|
| 1 | **Navbar** | `#navbar` | ✅ Fixa, branca, logo 78px, menu 6 links + botão CTA "Consultar no WhatsApp" |
| 2 | **Hero** | `#hero` | ✅ H1 local, subtítulo comercial, micro-info (endereço + horário), 2 CTAs |
| 3 | **Selos** | `.selos` | ✅ 5 selos (WA, Centro Histórico, produtos, retirada, rota Maps) |
| 4 | **Consulte pelo WhatsApp** | `#consulte` | ✅ Card azul destacado com CTA + mensagem pré-preenchida |
| 5 | **O que você encontra** | `#produtos` | ✅ 4 cards (sem injetáveis) |
| 6 | **Por que escolher** | `#diferenciais` | ✅ 4 diferenciais em grid |
| 7 | **Localização** | `#localizacao` | ✅ Mapa embed + card azul (endereço, tel, horário resumido, CTAs) |
| 8 | **Horário** | `#horarios` | ✅ Seção dedicada (Seg–Sex 09–20h, Sáb 09–18h, Dom fechado) + CTA WA |
| 9 | **Avaliações** | `#avaliacoes` | ✅ Card Google + avaliação real + botão "Avaliar a Biopharma" |
| 10 | **FAQ** | `#faq` | ✅ Acordeão 5 perguntas (injetáveis: indisponível) |
| 11 | **CTA Final** | `#contato` | ✅ Texto definitivo focado em WhatsApp |
| 12 | **Footer** | `.footer` | ✅ Razão social, CNPJ, endereço, horários, links úteis |
| 13 | **WA Flutuante** | `.whatsapp-float` | ✅ Desktop only (some no mobile) |
| 14 | **Barra fixa mobile** | `.sticky-cta` | ✅ Mobile only — WA + Como chegar na base |

---

## Pendências

| Prioridade | Item | Como fazer |
|---|---|---|
| 🟡 Média | **Foto da fachada** | Gerar/tirar foto → salvar como `fachada.jpg` em 1200×630px, JPG ≤250KB, na pasta `C:\Users\cfcar\biopharma\`. O slot já existe e fica oculto automaticamente enquanto o arquivo não existir. |
| 🟡 Média | **Google Meu Negócio** | Acessar business.google.com → Editar perfil → campo "Website" → digitar `https://farmaciabiopharma.vercel.app/` |
| 🟢 Baixa | **GA4/GTM** | Google Analytics 4. Todos os botões já têm `data-event` prontos. Instalar só quando quiser medir cliques e conversões. Pedir ao Claude para fazer. |
| 🟢 Baixa | **Instagram** | Adicionar link no footer quando criar o perfil. |
| 🟢 Baixa | **Logo transparente** | Converter `logo.png` para versão com fundo transparente (PNG sem fundo). |

## Rastreamento (botões já instrumentados para GA4/GTM)

| `data-event` | Botão |
|---|---|
| `click_whatsapp_header` | CTA do navbar |
| `click_whatsapp_hero` | Hero |
| `click_whatsapp_section` | Seção "Consulte" e barra mobile |
| `click_whatsapp_final` | CTA final |
| `click_maps_hero` | "Como chegar" no hero |
| `click_maps_location` | "Como chegar" na localização |
| `click_phone` | Telefone (51) 3226-8979 |
| `click_review_google` | Botões de avaliação Google |

## WhatsApp — mensagem pré-preenchida em todos os links

```
https://wa.me/5551994697388?text=Olá%2C%20gostaria%20de%20consultar%20a%20disponibilidade%20de%20um%20medicamento%2Fproduto.
```

---

## Git — Fluxo de Trabalho

O repositório **já está configurado**. Após qualquer mudança:

```powershell
cd C:\Users\cfcar\biopharma

# Ver o que mudou
git diff

# Commitar e subir
git add index.html style.css script.js   # (ou os arquivos alterados)
git commit -m "descrição da mudança"
git push
```

Ou simplesmente peça *"commita as alterações"* no chat que o Claude faz automaticamente.

---

## Skill UI/UX Pro Max — Instalado ✅

```powershell
# Já instalado — pronto para usar
python "C:\Users\cfcar\.claude\skills\ui-ux-pro-max\scripts\search.py" `
  "pharmacy healthcare local trust" --design-system -p "Biopharma"
```

---

## Como iniciar o próximo chat

**Cole este bloco como primeira mensagem:**

> Leia o arquivo `C:\Users\cfcar\biopharma\INICIO_PROXIMO_CHAT.md`.
> Ele contém todo o contexto do projeto Biopharma Farmácia.
> O repositório é https://github.com/hurricanebr/farmaciabiopharma — todas as alterações devem ser commitadas ao final.
> Quero continuar de onde paramos.
