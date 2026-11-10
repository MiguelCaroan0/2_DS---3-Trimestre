// Dev Acess — painel de acessibilidade (JavaScript vanilla)
(() => {
    const raiz = document.documentElement;
    const botao = document.getElementById('a11y-toggle');
    const painel = document.getElementById('a11y-painel');
    if (!botao || !painel) return;
  
    const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
    const ler = k => { try { return localStorage.getItem(k); } catch { return null; } };
  
    // Estado inicial salvo
    let tamanho = parseFloat(ler('da-fonte')) || 18;
    const aplicarFonte = () => raiz.style.setProperty('--fonte-base', tamanho + 'px');
    aplicarFonte();
    if (ler('da-contraste') === 'alto') raiz.dataset.contraste = 'alto';
    if (ler('da-movimento') === 'reduzido') raiz.dataset.movimento = 'reduzido';
  
    const marcar = (id, ativo) => document.getElementById(id)?.setAttribute('aria-pressed', ativo);
    marcar('a11y-contraste', raiz.dataset.contraste === 'alto');
    marcar('a11y-movimento', raiz.dataset.movimento === 'reduzido');
  
    const abrir = ab => {
      painel.hidden = !ab;
      botao.setAttribute('aria-expanded', ab);
      if (ab) painel.querySelector('button')?.focus(); else botao.focus();
    };
    botao.addEventListener('click', () => abrir(painel.hidden));
    painel.addEventListener('keydown', e => { if (e.key === 'Escape') abrir(false); });
  
    document.getElementById('a11y-mais').addEventListener('click', () => { tamanho = Math.min(tamanho + 2, 28); aplicarFonte(); guardar('da-fonte', tamanho); });
    document.getElementById('a11y-menos').addEventListener('click', () => { tamanho = Math.max(tamanho - 2, 14); aplicarFonte(); guardar('da-fonte', tamanho); });
  
    const alternar = (id, atributo, valor, chave) => {
      document.getElementById(id).addEventListener('click', e => {
        const ativo = raiz.dataset[atributo] !== valor;
        if (ativo) raiz.dataset[atributo] = valor; else delete raiz.dataset[atributo];
        e.currentTarget.setAttribute('aria-pressed', ativo);
        guardar(chave, ativo ? valor : '');
      });
    };
    alternar('a11y-contraste', 'contraste', 'alto', 'da-contraste');
    alternar('a11y-movimento', 'movimento', 'reduzido', 'da-movimento');
  })();