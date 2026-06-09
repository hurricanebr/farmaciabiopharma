/* =============================================
   BIOPHARMA DROGARIA — script.js
   ============================================= */

/* ---------- Ocultar imagens que não carregaram ---------- */
/* Esconde fachada.jpg e hero enquanto os arquivos não existirem */
(function () {
  document.querySelectorAll('.location__photo img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.location__photo').style.display = 'none';
    });
  });
})();

/* ---------- Rastreamento de cliques (GA4 + Pixel da Meta) ---------- */
/* Liga automaticamente todos os botões com [data-event].
   Se os IDs não estiverem preenchidos no <head>, gtag/fbq não existem
   e as chamadas abaixo são simplesmente ignoradas (site segue normal). */
(function () {
  function track(name) {
    if (!name) return;
    var isWhatsApp = name.indexOf('whatsapp') !== -1;
    var isPhone    = name.indexOf('phone')    !== -1;
    var isMaps     = name.indexOf('maps')     !== -1;
    var isReview   = name.indexOf('review')   !== -1;

    /* Google Analytics 4 — envia o nome do evento + categoria */
    if (window.gtag) {
      gtag('event', name, {
        event_category: isWhatsApp ? 'contato'
                       : isMaps    ? 'rota'
                       : isPhone   ? 'ligacao'
                       : isReview  ? 'avaliacao'
                       : 'engajamento',
        transport_type: 'beacon'
      });
    }

    /* Pixel da Meta — WhatsApp e telefone viram "Contact" (ótimo p/ otimizar
       campanhas de mensagem); os demais viram eventos personalizados. */
    if (window.fbq) {
      if (isWhatsApp || isPhone) {
        fbq('track', 'Contact', { source: name });
      } else {
        fbq('trackCustom', name);
      }
    }
  }

  /* Captura na fase de captura para disparar antes da navegação */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-event]');
    if (el) track(el.getAttribute('data-event'));
  }, true);
})();

/* ---------- Navbar: shadow on scroll ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Hamburger menu ---------- */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  const toggle = (open) => {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  btn.addEventListener('click', () => toggle(!btn.classList.contains('open')));

  /* close on link click */
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  /* close on outside click */
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      toggle(false);
    }
  });
})();

/* ---------- Smooth scroll offset for fixed navbar ---------- */
(function () {
  const NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68',
    10
  );
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---------- Lightbox para galeria ---------- */
(function () {
  const dialog = document.getElementById('lightbox');
  const img    = document.getElementById('lightboxImg');
  const close  = document.getElementById('lightboxClose');
  const prev   = document.getElementById('lightboxPrev');
  const next   = document.getElementById('lightboxNext');
  if (!dialog || !img) return;

  const items = Array.from(document.querySelectorAll('.gallery__item img'));
  let current = 0;

  const show = (index) => {
    current = index;
    img.src = items[current].src;
    img.alt = items[current].alt;
    prev.disabled = current === 0;
    next.disabled = current === items.length - 1;
  };

  document.querySelectorAll('.gallery__item').forEach((item, i) => {
    item.addEventListener('click', () => {
      show(i);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  prev.addEventListener('click', () => { if (current > 0) show(current - 1); });
  next.addEventListener('click', () => { if (current < items.length - 1) show(current + 1); });

  /* teclado: setas esquerda/direita */
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft'  && current > 0)               show(current - 1);
    if (e.key === 'ArrowRight' && current < items.length - 1) show(current + 1);
  });

  const closeLightbox = () => {
    dialog.close();
    document.body.style.overflow = '';
  };

  close.addEventListener('click', closeLightbox);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeLightbox(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
})();

/* ---------- Intersection observer: fade-in on scroll ---------- */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.service-card, .info-item, .reviews__badge, .reviews__title, .reviews__text'
  );
  targets.forEach(el => el.classList.add('fade-in'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 }
    );
    targets.forEach(el => observer.observe(el));
  } else {
    /* fallback for very old browsers */
    targets.forEach(el => el.classList.add('visible'));
  }
})();
