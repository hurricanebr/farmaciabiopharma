const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const posts = require('./posts-data');
const { gerarHTML } = require('./template');

const OUTPUT_DIR = path.join(__dirname, 'output');

async function gerarPosts() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1080, height: 1080 });

  for (const post of posts) {
    const html = gerarHTML(post);
    const nome = `post-${String(post.id).padStart(2, '0')}-${post.tipo}.png`;
    const saida = path.join(OUTPUT_DIR, nome);

    await page.setContent(html, { waitUntil: 'networkidle' });

    // aguarda fontes carregarem
    await page.waitForTimeout(1500);

    await page.screenshot({ path: saida, clip: { x: 0, y: 0, width: 1080, height: 1080 } });

    console.log(`✓ ${nome}`);
  }

  await browser.close();
  console.log(`\n✅ ${posts.length} posts gerados em: ${OUTPUT_DIR}`);
}

gerarPosts().catch(err => {
  console.error('Erro ao gerar posts:', err);
  process.exit(1);
});
