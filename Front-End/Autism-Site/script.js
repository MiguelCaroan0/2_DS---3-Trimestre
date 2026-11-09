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