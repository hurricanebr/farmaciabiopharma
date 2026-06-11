const path = require('path');

const ASSETS = path.resolve(__dirname, '..');
const LOGO = `file:///${ASSETS.replace(/\\/g, '/')}/banner_site.png`;
const FACHADA = `file:///${ASSETS.replace(/\\/g, '/')}/fachada.jpg`;

const BLUE = '#007BB6';
const YELLOW = '#F5C518';
const WHITE = '#FFFFFF';

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1080px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  .container {
    width: 1080px;
    height: 1080px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 90px 100px;
  }
  .icone {
    font-size: 90px;
    margin-bottom: 36px;
    line-height: 1;
  }
  .titulo {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 52px;
    line-height: 1.2;
    white-space: pre-line;
    margin-bottom: 24px;
  }
  .subtexto {
    font-family: 'Inter', sans-serif;
    font-size: 26px;
    line-height: 1.5;
    white-space: pre-line;
    margin-bottom: 40px;
  }
  .cta-box {
    padding: 18px 48px;
    border-radius: 50px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 28px;
  }
  .rodape {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;
    background: rgba(0,0,0,0.25);
  }
  .rodape img {
    height: 40px;
    object-fit: contain;
  }
  .rodape span {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: ${WHITE};
    opacity: 0.85;
  }
  .detalhe-circulo {
    position: absolute;
    top: -180px;
    right: -180px;
    width: 560px;
    height: 560px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    pointer-events: none;
  }
  .detalhe-circulo-2 {
    position: absolute;
    bottom: -200px;
    left: -150px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    pointer-events: none;
  }
`;

function educativo(post) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${BASE_CSS}
.container { background: ${BLUE}; }
.titulo { color: ${WHITE}; }
.subtexto { color: rgba(255,255,255,0.85); }
.cta-box { background: ${YELLOW}; color: ${BLUE}; }
.barra-topo {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 8px;
  background: ${YELLOW};
}
</style>
</head>
<body>
<div class="container">
  <div class="barra-topo"></div>
  <div class="detalhe-circulo"></div>
  <div class="detalhe-circulo-2"></div>
  <div class="icone">${post.icone}</div>
  <div class="titulo">${post.titulo}</div>
  <div class="subtexto">${post.subtexto}</div>
  <div class="cta-box">${post.cta}</div>
  <div class="rodape">
    <img src="${LOGO}" alt="Biopharma">
    <span>@farmaciabiopharmapoa</span>
  </div>
</div>
</body>
</html>`;
}

function servico(post) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${BASE_CSS}
.container {
  background-image: url('${FACHADA}');
  background-size: cover;
  background-position: center;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 89, 140, 0.82);
}
.content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.tag {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${YELLOW};
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.titulo { color: ${WHITE}; }
.subtexto { color: rgba(255,255,255,0.88); }
.cta-box { background: ${YELLOW}; color: ${BLUE}; }
.faixa {
  width: 80px;
  height: 5px;
  background: ${YELLOW};
  margin: 0 auto 32px;
}
</style>
</head>
<body>
<div class="container">
  <div class="overlay"></div>
  <div class="content">
    <div class="icone">${post.icone}</div>
    <div class="tag">Biopharma Farmácia</div>
    <div class="faixa"></div>
    <div class="titulo">${post.titulo}</div>
    <div class="subtexto">${post.subtexto}</div>
    <div class="cta-box">${post.cta}</div>
  </div>
  <div class="rodape">
    <img src="${LOGO}" alt="Biopharma">
    <span>@farmaciabiopharmapoa</span>
  </div>
</div>
</body>
</html>`;
}

function institucional(post) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${BASE_CSS}
.container { background: ${WHITE}; flex-direction: row; padding: 0; }
.barra-lateral {
  width: 180px;
  height: 1080px;
  background: ${BLUE};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-shrink: 0;
}
.barra-lateral .cruz {
  font-size: 60px;
  opacity: 0.6;
}
.barra-lateral .line {
  width: 3px;
  height: 80px;
  background: rgba(255,255,255,0.2);
}
.corpo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 70px;
  text-align: center;
}
.logo-grande {
  width: 380px;
  object-fit: contain;
  margin-bottom: 40px;
}
.divider {
  width: 100%;
  height: 3px;
  background: ${BLUE};
  opacity: 0.15;
  margin-bottom: 40px;
}
.icone { font-size: 60px; margin-bottom: 20px; }
.titulo { color: ${BLUE}; font-size: 44px; margin-bottom: 24px; }
.subtexto { color: #444; font-size: 24px; margin-bottom: 36px; }
.cta-box { background: ${BLUE}; color: ${WHITE}; }
.rodape { background: ${BLUE}; }
</style>
</head>
<body>
<div class="container">
  <div class="barra-lateral">
    <div class="cruz">✚</div>
    <div class="line"></div>
    <div class="cruz">✚</div>
    <div class="line"></div>
    <div class="cruz">✚</div>
  </div>
  <div class="corpo">
    <img class="logo-grande" src="${LOGO}" alt="Biopharma">
    <div class="divider"></div>
    <div class="icone">${post.icone}</div>
    <div class="titulo">${post.titulo}</div>
    <div class="subtexto">${post.subtexto}</div>
    <div class="cta-box">${post.cta}</div>
  </div>
  <div class="rodape">
    <img src="${LOGO}" alt="Biopharma" style="filter:brightness(10)">
    <span>@farmaciabiopharmapoa</span>
  </div>
</div>
</body>
</html>`;
}

function gerarHTML(post) {
  if (post.tipo === 'servico') return servico(post);
  if (post.tipo === 'institucional') return institucional(post);
  return educativo(post);
}

module.exports = { gerarHTML };
