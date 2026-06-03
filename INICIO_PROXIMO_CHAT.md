# Biopharma Farmácia — Contexto para novo chat
> Gerado em 2026-06-02. Cole este arquivo inteiro como primeira mensagem do próximo chat.

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
| **Último commit** | `93173de` — Refactor completo UI/UX |

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
├── index.html                  ← estrutura HTML completa (~390 linhas)
├── style.css                   ← todos os estilos (~1050 linhas)
├── script.js                   ← comportamentos JS (~101 linhas)
├── logo.png                    ← logo oficial (PNG, fundo branco)
├── banner.png                  ← asset de marca
├── identidade.png              ← asset de marca
├── endereco_cartao.png         ← asset de marca
├── mockup.png                  ← asset de marca
├── hero.jpg / hero.png         ← cópia do logo (não usada ativamente)
├── fachada.jpg                 ← ⚠️ AUSENTE — adicionar quando disponível
├── .gitignore                  ← exclui .claude/ do versionamento
└── INICIO_PROXIMO_CHAT.md      ← este arquivo
```

---

## Seções do Site (ordem de exibição)

| # | Nome | Seletor | Estado |
|---|---|---|---|
| 1 | **Navbar** | `#navbar` | ✅ Fixa, branca, logo 78px, links + botão WA |
| 2 | **Hero** | `#hero` | ✅ Fundo gradiente azul limpo (sem hero.jpg), watermark SVG, 3 badges, H1 curto, 2 CTAs |
| 3 | **Serviços** | `#servicos` | ✅ Grid 2×2 — injetáveis com destaque azul + badge |
| 4 | **Localização** | `#localizacao` | ✅ Mapa embed + card azul (endereço, tel, horário completo, CTAs) |
| 5 | **Avaliações** | `#avaliacoes` | ✅ Card Google Meu Negócio + avaliação real + trust pills |
| 6 | **CTA Final** | `#contato` | ⚠️ **LOREM IPSUM** — aguarda texto definitivo do cliente |
| 7 | **Footer** | `.footer` | ✅ Logo pill branca centralizado + endereço + copyright |
| 8 | **WA Flutuante** | `.whatsapp-float` | ✅ Fixo canto inferior direito |

---

## Pendências

| Prioridade | Item |
|---|---|
| 🔴 Alta | **CTA Final**: substituir Lorem Ipsum pelo texto definitivo |
| 🟡 Média | **Fachada**: adicionar `fachada.jpg` na pasta (slot já preparado no HTML) |
| 🟡 Média | **Google Business**: vincular `farmaciabiopharma.vercel.app` ao perfil GMB |
| 🟢 Baixa | **Otimização de imagem**: converter `logo.png` para versão com fundo transparente |

### ✅ Concluído neste chat (2026-06-02)
- **Menu mobile**: corrigido bug do item "Contato"/faixa cinza vazando sobre o logo (transform do menu fechado agora esconde altura total + offset da navbar).
- **Hero**: fundo trocado para gradiente azul sólido limpo (Variante 1) — removida `hero.jpg` que fazia a marca vazar atrás do texto. Subtítulo mais legível.
- **Horários**: adicionados (Seg–Sex 09–20h, Sáb 09–18h, Dom fechado) + `openingHoursSpecification` no schema.org.
- **Reformulação completa para conversão / SEO local / Google Ads** (mantendo o azul):
  - Removido Lorem Ipsum e o destaque de "Aplicação de injetáveis" (agora só no FAQ como indisponível).
  - Navbar: menu novo (Início · Produtos · Serviços · Localização · Horários) + CTA "Consultar no WhatsApp".
  - Hero reescrito (título/subtítulo locais, micro-info de endereço/horário).
  - Selos novos (sem injetáveis).
  - **Novas seções**: "Consulte pelo WhatsApp", "Por que escolher a Biopharma?", **Horário** dedicado, **FAQ** (acordeão), **barra fixa de WhatsApp no mobile**.
  - "O que você encontra na Biopharma" (4 cards, sem injetáveis).
  - Avaliações: avaliação real mantida + botões Ver no Google / Avaliar.
  - CTA final definitivo + Footer com razão social (Anelise Vargas Bicca LTDA - ME), CNPJ 06.960.588/0001-01, horários e links úteis.
  - Todos os CTAs de WhatsApp com mensagem pré-preenchida + `id`/`data-event` (click_whatsapp_*, click_maps_*, click_phone) prontos para GA4/GTM.
  - SEO: novo title/description/OG + Schema.org `FAQPage` e `legalName`/`taxID`.

### Pendências restantes
- 🟡 Foto da fachada (`fachada.jpg`) — slot pronto, oculta automaticamente até existir.
- 🟡 Vincular `farmaciabiopharma.vercel.app` ao Google Meu Negócio.
- 🟢 Instalar GA4/GTM e conectar aos `data-event` dos botões.
- 🟢 Link do Instagram no footer (quando houver perfil).
- 🟢 Logo `logo.png` com fundo transparente.

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
