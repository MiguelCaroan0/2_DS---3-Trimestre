// Dev Acess — demonstrações ao vivo do guia de JavaScript
(() => {
    const $ = s => document.querySelector(s);
  
    $('#demo-dom-btn')?.addEventListener('click', () => {
      $('#demo-dom-texto').textContent = 'Texto mudado pelo JavaScript!';
    });
  
    let cliques = 0;
    $('#demo-cont-btn')?.addEventListener('click', () => {
      cliques++;
      $('#demo-cont-saida').textContent = `Você clicou ${cliques} ${cliques === 1 ? 'vez' : 'vezes'}.`;
    });
  
    $('#demo-erro-btn')?.addEventListener('click', () => {
      try { JSON.parse('{texto sem aspas}'); }
      catch { $('#demo-erro-saida').textContent = 'Erro capturado: o texto não é um JSON válido.'; }
    });
  
    $('#demo-fetch-btn')?.addEventListener('click', async () => {
      const saida = $('#demo-fetch-saida');
      const cep = $('#demo-cep').value.replace(/\D/g, '');
      if (cep.length !== 8) { saida.textContent = 'Digite um CEP com 8 números.'; return; }
      saida.textContent = 'Buscando...';
      try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!r.ok) throw new Error();
        const d = await r.json();
        saida.textContent = d.erro ? 'CEP não encontrado.' : `${d.logradouro}, ${d.bairro} — ${d.localidade}/${d.uf}`;
      } catch {
        saida.textContent = 'Não foi possível buscar agora. Verifique sua conexão.';
      }
    });
  })();