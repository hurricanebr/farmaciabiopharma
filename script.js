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
