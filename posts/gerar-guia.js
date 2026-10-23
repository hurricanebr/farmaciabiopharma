// Gera o "Guia de Bolso" em PDF (formato de celular) e a pasta para-o-celular/
// com as imagens de cada post numeradas na ordem de publicação.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');

const RAIZ = path.resolve(__dirname, '..');
const ARTES = path.join(__dirname, 'output');
const PASTA_CELULAR = path.join(__dirname, 'para-o-celular');
const PDF = path.join(RAIZ, 'Guia_Redes_Sociais_Biopharma.pdf');

const WHATS = '(51) 99469-7388';
const HASH = '#CentroHistoricoPOA #PortoAlegre #FarmaciaPortoAlegre #PoaCentro #Biopharma';

const url = p => 'file:///' + p.replace(/\\/g, '/');

function arte(n) {
  const prefixo = `post-${String(n).padStart(2, '0')}-`;
  const nome = fs.readdirSync(ARTES).find(f => f.startsWith(prefixo));
  return { titulo: `Arte ${n}`, arquivo: path.join(ARTES, nome), miniatura: path.join(ARTES, nome) };
}

// Para postar usa a foto original; no PDF usa a versão .webp (bem menor)
function foto(base, ext) {
  return {
    titulo: `Foto ${base}`,
    arquivo: path.join(RAIZ, `${base}.${ext}`),
    miniatura: path.join(RAIZ, `${base}.webp`),
  };
}

// ---------------------------------------------------------------------------
// CALENDÁRIO
// ---------------------------------------------------------------------------
const semanas = [
  {
    n: 1, periodo: '2 a 8/11', tema: 'Consulte antes de sair',
    aviso: 'Segunda 2/11 é Finados: loja fechada, sem post.',
    posts: [
      { dia: 'Ter 3/11', slug: '03-nov_ter', formato: 'Post', imgs: [arte(1)],
        legenda: `Atravessar o Centro e ouvir "esse acabou" no balcão não dá. Antes de sair, manda o nome do remédio ou do produto no WhatsApp ${WHATS} e a gente confere o estoque na hora. Se tiver, é só passar e retirar.` },
      { dia: 'Qua 4/11', formato: 'Reel R1', reel: 'R1',
        legenda: `Pergunta pelo WhatsApp, chega e retira. Funciona para remédio, higiene e beleza. ${WHATS}` },
      { dia: 'Sex 6/11', slug: '06-nov_sex', formato: 'Carrossel (2 imagens)', imgs: [foto('fachada', 'jpg'), arte(6)],
        legenda: 'Fica na Av. Des. André da Rocha, 328, no Centro Histórico. Abrimos de segunda a sexta das 9h às 20h e aos sábados das 9h às 18h. Salva este post para achar a gente quando precisar.' },
    ],
    stories: [
      'Ter: enquete "Você já perdeu viagem até uma farmácia?" (Sim / Nunca). Depois, outro Story com a figurinha de link do WhatsApp.',
      'Qui: foto do balcão + texto "Pergunte antes de sair" + figurinha de link do WhatsApp.',
    ],
    google: 'Arte 1, com o botão "Ligar".',
  },
  {
    n: 2, periodo: '9 a 15/11', tema: 'Novembro Azul e pressão',
    posts: [
      { dia: 'Seg 9/11', slug: '09-nov_seg', formato: 'Post', imgs: [arte(11)],
        legenda: 'Pressão alta costuma não dar sinal nenhum, e muito homem só descobre quando o problema já apareceu. Novembro é o mês da saúde do homem, e aqui dá para começar pelo básico: aferição de pressão gratuita e sem agendamento, de segunda a sábado. Av. Des. André da Rocha, 328.' },
      { dia: 'Qua 11/11', slug: '11-nov_qua', formato: 'Post (foto)', imgs: [foto('biopharma-ambiente-interno', 'jpeg')],
        legenda: 'Essa é a Biopharma por dentro. Uma farmácia de bairro no meio do Centro, com atendimento sem fila e sem pressa. Se ainda não conhece, passa para dar um oi.' },
      { dia: 'Sex 13/11', slug: '13-nov_sex', formato: 'Post', imgs: [arte(7)],
        legenda: `Amanhã é o Dia Mundial do Diabetes. Quem toma remédio todo dia sabe que o horário faz diferença no resultado. Uma dica simples é ligar o remédio a um hábito fixo, como o café da manhã, e deixar um alarme no celular. Ficou com dúvida sobre como tomar o seu? Pergunta no WhatsApp ${WHATS}.` },
    ],
    stories: [
      'Ter: figurinha de perguntas "Dúvida sobre pressão? Manda aqui".',
      'Qui: respostas da caixinha (texto simples sobre fundo azul).',
    ],
    google: 'Arte 11 (Novembro Azul).',
  },
  {
    n: 3, periodo: '16 a 22/11', tema: 'Injetáveis e feriado',
    aviso: 'Sexta 20/11 é Consciência Negra: loja fechada.',
    posts: [
      { dia: 'Seg 16/11', slug: '16-nov_seg', formato: 'Post', imgs: [arte(4)],
        legenda: `Recebeu receita de injeção e não sabe onde aplicar no Centro? A gente aplica aqui na farmácia. Não precisa agendar: é só vir com a receita. Se preferir, combine o horário pelo WhatsApp ${WHATS}.` },
      { dia: 'Qua 18/11', formato: 'Reel R2', reel: 'R2',
        legenda: 'Quanto tempo faz que você não mede a pressão? Aqui é de graça e não precisa marcar. O Novembro Azul é um bom lembrete.' },
      { dia: 'Qui 19/11', slug: '19-nov_qui', formato: 'Post', imgs: [arte(2)],
        legenda: `Amanhã, 20/11, é feriado e a farmácia fica fechada. No sábado abrimos normalmente, das 9h às 18h. Se precisar de algo, manda mensagem hoje no WhatsApp ${WHATS} e já confere se tem.` },
    ],
    stories: [
      'Ter: foto do espaço de aplicação (sem pacientes) + texto "Injetáveis sem agendamento".',
      'Qui: aviso do feriado. Repita no sábado 21/11: "Abertos hoje até as 18h".',
    ],
    google: 'Aviso do feriado. Confira se o horário especial de 20/11 está cadastrado.',
  },
  {
    n: 4, periodo: '23 a 29/11', tema: 'Avaliações e Black Friday',
    posts: [
      { dia: 'Seg 23/11', slug: '23-nov_seg', formato: 'Post', imgs: [arte(12)],
        legenda: '"Farmácia com preço justo, e atendimento impecável!" Essa avaliação no Google é de um cliente de verdade, e cada uma delas ajuda outras pessoas do Centro a encontrar a gente. Se você já foi atendido aqui, deixa a sua: o link está na bio, ou peça o QR code no balcão.' },
      { dia: 'Qua 25/11', slug: '25-nov_qua', formato: 'Post', imgs: [arte(5)],
        legenda: 'Fim de ano no Centro é correria. Para não perder o almoço na fila, manda no WhatsApp o que você precisa antes de sair do trabalho. A gente confere, você passa e retira. Abertos até as 20h de segunda a sexta.' },
      { dia: 'Sex 27/11', slug: '27-nov_sex', formato: 'Post', imgs: [arte(13)],
        legenda: `Viu um preço menor em outra farmácia nesta Black Friday? Mostra o anúncio para a gente no balcão ou pelo WhatsApp ${WHATS} que a gente cobre a oferta.`,
        nota: 'Antes de publicar, defina as regras (por exemplo: mesmo produto, anúncio válido, enquanto durar o estoque) e escreva no fim da legenda. Não cite nenhum remédio.' },
    ],
    stories: [
      'Ter: QR code de avaliação do Google + figurinha de link.',
      'Qui: enquete "O que você mais compra na farmácia?" (Remédio / Higiene e beleza).',
    ],
    google: 'Arte 13, como post do tipo "Oferta".',
  },
  {
    n: 5, periodo: '30/11 a 6/12', tema: 'Dezembro Laranja e verão',
    posts: [
      { dia: 'Seg 30/11', slug: '30-nov_seg', formato: 'Post (foto)', imgs: [foto('biopharma-produtos-higiene-beleza', 'jpeg')],
        legenda: `Dezembro Laranja é o mês de prevenção do câncer de pele, e o verão de Porto Alegre não perdoa. Protetor solar funciona quando é usado do jeito certo: FPS 30 ou mais, quantidade generosa e reaplicação a cada 2 horas ou depois de suar ou entrar na água. Temos várias opções na loja. Pergunta pelo seu no WhatsApp ${WHATS}.` },
      { dia: 'Qua 2/12', formato: 'Reel R3', reel: 'R3',
        legenda: 'Protetor, hidratante e repelente para enfrentar dezembro no Centro. Passa aqui ou confere pelo WhatsApp antes.' },
      { dia: 'Sex 4/12', slug: '04-dez_sex', formato: 'Post', imgs: [arte(9)],
        legenda: 'Medicamentos, higiene, beleza e aplicação de injetáveis no mesmo endereço, perto de quem mora e trabalha no Centro Histórico. Av. Des. André da Rocha, 328.' },
    ],
    stories: [
      'Ter 1/12 (opcional): Dia Mundial de Luta contra a AIDS, "Preservativos e autoteste de HIV disponíveis na farmácia". Só publique se a loja vende o autoteste.',
      'Qui: figurinha de quiz "De quanto em quanto tempo reaplicar o protetor?" (2 horas / 6 horas).',
    ],
    google: 'Foto de produtos + o texto do protetor solar.',
  },
  {
    n: 6, periodo: '7 a 13/12', tema: 'Calor e cuidados',
    posts: [
      { dia: 'Seg 7/12', slug: '07-dez_seg', formato: 'Carrossel (4 imagens)', imgs: [arte(14), arte(15), arte(16), arte(17)],
        legenda: 'O verão chegou e vale lembrar que calor estraga remédio. Salva para consultar e manda para quem cuida dos remédios da família.' },
      { dia: 'Qua 9/12', slug: '09-dez_qua', formato: 'Post', imgs: [arte(3)],
        legenda: 'As duas perguntas que mais escutamos sobre injetáveis: precisa agendar? Não, pode vir direto. Precisa de receita? Sim, traga a sua. A aplicação é feita aqui mesmo, no Centro Histórico.' },
      { dia: 'Sex 11/12', slug: '11-dez_sex', formato: 'Post (foto)', imgs: [foto('biopharma-interior-prateleiras', 'jpeg')],
        legenda: 'O que não pode faltar na farmacinha da sua casa? A nossa lista básica tem termômetro, curativo, soro fisiológico e protetor solar. Conta nos comentários o que entra na sua.' },
    ],
    stories: [
      'Ter: compartilhe o carrossel do calor no Story (ícone de avião de papel embaixo do post).',
      'Qui: enquete "Você guarda remédio no banheiro?" (Sim / Não).',
    ],
    google: 'Arte 3 (injetáveis).',
  },
  {
    n: 7, periodo: '14 a 20/12', tema: 'Férias e viagem',
    posts: [
      { dia: 'Seg 14/12', slug: '14-dez_seg', formato: 'Post', imgs: [arte(18)],
        legenda: `Quem usa remédio contínuo precisa planejar a viagem pela caixinha. Leve quantidade para alguns dias a mais, guarde na bagagem de mão e leve uma cópia da receita. Se precisar repor antes de ir, confirma pelo WhatsApp se temos ${WHATS}.` },
      { dia: 'Qua 16/12', formato: 'Reel R4', reel: 'R4',
        legenda: 'A farmacinha de viagem montada em 15 segundos. Tudo isso tem aqui no Centro Histórico.' },
      { dia: 'Sex 18/12', slug: '18-dez_sex', formato: 'Post', imgs: [arte(10)],
        legenda: 'Dezembro chegou e a gente quer agradecer a quem escolheu uma farmácia de bairro em 2026. Cada visita, mensagem e avaliação faz diferença para um negócio do nosso tamanho.' },
    ],
    stories: [
      'Ter: compartilhe o post da viagem (Arte 18) no Story.',
      'Qui: foto de bastidor das prateleiras.',
    ],
    google: 'Arte 18. IMPORTANTE: cadastre o horário especial de 24/12, 25/12, 31/12 e 1/1.',
  },
  {
    n: 8, periodo: '21 a 27/12', tema: 'Natal',
    aviso: 'Sexta 25/12 é Natal: loja fechada.',
    posts: [
      { dia: 'Seg 21/12', slug: '21-dez_seg', formato: 'Post', imgs: [arte(19)],
        legenda: `Anota os horários de fim de ano: 24/12 das [confirmar], 25/12 fechado, 26/12 das 9h às 18h, 31/12 das [confirmar] e 1/1 fechado. Precisando de algo antes, manda mensagem no WhatsApp ${WHATS}.`,
        nota: 'Troque os [confirmar] pelo horário real antes de agendar.' },
      { dia: 'Qua 23/12', slug: '23-dez_qua', formato: 'Post', imgs: [arte(20)],
        legenda: 'Feliz Natal da equipe da Biopharma. Obrigado por cada visita ao longo do ano. Nos vemos no sábado, 26/12, a partir das 9h.',
        nota: 'Se a loja estiver decorada, uma foto real da fachada funciona ainda melhor que a arte.' },
    ],
    stories: [
      'Ter: Arte 19 (horários).',
      'Qui 24/12: "Hoje abrimos até [confirmar]. Amanhã fechado."',
      'Sáb 26/12: "Abertos hoje das 9h às 18h".',
      'Extra, qua 30/12: horário de 31/12 e 1/1.',
    ],
    google: 'Arte 19 (horários).',
  },
];

const reels = {
  R1: {
    nome: 'Do WhatsApp ao balcão', duracao: '15 segundos',
    cenas: [
      ['0 a 3s', 'Celular com a mensagem "Oi! Vocês têm protetor FPS 50?"', 'Perguntei antes de sair'],
      ['3 a 7s', 'A resposta chegando: "Temos sim!"', 'Responderam na hora'],
      ['7 a 12s', 'Mãos entregando a sacola no balcão', 'Só passei e retirei'],
      ['12 a 15s', 'Fachada da loja', `${WHATS} · Centro Histórico`],
    ],
    dica: 'Encene a conversa entre dois celulares da equipe. Use um produto que não seja remédio.',
  },
  R2: {
    nome: 'Aferição de pressão', duracao: '15 segundos',
    cenas: [
      ['0 a 3s', 'Close do aparelho de pressão no balcão', 'Quando foi a última vez?'],
      ['3 a 9s', 'Braçadeira sendo colocada (só o braço de alguém da equipe)', 'Aferição grátis, sem agendamento'],
      ['9 a 13s', 'Close do visor', 'Leva poucos minutos'],
      ['13 a 15s', 'Fachada', 'Novembro Azul · Av. Des. André da Rocha, 328'],
    ],
    dica: 'Use o braço de alguém da equipe, nunca de cliente.',
  },
  R3: {
    nome: 'Prateleira de verão', duracao: '10 a 15 segundos',
    cenas: [
      ['0 a 6s', 'Celular passando devagar pela prateleira de protetores, hidratantes e repelentes', 'Seu kit de verão está aqui'],
      ['6 a 11s', 'Mãos colocando 3 itens numa sacola', '(sem texto)'],
      ['11 a 15s', 'Fachada', `Centro Histórico · ${WHATS}`],
    ],
    dica: 'Ande devagar, como se estivesse carregando um copo cheio. Movimento lento fica bonito.',
  },
  R4: {
    nome: 'Farmacinha de viagem', duracao: '15 segundos',
    cenas: [
      ['0 a 12s', 'Vista de cima do balcão. Mãos colocando um item por vez numa necessaire: protetor, repelente, curativos, termômetro, álcool em gel, soro fisiológico', 'O nome de cada item aparece quando ele entra'],
      ['12 a 15s', 'Necessaire fechada', 'Tudo aqui no Centro'],
    ],
    dica: 'Não mostre remédios. Se aparecer algum sem receita, a legenda precisa da frase obrigatória da ANVISA.',
  },
};

// ---------------------------------------------------------------------------
// PASTA para-o-celular
// ---------------------------------------------------------------------------
function montarPastaCelular() {
  fs.rmSync(PASTA_CELULAR, { recursive: true, force: true });
  fs.mkdirSync(PASTA_CELULAR, { recursive: true });
  let seq = 0;
  for (const s of semanas) {
    for (const p of s.posts) {
      if (!p.imgs) continue;
      seq++;
      p.imgs.forEach((img, i) => {
        const sufixo = p.imgs.length > 1 ? `_parte${i + 1}` : '';
        const nome = `${String(seq).padStart(2, '0')}_${p.slug}${sufixo}${path.extname(img.arquivo)}`;
        fs.copyFileSync(img.arquivo, path.join(PASTA_CELULAR, nome));
        img.nomeCelular = nome;
      });
    }
  }
  return seq;
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const passos = lista => `<ol class="passos">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const dica = t => `<div class="box dica"><b>💡 Dica</b>${t}</div>`;
const atencao = t => `<div class="box atencao"><b>⚠️ Atenção</b>${t}</div>`;
const check = lista => `<ul class="check">${lista.map(i => `<li>${i}</li>`).join('')}</ul>`;
const voltar = '<a class="voltar" href="#sumario">↑ voltar ao sumário</a>';

function secao(id, titulo, corpo, subtitulo = '') {
  return `<section class="secao" id="${id}">${voltar}<h1>${titulo}</h1>${subtitulo ? `<p class="lead">${subtitulo}</p>` : ''}${corpo}</section>`;
}

function cardPost(p) {
  const imgs = p.imgs
    ? `<div class="imgs n${p.imgs.length}">${p.imgs.map(i => `<img src="${url(i.miniatura)}">`).join('')}</div>
       <p class="arquivo">📁 No celular: ${p.imgs.map(i => `<b>${i.nomeCelular}</b>`).join(', ')}</p>`
    : `<div class="reel-ph">🎬 Vídeo: <a href="#reel-${p.reel}">roteiro do ${p.formato}</a></div>`;
  return `<div class="card">
    <div class="card-top"><span class="dia">${p.dia}</span><span class="fmt">${p.formato}</span></div>
    <p class="onde">📲 Instagram + Facebook · agendar para <b>12h</b></p>
    ${imgs}
    <p class="rotulo">Legenda (copie e cole):</p>
    <div class="legenda">${esc(p.legenda)}<br><br>${HASH}</div>
    ${p.nota ? atencao(p.nota) : ''}
  </div>`;
}

function paginaSemana(s) {
  const resumo = `<div class="resumo">
    ${s.posts.map(p => `<div>📲 <b>${p.dia}</b>: ${p.formato}</div>`).join('')}
    <div>📖 <b>Stories + Status</b>: ter e qui</div>
    <div>📍 <b>Google</b>: terça</div>
  </div>`;
  const corpo = `${s.aviso ? `<div class="box feriado">🚫 ${s.aviso}</div>` : ''}${resumo}
    ${s.posts.map(cardPost).join('')}
    <div class="card extra">
      <div class="card-top"><span class="dia">Stories e Status</span><span class="fmt">a mesma imagem nos dois</span></div>
      <ul>${s.stories.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
    <div class="card extra">
      <div class="card-top"><span class="dia">Google</span><span class="fmt">terça</span></div>
      <p>${s.google}</p>
    </div>`;
  return secao(`semana-${s.n}`, `Semana ${s.n} · ${s.periodo}`, corpo, `Tema: <b>${s.tema}</b>`);
}

function paginaReel(id) {
  const r = reels[id];
  return `<div class="card" id="reel-${id}">
    <div class="card-top"><span class="dia">${id}: ${r.nome}</span><span class="fmt">${r.duracao}</span></div>
    ${r.cenas.map(([t, img, txt]) => `<div class="cena"><span class="tempo">${t}</span><div><b>Filmar:</b> ${img}<br><b>Texto na tela:</b> ${txt}</div></div>`).join('')}
    ${dica(r.dica)}
  </div>`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
@page { size: 105mm 187mm; margin: 8mm 7mm 9mm; }
@page :first { margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Inter', sans-serif; font-size: 9.6pt; line-height: 1.5; color: #1d2a3a; }
h1, h2, h3 { font-family: 'Montserrat', sans-serif; color: #003558; line-height: 1.2; }
h1 { font-size: 15pt; margin: 2mm 0 2mm; padding-bottom: 2mm; border-bottom: 3px solid #FFD504; }
h2 { font-size: 11.5pt; margin: 5mm 0 2mm; color: #007BB6; }
h3 { font-size: 10pt; margin: 4mm 0 1mm; }
p { margin: 1.5mm 0; }
a { color: #007BB6; text-decoration: none; }
b { color: #003558; }
.secao { break-before: page; }
.lead { color: #4a5a6e; font-size: 10pt; }
.voltar { display: block; text-align: right; font-size: 7.5pt; color: #8a98aa; }

.capa { height: 187mm; background: linear-gradient(160deg, #003558 0%, #00507f 60%, #007BB6 100%); color: #fff; padding: 22mm 9mm 0; position: relative; }
.capa .logo { width: 70mm; background: #fff; border-radius: 4mm; padding: 2mm 3mm; display: block; }
.capa h1 { color: #fff; border: none; font-size: 22pt; margin: 14mm 0 3mm; }
.capa h1 span { color: #FFD504; }
.capa p { color: #cfe3f2; font-size: 10.5pt; }
.capa .pill { display: inline-block; background: #FFD504; color: #003558; font-weight: 700; border-radius: 20px; padding: 1.5mm 4mm; font-size: 9pt; margin-top: 6mm; }
.capa .rodape { position: absolute; bottom: 10mm; left: 9mm; right: 9mm; font-size: 8.5pt; color: #9fc2dc; }

.sumario a { display: flex; justify-content: space-between; padding: 2.2mm 0; border-bottom: 1px solid #e3eaf2; color: #003558; font-weight: 500; }
.sumario a span { color: #007BB6; }
.sumario .grupo { font-family: 'Montserrat'; font-weight: 800; color: #007BB6; font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; margin: 4mm 0 0; }

.box { border-radius: 3mm; padding: 2.5mm 3mm; margin: 2.5mm 0; font-size: 9pt; break-inside: avoid; }
.box b:first-child { display: block; margin-bottom: .8mm; }
.dica { background: #FFF6CC; border-left: 4px solid #FFD504; }
.atencao { background: #FDECEC; border-left: 4px solid #D9534F; }
.feriado { background: #FDECEC; font-weight: 600; color: #8a2a27; }
.info { background: #E6F3FA; border-left: 4px solid #007BB6; }

.passos { counter-reset: p; list-style: none; padding: 0; margin: 2mm 0; }
.passos li { counter-increment: p; position: relative; padding: 0 0 2.2mm 8.5mm; break-inside: avoid; }
.passos li::before { content: counter(p); position: absolute; left: 0; top: 0; width: 6mm; height: 6mm; border-radius: 50%; background: #007BB6; color: #fff; font-weight: 700; font-size: 8.5pt; display: flex; align-items: center; justify-content: center; }
.check { list-style: none; padding: 0; }
.check li { padding: 1mm 0 1mm 6.5mm; position: relative; break-inside: avoid; }
.check li::before { content: '☐'; position: absolute; left: 0; color: #007BB6; font-size: 11pt; line-height: 1.2; }
ul { padding-left: 5mm; margin: 1.5mm 0; }
li { margin: .8mm 0; }

.app { display: flex; gap: 3mm; padding: 2.5mm 0; border-bottom: 1px solid #e3eaf2; break-inside: avoid; }
.app .ico { font-size: 17pt; line-height: 1; width: 9mm; text-align: center; }
.app .nome { font-weight: 700; color: #003558; }
.app .tag { display: inline-block; font-size: 7pt; background: #E6F3FA; color: #007BB6; border-radius: 10px; padding: .3mm 2mm; margin-left: 1mm; font-weight: 600; }

.glossario dt { font-weight: 700; color: #003558; margin-top: 2mm; }
.glossario dd { margin: 0 0 0 0; color: #3a4a5c; }

.card { border: 1px solid #dbe5ef; border-radius: 3.5mm; padding: 3mm; margin: 3mm 0; break-inside: avoid; }
.card.extra { background: #F5F8FB; }
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5mm; gap: 2mm; }
.dia { font-family: 'Montserrat'; font-weight: 800; color: #003558; font-size: 11pt; }
.fmt { font-size: 7.5pt; background: #007BB6; color: #fff; border-radius: 10px; padding: .5mm 2.5mm; font-weight: 600; white-space: nowrap; }
.onde { font-size: 8.5pt; color: #4a5a6e; margin: 0 0 2mm; }
.imgs { display: grid; gap: 1.5mm; margin: 0 auto; }
.imgs.n1 { width: 56mm; }
.imgs.n2 { grid-template-columns: 1fr 1fr; width: 80mm; }
.imgs.n4 { grid-template-columns: 1fr 1fr; width: 66mm; }
.imgs img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 2mm; display: block; }
.arquivo { font-size: 7.5pt; color: #6b7a8c; text-align: center; margin: 1.5mm 0 0; word-break: break-all; }
.reel-ph { background: #003558; color: #fff; border-radius: 2.5mm; padding: 4mm; text-align: center; font-weight: 600; }
.reel-ph a { color: #FFD504; text-decoration: underline; }
.rotulo { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #007BB6; margin: 3mm 0 1mm; }
.legenda { background: #F5F8FB; border: 1px dashed #b9cadb; border-radius: 2.5mm; padding: 2.5mm 3mm; font-size: 9pt; }
.resumo { background: #003558; color: #fff; border-radius: 3mm; padding: 3mm; font-size: 8.8pt; }
.resumo b { color: #FFD504; }
.resumo div { padding: .6mm 0; }
.cena { display: flex; gap: 2.5mm; padding: 2mm 0; border-bottom: 1px solid #e3eaf2; font-size: 8.8pt; }
.cena .tempo { flex: 0 0 15mm; font-weight: 700; color: #007BB6; }
table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin: 2mm 0; }
th { background: #003558; color: #fff; text-align: left; padding: 1.5mm 2mm; }
td { padding: 1.5mm 2mm; border-bottom: 1px solid #e3eaf2; vertical-align: top; }
.modelo { background: #F5F8FB; border: 1px dashed #b9cadb; border-radius: 2.5mm; padding: 2mm 3mm; margin: 1.5mm 0; font-size: 8.8pt; }
`;

function montarHTML(totalPosts) {
  const logo = url(path.join(RAIZ, 'banner_site.png'));

  const capa = `<div class="capa">
    <img class="logo" src="${logo}">
    <h1>Guia de Bolso<br><span>Redes Sociais</span></h1>
    <p>Tudo o que você precisa para postar de 2/11 a 27/12/2026, explicado passo a passo, mesmo para quem nunca fez.</p>
    <span class="pill">1 a 2 horas por semana</span>
    <div class="rodape">Biopharma Farmácia · Av. Des. André da Rocha, 328 · Centro Histórico, Porto Alegre<br>WhatsApp ${WHATS} · @farmaciabiopharmapoa</div>
  </div>`;

  const sumario = `<section class="secao sumario" id="sumario"><h1>Sumário</h1>
    <p class="lead">Toque em um item para ir direto até ele.</p>
    <div class="grupo">Comece aqui</div>
    <a href="#como-funciona">Como funciona, em 1 minuto <span>›</span></a>
    <a href="#apps">Aplicativos para instalar <span>›</span></a>
    <a href="#glossario">Palavras que você vai ver <span>›</span></a>
    <a href="#preparacao">Antes de começar (26/10 a 1/11) <span>›</span></a>
    <a href="#rotina">Sua rotina toda semana <span>›</span></a>
    <div class="grupo">Tutoriais passo a passo</div>
    <a href="#t-passar">1. Passar as imagens para o celular <span>›</span></a>
    <a href="#t-copiar">2. Copiar uma legenda deste PDF <span>›</span></a>
    <a href="#t-agendar">3. Agendar post no Instagram e Facebook <span>›</span></a>
    <a href="#t-carrossel">4. Postar um carrossel <span>›</span></a>
    <a href="#t-stories">5. Fazer um Story com enquete ou link <span>›</span></a>
    <a href="#t-status">6. Postar no Status do WhatsApp <span>›</span></a>
    <a href="#t-google">7. Postar no Google e mudar horários <span>›</span></a>
    <a href="#t-reel">8. Gravar e editar um Reel <span>›</span></a>
    <a href="#t-bio">9. Colocar links na bio <span>›</span></a>
    <a href="#t-whats">10. Deixar o WhatsApp Business pronto <span>›</span></a>
    <a href="#t-responder">11. Responder comentários e mensagens <span>›</span></a>
    <a href="#t-seguranca">12. Proteger a conta contra golpes <span>›</span></a>
    <a href="#t-resultados">13. Ver se está dando resultado <span>›</span></a>
    <div class="grupo">Regras</div>
    <a href="#regras">O que não pode postar (ANVISA) <span>›</span></a>
    <div class="grupo">Calendário</div>
    ${semanas.map(s => `<a href="#semana-${s.n}">Semana ${s.n} · ${s.periodo} · ${s.tema} <span>›</span></a>`).join('')}
    <a href="#reels">Roteiros dos Reels <span>›</span></a>
    <div class="grupo">Ajuda</div>
    <a href="#problemas">Deu errado, e agora? <span>›</span></a>
    <a href="#dicas">Dicas de ouro <span>›</span></a>
  </section>`;

  const comoFunciona = secao('como-funciona', 'Como funciona, em 1 minuto', `
    <p>Você vai fazer <b>3 posts por semana</b> e cada um aparece em vários lugares ao mesmo tempo. As imagens e os textos já estão prontos neste guia: o seu trabalho é <b>copiar, colar e agendar</b>.</p>
    <table>
      <tr><th>Onde</th><th>Quando</th></tr>
      <tr><td>Instagram + Facebook (feed)</td><td>Seg, qua e sex, às 12h. Agenda tudo de uma vez.</td></tr>
      <tr><td>Stories do Instagram</td><td>Ter e qui</td></tr>
      <tr><td>Status do WhatsApp</td><td>Ter e qui (a mesma imagem do Story) + avisos de feriado</td></tr>
      <tr><td>Google (Perfil da Empresa)</td><td>Toda terça, 1 post</td></tr>
      <tr><td>Reel (vídeo curto)</td><td>1 a cada 2 semanas, no lugar de um post</td></tr>
    </table>
    ${dica('Por que às 12h? É a hora do almoço de quem trabalha no Centro, quando muita gente olha o celular. Depois de um mês, os números vão mostrar se outro horário funciona melhor.')}
    <h2>Os 3 jeitos de errar menos</h2>
    <ul>
      <li><b>Feito é melhor que perfeito.</b> Um post simples no dia certo vale mais que um post lindo que nunca sai.</li>
      <li><b>Agende na segunda de manhã.</b> Assim a semana anda sozinha.</li>
      <li><b>Responda rápido.</b> Quem comenta ou chama no direct quer resposta no mesmo dia.</li>
    </ul>`);

  const apps = secao('apps', 'Aplicativos para instalar', `
    <p>Todos são gratuitos. Procure pelo nome na <b>Play Store</b> (Android) ou na <b>App Store</b> (iPhone).</p>
    <div class="app"><div class="ico">📅</div><div><span class="nome">Meta Business Suite</span><span class="tag">essencial</span><br>Agenda os posts do Instagram e do Facebook juntos. É o app mais importante deste guia.</div></div>
    <div class="app"><div class="ico">📸</div><div><span class="nome">Instagram</span><span class="tag">essencial</span><br>Para Stories, responder comentários e ver os resultados.</div></div>
    <div class="app"><div class="ico">💬</div><div><span class="nome">WhatsApp Business</span><span class="tag">essencial</span><br>O WhatsApp da farmácia. Tem Status, mensagem automática e respostas rápidas.</div></div>
    <div class="app"><div class="ico">🗺️</div><div><span class="nome">Google Maps</span><span class="tag">essencial</span><br>É por ele que você cuida do Perfil da Empresa no Google: posts, horários, fotos e avaliações.</div></div>
    <div class="app"><div class="ico">📁</div><div><span class="nome">Google Drive</span><span class="tag">essencial</span><br>Para passar as imagens do computador para o celular.</div></div>
    <div class="app"><div class="ico">🎬</div><div><span class="nome">Edits</span> ou <span class="nome">CapCut</span><span class="tag">para Reels</span><br>Editam vídeos curtos: cortar, juntar e colocar texto. O Edits é do próprio Instagram.</div></div>
    <div class="app"><div class="ico">📄</div><div><span class="nome">Adobe Acrobat Reader</span><span class="tag">recomendado</span><br>Para abrir este guia e copiar as legendas com facilidade.</div></div>
    <div class="app"><div class="ico">🎨</div><div><span class="nome">Canva</span><span class="tag">opcional</span><br>Se um dia quiser mudar um texto numa arte ou criar uma nova.</div></div>
    <div class="app"><div class="ico">⏰</div><div><span class="nome">Google Agenda</span><span class="tag">opcional</span><br>Crie lembretes que se repetem: "Agendar posts" toda segunda às 9h e "Story + Status" toda terça e quinta.</div></div>
    ${dica('Use sempre a mesma conta Google no computador e no celular. Assim o que você salva num aparece no outro.')}`);

  const glossario = secao('glossario', 'Palavras que você vai ver', `<dl class="glossario">
    <dt>Feed</dt><dd>A página principal do perfil, onde ficam os posts para sempre.</dd>
    <dt>Post</dt><dd>Uma publicação no feed: imagem + texto.</dd>
    <dt>Legenda</dt><dd>O texto que vai embaixo da imagem.</dd>
    <dt>Carrossel</dt><dd>Um post com várias imagens que a pessoa passa para o lado.</dd>
    <dt>Story</dt><dd>Imagem ou vídeo que some depois de 24 horas. Aparece nas bolinhas do topo do Instagram.</dd>
    <dt>Reel</dt><dd>Vídeo curto em pé (vertical), de 15 a 30 segundos.</dd>
    <dt>Status</dt><dd>O "Story" do WhatsApp. Também some em 24 horas.</dd>
    <dt>Figurinha</dt><dd>Elementos que você cola no Story: enquete, pergunta, quiz, link.</dd>
    <dt>Hashtag</dt><dd>Palavra com # na frente (#PortoAlegre). Ajuda as pessoas a acharem o post.</dd>
    <dt>Bio</dt><dd>O texto curto no topo do perfil, com os links.</dd>
    <dt>Direct (DM)</dt><dd>Mensagem privada no Instagram.</dd>
    <dt>Agendar (ou programar)</dt><dd>Deixar um post pronto para sair sozinho no dia e na hora escolhidos.</dd>
    <dt>Alcance</dt><dd>Quantas pessoas diferentes viram o post.</dd>
    <dt>Salvamento</dt><dd>Quando alguém guarda o post para ver depois. É um ótimo sinal.</dd>
    <dt>Destaque</dt><dd>Stories que você fixa no perfil para não sumirem (ex.: "Horários").</dd>
    <dt>Perfil da Empresa</dt><dd>A ficha da farmácia que aparece no Google e no Google Maps.</dd>
  </dl>`);

  const preparacao = secao('preparacao', 'Antes de começar (26/10 a 1/11)', `
    <p>Faça isto uma vez só. Depois, cada semana fica bem mais rápida.</p>
    ${check([
      'Instalar os aplicativos essenciais (página anterior)',
      'Deixar o Instagram como <b>conta profissional</b> ligada à página do Facebook (ver tutorial 3)',
      'Passar a pasta de imagens para o celular (tutorial 1)',
      'Colocar os links do WhatsApp e da avaliação na bio (tutorial 9)',
      'Configurar mensagem automática e respostas rápidas no WhatsApp Business (tutorial 10)',
      'No Google: conferir os horários e cadastrar <b>"fechado" em 2/11 e 20/11</b> (tutorial 7)',
      'No Google: subir 3 fotos (fachada, interior, prateleiras)',
      'Ativar a verificação em duas etapas no Instagram e no Facebook (tutorial 12)',
      '<b>Sábado 31/10:</b> Story + Status "Segunda (2/11) é feriado e a farmácia fica fechada. Terça voltamos às 9h."',
      '<b>Gravar os clipes dos 4 Reels de uma vez</b>, de manhã com a loja vazia (uns 30 minutos)',
      'Confirmar o horário de 24/12 e 31/12',
      'Confirmar se a loja vende autoteste de HIV (para o Story opcional de 1/12)',
      'Definir as regras de "cobrimos a oferta" para a Black Friday',
    ])}`);

  const rotina = secao('rotina', 'Sua rotina toda semana', `
    <h2>Segunda de manhã (40 min)</h2>
    ${check([
      'Abrir a página da semana neste guia',
      'Agendar os 3 posts no Meta Business Suite, às 12h de cada dia',
      'Conferir em "Agendados" se os 3 estão lá',
    ])}
    <h2>Terça (10 min)</h2>
    ${check(['Fazer o post da semana no Google', 'Postar o Story no Instagram', 'Postar a mesma imagem no Status do WhatsApp'])}
    <h2>Quinta (5 min)</h2>
    ${check(['Story no Instagram', 'Status no WhatsApp'])}
    <h2>Todo dia (5 min)</h2>
    ${check(['Responder comentários, direct e WhatsApp', 'Responder avaliações novas no Google'])}
    <h2>Semanas de Reel (+ 30 min)</h2>
    ${check(['Editar o Reel com os clipes já gravados', 'Agendar junto com os outros posts'])}
    <h2>Sexta (5 min)</h2>
    ${check(['Contar quantas conversas no WhatsApp vieram do Instagram e do Google (tutorial 13)'])}`);

  const tPassar = secao('t-passar', '1. Passar as imagens para o celular', `
    <p>Todas as imagens das 8 semanas estão no computador, na pasta:</p>
    <div class="modelo">biopharma › posts › <b>para-o-celular</b></div>
    <p>Os arquivos estão numerados na ordem de postagem: o <b>01</b> é o primeiro post, o <b>02</b> o segundo, e assim por diante. O nome também diz o dia (ex.: <b>01_03-nov_ter.png</b>). Neste guia, cada post mostra o nome do arquivo dele.</p>
    <h2>Jeito mais fácil: Google Drive</h2>
    ${passos([
      'No computador, abra <b>drive.google.com</b> e entre com sua conta Google.',
      'Clique em <b>+ Novo</b> e depois em <b>Upload de pasta</b>.',
      'Escolha a pasta <b>para-o-celular</b> e espere terminar.',
      'No celular, abra o app <b>Google Drive</b> e entre na pasta.',
      'Toque na imagem, depois nos <b>três pontinhos (⋮)</b>.',
      '<b>Android:</b> toque em <b>Fazer download</b>. <b>iPhone:</b> toque em <b>Enviar uma cópia</b> e depois em <b>Salvar imagem</b>.',
      'Pronto: a imagem está na galeria de fotos.',
    ])}
    <h2>Outro jeito: WhatsApp</h2>
    ${passos([
      'No computador, abra <b>web.whatsapp.com</b> e escaneie o código com o celular.',
      'Comece uma conversa com <b>o seu próprio número</b> (aparece como "Você").',
      'Clique no clipe 📎, escolha as imagens e marque a opção <b>HD</b> antes de enviar.',
      'No celular, abra essa conversa e salve as imagens.',
    ])}
    ${atencao('Sem o HD, o WhatsApp reduz a qualidade e a imagem fica borrada no Instagram.')}
    ${dica('Passe as imagens de uma semana por vez, ou todas de uma vez no começo. Assim você não precisa do computador durante a semana.')}`);

  const tCopiar = secao('t-copiar', '2. Copiar uma legenda deste PDF', `
    ${passos([
      'Abra este PDF no <b>Adobe Acrobat Reader</b> ou no <b>Google Drive</b>.',
      'Encoste e <b>segure o dedo</b> sobre a primeira palavra da legenda até ela ficar marcada.',
      'Arraste o marcador do fim até a última hashtag.',
      'Toque em <b>Copiar</b>.',
      'No Instagram ou no Business Suite, segure o dedo no campo de texto e toque em <b>Colar</b>.',
    ])}
    ${dica('As legendas deste guia já vêm com as hashtags no final. Uma cópia só resolve tudo.')}
    ${atencao('Se o app quebrar as linhas de um jeito estranho, apague os espaços extras antes de publicar. Leia a legenda uma vez antes de agendar.')}`);

  const tAgendar = secao('t-agendar', '3. Agendar post no Instagram e Facebook', `
    <h2>Uma vez só: preparar a conta</h2>
    ${passos([
      'No Instagram, vá no seu perfil e toque nas <b>três linhas (☰)</b> no canto.',
      'Procure <b>Tipo de conta e ferramentas</b> e escolha <b>Mudar para conta profissional</b>, opção <b>Empresa</b>.',
      'Ainda no ☰, entre em <b>Central de Contas</b> e adicione a página do Facebook da farmácia. Isso liga as duas contas.',
    ])}
    <h2>Toda semana: agendar no Meta Business Suite</h2>
    ${passos([
      'Abra o <b>Meta Business Suite</b>.',
      'Toque em <b>+ Criar</b> (ou <b>Criar post</b>) e escolha <b>Post</b>.',
      'No topo, deixe marcados <b>Facebook e Instagram</b>.',
      'Toque em <b>Adicionar foto</b> e escolha a imagem do dia na galeria.',
      'Cole a legenda copiada deste guia.',
      'Toque em <b>Avançar</b> e escolha <b>Agendar</b> (ou "Opções de agendamento").',
      'Escolha a <b>data</b> e o horário <b>12:00</b>.',
      'Toque em <b>Agendar</b> e pronto.',
      'Repita para os outros 2 posts da semana.',
      'Para conferir, abra <b>Planejador</b> (ou <b>Conteúdo</b> › <b>Agendados</b>).',
    ])}
    ${dica('Os aplicativos mudam os nomes dos botões de vez em quando. Se não achar exatamente o nome daqui, procure algo parecido, como "Programar" no lugar de "Agendar".')}
    <h2>Plano B: agendar pelo próprio Instagram</h2>
    ${passos([
      'Toque no <b>+</b> e escolha <b>Post</b>.',
      'Escolha a imagem e toque em <b>Avançar</b>.',
      'Cole a legenda.',
      'Toque em <b>Mais opções</b> e ative <b>Programar este post</b>. Escolha dia e hora.',
      'Ative <b>Compartilhar no Facebook</b>, se aparecer.',
      'Toque em <b>Programar</b>.',
    ])}`);

  const tCarrossel = secao('t-carrossel', '4. Postar um carrossel', `
    <p>É igual a um post normal. A única diferença é escolher <b>várias imagens</b>.</p>
    ${passos([
      'No Business Suite, comece um post como no tutorial 3.',
      'Em <b>Adicionar foto</b>, toque nas imagens <b>na ordem certa</b>: parte1, parte2, parte3...',
      'Repare no número que aparece em cada imagem: ele mostra a ordem.',
      'Cole a legenda, agende e pronto.',
    ])}
    ${dica('No Instagram, toque no ícone de várias folhas (🗂️), chamado "Selecionar várias", antes de escolher as fotos.')}`);

  const tStories = secao('t-stories', '5. Fazer um Story com enquete ou link', `
    ${passos([
      'No Instagram, toque no <b>+</b> e escolha <b>Story</b>.',
      'Escolha uma foto da galeria ou tire uma na hora.',
      'Toque no ícone de <b>figurinha</b> (um quadrado com carinha 🙂) no topo.',
      'Escolha a figurinha: <b>Enquete</b>, <b>Perguntas</b>, <b>Quiz</b> ou <b>Link</b>.',
      'Escreva a pergunta e as opções. Na figurinha de link, cole o link do WhatsApp.',
      'Arraste a figurinha para um bom lugar.',
      'Toque em <b>Seu story</b> para publicar.',
    ])}
    <h2>Story só com texto</h2>
    <p>No Story, toque em <b>Aa</b> (ou <b>Criar</b>) para escrever sobre um fundo colorido. É ótimo para avisos.</p>
    <h2>Compartilhar um post no Story</h2>
    <p>Embaixo do post, toque no <b>avião de papel</b> e escolha <b>Adicionar ao story</b>.</p>
    ${dica('Crie <b>Destaques</b> no perfil para guardar os Stories importantes: "Horários", "Serviços" e "Avaliações". No seu perfil, toque em <b>Novo</b>, abaixo da bio.')}`);

  const tStatus = secao('t-status', '6. Postar no Status do WhatsApp', `
    ${passos([
      'Abra o <b>WhatsApp Business</b> e vá na aba <b>Atualizações</b>.',
      'Toque no ícone da <b>câmera</b> (ou do <b>lápis</b>, para só texto).',
      'Escolha a imagem na galeria.',
      'Se quiser, escreva uma frase curta embaixo.',
      'Toque em <b>enviar</b> ➤.',
    ])}
    ${atencao('Só vê o seu Status quem <b>salvou o número da farmácia</b> nos contatos. Peça no balcão: "salva nosso número para ver as novidades".')}
    ${dica('O Status não dá para agendar, tem que ser na hora. Faça logo depois do Story: a imagem é a mesma.')}`);

  const tGoogle = secao('t-google', '7. Postar no Google e mudar horários', `
    <p>Use a conta Google que é <b>dona</b> do Perfil da Empresa da farmácia.</p>
    <h2>Abrir o seu perfil</h2>
    ${passos([
      'Abra o <b>Google Maps</b>.',
      'Toque na sua <b>foto</b>, no canto de cima.',
      'Toque em <b>Seu Perfil da Empresa</b>.',
    ])}
    <p>Outro caminho: pesquise "<b>Biopharma Farmácia</b>" no Google com a conta logada e use o painel que aparece.</p>
    <h2>Fazer um post (toda terça)</h2>
    ${passos([
      'No perfil, toque em <b>Promover</b> e depois em <b>Adicionar atualização</b>.',
      'Adicione a imagem da semana.',
      'Escreva um texto curto (pode ser a legenda do post de segunda, sem as hashtags).',
      'Em botão, escolha <b>Ligar</b>, ou <b>Saiba mais</b> com o link do WhatsApp.',
      'Toque em <b>Publicar</b>.',
    ])}
    <h2>Horário especial (feriados)</h2>
    ${passos([
      'No perfil, toque em <b>Editar perfil</b> e depois em <b>Horário</b>.',
      'Procure <b>Horário especial</b> e toque em <b>Adicionar</b>.',
      'Escolha a data e marque <b>Fechado</b> (ou ajuste o horário).',
      'Salve.',
    ])}
    ${atencao('Datas para cadastrar: <b>2/11, 20/11, 24/12, 25/12, 31/12 e 1/1</b>. Assim o Google não mostra "aberto" quando a loja está fechada.')}
    ${dica('Responda <b>todas</b> as avaliações, inclusive as boas: "Obrigado, Maria! Volte sempre." O Google valoriza perfis ativos.')}`);

  const tReel = secao('t-reel', '8. Gravar e editar um Reel', `
    <h2>Gravando (sem aparecer o rosto)</h2>
    <ul>
      <li>Segure o celular <b>em pé</b> (vertical).</li>
      <li><b>Limpe a lente</b> com a camiseta antes. Faz muita diferença.</li>
      <li>Grave de manhã, com a loja vazia e as luzes acesas.</li>
      <li>Faça <b>cenas curtas, de 3 a 5 segundos</b>, e grave cada uma 2 vezes.</li>
      <li>Segure com as duas mãos e encoste os cotovelos no corpo para não tremer.</li>
      <li>Não grave clientes, receitas nem a tela do computador.</li>
    </ul>
    <h2>Editando no CapCut (ou Edits)</h2>
    ${passos([
      'Abra o app e toque em <b>Novo projeto</b>.',
      'Escolha os vídeos <b>na ordem do roteiro</b> e toque em <b>Adicionar</b>.',
      'Para cortar, toque no clipe e arraste as bordas.',
      'Toque em <b>Texto</b> › <b>Adicionar texto</b> e escreva a frase da cena.',
      'Arraste o texto na linha do tempo para aparecer só na cena certa.',
      'No CapCut, apague o clipe de encerramento que o app coloca no final.',
      'Toque em <b>Exportar</b> (1080p). O vídeo vai para a galeria.',
    ])}
    <h2>Publicando</h2>
    ${passos([
      'No Instagram, toque no <b>+</b> e escolha <b>Reel</b>.',
      'Escolha o vídeo editado.',
      'Toque em <b>Áudio</b> e escolha uma música (as marcadas como "em alta" ajudam).',
      'Toque em <b>Avançar</b>, cole a legenda e publique. Também dá para agendar no Business Suite, escolhendo <b>Reel</b> no lugar de Post.',
    ])}
    ${dica('Escolha a música no próprio Instagram, não no CapCut. Música colocada fora do Instagram pode ser silenciada por direitos autorais.')}`);

  const tBio = secao('t-bio', '9. Colocar links na bio', `
    ${passos([
      'No Instagram, vá no perfil e toque em <b>Editar perfil</b>.',
      'Toque em <b>Links</b> › <b>Adicionar link externo</b>.',
      'Cole o link do WhatsApp (abaixo) e dê o título <b>WhatsApp</b>.',
      'Repita com o link de avaliação do Google, com o título <b>Avalie no Google</b>.',
    ])}
    <p><b>Link do WhatsApp</b> (já com mensagem pronta):</p>
    <div class="modelo" style="word-break:break-all">https://wa.me/5551994697388?text=Oi!%20Vi%20no%20Instagram%20e%20queria%20saber%20se%20voc%C3%AAs%20t%C3%AAm%20</div>
    <p><b>Link para o Google</b> (use no botão do post do Google):</p>
    <div class="modelo" style="word-break:break-all">https://wa.me/5551994697388?text=Oi!%20Vi%20no%20Google%20e%20queria%20saber%20se%20voc%C3%AAs%20t%C3%AAm%20</div>
    <p><b>Link de avaliação:</b> no Perfil da Empresa, toque em <b>Pedir avaliações</b> (ou "Compartilhar perfil") e copie o link. É o mesmo do QR code do balcão.</p>
    ${dica('A mensagem pronta mostra de onde o cliente veio: quem clicar no Instagram chega dizendo "Vi no Instagram".')}`);

  const tWhats = secao('t-whats', '10. Deixar o WhatsApp Business pronto', `
    <p>No WhatsApp Business, toque nos <b>três pontinhos (⋮)</b> › <b>Ferramentas comerciais</b> (no iPhone, <b>Configurações</b> › <b>Ferramentas comerciais</b>).</p>
    <h2>Mensagem de ausência</h2>
    <p>Responde sozinha quando a loja está fechada. Ative e programe para "fora do horário comercial".</p>
    <div class="modelo">Oi! A Biopharma está fechada agora. Atendemos de segunda a sexta, das 9h às 20h, e aos sábados, das 9h às 18h. Assim que abrirmos, respondemos sua mensagem.</div>
    <h2>Mensagem de saudação</h2>
    <div class="modelo">Oi! Aqui é a Biopharma Farmácia, no Centro Histórico. Me diga o nome do produto ou remédio que a gente confere se tem.</div>
    <h2>Respostas rápidas</h2>
    <p>Crie atalhos. Depois, é só digitar <b>/</b> numa conversa e escolher.</p>
    <table>
      <tr><th>Atalho</th><th>Mensagem</th></tr>
      <tr><td>/endereco</td><td>Estamos na Av. Des. André da Rocha, 328, Centro Histórico. Seg a sex 9h–20h, sáb 9h–18h.</td></tr>
      <tr><td>/injetavel</td><td>Aplicamos injetáveis aqui na farmácia. Não precisa agendar, é só trazer a receita.</td></tr>
      <tr><td>/pagamento</td><td>Aceitamos dinheiro, débito, crédito e PIX. Não trabalhamos com convênio.</td></tr>
      <tr><td>/avaliacao</td><td>Obrigado pela visita! Se puder, deixe sua avaliação no Google: [cole o link]</td></tr>
    </table>
    ${dica('Use <b>Etiquetas</b> para marcar as conversas "Veio do Instagram" e "Veio do Google". Fica fácil contar no fim da semana.')}`);

  const tResponder = secao('t-responder', '11. Responder comentários e mensagens', `
    <ul>
      <li><b>Responda no mesmo dia</b>, de preferência em poucas horas.</li>
      <li><b>Elogio:</b> agradeça pelo nome. "Obrigado, João! Volte sempre."</li>
      <li><b>Pergunta sobre produto:</b> "Te chamamos no direct!" e responda no privado.</li>
      <li><b>Pergunta sobre remédio com receita ou tarja preta:</b> nunca responda nos comentários. Diga "Te respondemos no direct" e continue no privado.</li>
      <li><b>Crítica:</b> não apague e não discuta. Responda com calma: "Sentimos muito, queremos resolver. Pode nos chamar no WhatsApp ${WHATS}?"</li>
      <li><b>Spam ou ofensa:</b> pode ocultar ou excluir.</li>
    </ul>
    ${dica('Comentário respondido gera mais alcance para o post. Vale a pena responder até um simples "❤️".')}`);

  const tSeguranca = secao('t-seguranca', '12. Proteger a conta contra golpes', `
    ${atencao('O Instagram e o Facebook <b>nunca</b> mandam direct ou e-mail pedindo senha ou dizendo "sua conta será desativada, clique aqui". Isso é golpe. Não clique e apague.')}
    <h2>Ativar a verificação em duas etapas</h2>
    ${passos([
      'No Instagram, vá em ☰ › <b>Central de Contas</b>.',
      'Toque em <b>Senha e segurança</b> › <b>Autenticação de dois fatores</b>.',
      'Escolha a conta e o método: <b>WhatsApp</b> ou <b>SMS</b> são os mais fáceis.',
      'Siga as instruções e guarde os <b>códigos de backup</b> num lugar seguro.',
    ])}
    <p>Faça o mesmo no Google (myaccount.google.com › Segurança › Verificação em duas etapas).</p>
    ${dica('Não compre seguidores e não use apps que prometem "mais curtidas". Eles pedem sua senha e podem fazer a conta ser bloqueada.')}`);

  const tResultados = secao('t-resultados', '13. Ver se está dando resultado', `
    <h2>Instagram</h2>
    ${passos([
      'No perfil, toque em <b>Painel profissional</b>.',
      'Veja <b>contas alcançadas</b> e <b>visitas ao perfil</b>.',
      'Em cada post, toque em <b>Ver insights</b> para ver alcance, salvamentos e compartilhamentos.',
    ])}
    <h2>Google</h2>
    <p>No Perfil da Empresa, toque em <b>Desempenho</b>: ligações, pedidos de rota e cliques.</p>
    <h2>WhatsApp (o mais importante)</h2>
    <p>Toda sexta, pesquise <b>"Vi no Instagram"</b> e <b>"Vi no Google"</b> nas conversas e anote quantas apareceram. Anote também no app <b>Notas</b> do celular:</p>
    <div class="modelo">Semana 1 · Instagram: __ conversas · Google: __ · Avaliações novas: __ · Post com mais salvamentos: ______</div>
    <h2>Quando revisar</h2>
    <p><b>27/11</b> (fim de novembro) e <b>27/12</b>. Olhe os 3 posts que mais trouxeram conversas e salvamentos e faça mais posts parecidos com eles.</p>
    ${dica('Nas primeiras semanas os números são baixos mesmo. Isso é normal. O que conta é a constância.')}`);

  const regras = secao('regras', 'O que não pode postar (ANVISA)', `
    <p>Propaganda de farmácia tem regras (RDC 96/2008 da ANVISA). Para não levar multa:</p>
    ${atencao('<b>Nunca anuncie remédio que precisa de receita</b> (tarja vermelha ou preta). Isso vale para nome, foto da caixa e preço. Mesmo sendo o carro-chefe da loja, a tarja preta não pode aparecer nas redes.')}
    <ul>
      <li>Se aparecer <b>remédio sem receita</b> (analgésico, antiácido...) em foto ou vídeo, a legenda precisa ter: <b>"SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO."</b></li>
      <li>O mais fácil é mostrar só higiene, beleza, protetor solar, curativo e termômetro.</li>
      <li>Nada de "leve 3, pague 2" em remédio, nem promessa de cura.</li>
      <li>Dicas de saúde devem ser gerais e terminar com "na dúvida, fale com seu médico ou com a gente".</li>
    </ul>
    <h2>Pessoas e privacidade</h2>
    <ul>
      <li>Não mostre clientes, receitas, documentos nem a tela do computador.</li>
      <li>Se alguém da equipe aparecer (mesmo só o braço), peça autorização antes.</li>
    </ul>
    ${dica('Todos os posts deste guia já seguem essas regras.')}`);

  const paginaReels = secao('reels', 'Roteiros dos Reels', `
    <p>Grave todos de uma vez na semana de preparação. Todos em pé (vertical), sem rosto, com texto na tela, porque a maioria assiste sem som.</p>
    ${Object.keys(reels).map(paginaReel).join('')}`);

  const problemas = secao('problemas', 'Deu errado, e agora?', `
    <h3>Esqueci de postar no dia.</h3><p>Sem problema: poste no dia seguinte. Só não pule o aviso de feriado.</p>
    <h3>Postei com um erro na legenda.</h3><p>No post, toque nos <b>três pontinhos</b> › <b>Editar</b>, corrija e salve.</p>
    <h3>Postei a imagem errada.</h3><p>Não dá para trocar a imagem. Toque nos três pontinhos › <b>Excluir</b> e poste de novo.</p>
    <h3>Ninguém curtiu.</h3><p>No começo é assim mesmo. Continue por pelo menos 4 semanas antes de julgar.</p>
    <h3>Alguém pediu remédio com receita nos comentários.</h3><p>Responda "Te chamamos no direct 😊" e continue no privado. Nunca fale nome nem preço em público.</p>
    <h3>Recebi uma avaliação ruim no Google.</h3><p>Responda com educação, peça desculpas e convide para resolver no WhatsApp. Uma resposta educada passa confiança para quem lê.</p>
    <h3>Não acho um botão do tutorial.</h3><p>Os apps mudam de vez em quando. Procure nomes parecidos, ou pesquise no YouTube "como agendar post no Meta Business Suite 2026".</p>
    <h3>Esqueci a senha.</h3><p>Na tela de entrada, toque em <b>Esqueceu a senha?</b> e use o e-mail ou o celular cadastrado.</p>`);

  const dicas = secao('dicas', 'Dicas de ouro', `
    <ul>
      <li><b>Constância vence perfeição.</b> 3 posts por semana durante 8 semanas valem mais que 10 posts numa semana só.</li>
      <li><b>Foto real vale ouro.</b> A loja, a fachada e as prateleiras de verdade passam mais confiança que imagem de banco.</li>
      <li><b>Peça avaliação</b> a todo cliente que sair satisfeito. Mostre o QR code no balcão.</li>
      <li><b>Peça para salvarem o número</b> do WhatsApp. É assim que o Status chega até eles.</li>
      <li><b>Repita o que funciona.</b> Se um post trouxe muitas mensagens, faça outro parecido.</li>
      <li><b>O objetivo não é viralizar.</b> É a farmácia ser lembrada por quem mora e trabalha no Centro.</li>
    </ul>
    <div class="box info"><b>📞 Contatos da farmácia (para copiar)</b>WhatsApp ${WHATS}<br>Av. Des. André da Rocha, 328 · Centro Histórico, Porto Alegre<br>Seg a sex 9h–20h · Sáb 9h–18h · Domingos e feriados fechado<br>@farmaciabiopharmapoa</div>
    <p style="text-align:center;margin-top:6mm;color:#8a98aa">Total de posts com imagem neste guia: ${totalPosts}</p>`);

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}</style></head><body>
    ${capa}${sumario}${comoFunciona}${apps}${glossario}${preparacao}${rotina}
    ${tPassar}${tCopiar}${tAgendar}${tCarrossel}${tStories}${tStatus}${tGoogle}${tReel}${tBio}${tWhats}${tResponder}${tSeguranca}${tResultados}
    ${regras}${semanas.map(paginaSemana).join('')}${paginaReels}${problemas}${dicas}
  </body></html>`;
}

async function main() {
  const total = montarPastaCelular();
  // impede o telefone de quebrar no meio da linha
  const html = montarHTML(total).split(WHATS).join(`<span style="white-space:nowrap">${WHATS}</span>`);
  const tmp = path.join(os.tmpdir(), 'guia-biopharma.html');
  fs.writeFileSync(tmp, html, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url(tmp), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: PDF, printBackground: true, preferCSSPageSize: true });
  await browser.close();

  console.log(`✓ ${fs.readdirSync(PASTA_CELULAR).length} imagens em ${PASTA_CELULAR}`);
  console.log(`✓ PDF: ${PDF} (${(fs.statSync(PDF).size / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch(err => {
  console.error('Erro ao gerar o guia:', err);
  process.exit(1);
});
