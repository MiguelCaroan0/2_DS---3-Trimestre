(() => {
  const $ = (s) => document.querySelector(s);
  const header = $('#header'), nav = $('#nav'), burger = $('#burger');

  // Header: ganha fundo ao rolar
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menu mobile
  const setMenu = (open) => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => e.target.matches('a') && setMenu(false));
  addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // Newsletter
  const news = $('#news'), form = $('#newsForm'), email = $('#email'), msg = $('#newsMsg');
  setTimeout(() => news.classList.add('show'), 1500);
  $('#newsClose').addEventListener('click', () => news.classList.remove('show'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!email.checkValidity()) { msg.textContent = 'Digite um e-mail válido.'; email.focus(); return; }
    msg.textContent = 'Inscrição feita! Confira sua caixa de entrada.';
    form.reset();
    setTimeout(() => news.classList.remove('show'), 2200);
  });
})();

// ===== Planos, Blog e Destaques =====
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Revelar ao rolar + contagem dos preços
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduce) return;
    const t0 = performance.now(), dur = 900;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 0.1}s`; io.observe(el); });

  // Botões "Baixar lista"
  $$('[data-download]').forEach((btn) => btn.addEventListener('click', () => {
    const label = btn.textContent;
    btn.textContent = '✓ Lista enviada';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = label; btn.classList.remove('done'); }, 2000);
  }));

  // Slider do blog
  const slides = $$('#slider .post'), dots = $('#dots');
  let index = 0, timer;
  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === index));
    $$('button', dots).forEach((b, n) => { b.classList.toggle('on', n === index); b.setAttribute('aria-selected', n === index); });
  };
  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `Post ${n + 1}`);
    b.addEventListener('click', () => { show(n); start(); });
    dots.appendChild(b);
  });
  const start = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(index + 1), 6000); };
  $('#slider').addEventListener('mouseenter', () => clearInterval(timer));
  $('#slider').addEventListener('mouseleave', start);
  show(0); start();

  // Formulário de destaques
  const form = $('#hlForm'), check = $('#hlCheck'), msg = $('#hlMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = check.checked ? 'Pronto! Você receberá os destaques por e-mail.' : 'Marque a opção para receber os destaques.';
  });
})();