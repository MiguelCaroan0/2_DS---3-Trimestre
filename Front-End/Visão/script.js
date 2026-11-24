document.addEventListener('DOMContentLoaded', () => {
    // Estado padrão de preferências
    const defaultPrefs = {
      fontScale: 100, // em %
      theme: 'default', // default, high-contrast-dark, yellow-black, sepia
      grayscale: false,
      daltonism: 'none', // none, protanopia, deuteranopia, tritanopia
      hyperlegible: false,
      extraSpacing: false,
      highlightLinks: false,
      readingGuide: false,
      largeCursor: false,
      hoverSpeak: false,
      speechRate: 1
    };

    // Carregar preferências do localStorage com segurança
    let prefs = { ...defaultPrefs };
    try {
      const saved = localStorage.getItem('visaoClaraPrefs_v2');
      if (saved) {
        prefs = { ...defaultPrefs, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Não foi possível ler o localStorage:', e);
    }

    const htmlEl = document.documentElement;
    const announcer = document.getElementById('aria-announcer');

    // Função para anunciar mudanças para leitores de tela
    function announce(message) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }

    // Salvar preferências no localStorage
    function savePrefs() {
      try {
        localStorage.setItem('visaoClaraPrefs_v2', JSON.stringify(prefs));
      } catch (e) {
        console.warn('Erro ao salvar preferências:', e);
      }
    }

    // Aplicar todas as preferências visuais na interface
    function applyPreferences() {
      // 1. Tamanho da fonte (base 18px * escala)
      const basePx = 18 * (prefs.fontScale / 100);
      htmlEl.style.fontSize = `${basePx}px`;
      document.getElementById('font-size-indicator').textContent = `${prefs.fontScale}%`;

      // 2. Temas de cor
      htmlEl.classList.remove('theme-high-contrast-dark', 'theme-yellow-black', 'theme-sepia');
      if (prefs.theme !== 'default') {
        htmlEl.classList.add(`theme-${prefs.theme}`);
      }

      document.querySelectorAll('.theme-btn').forEach(btn => {
        const isActive = btn.dataset.theme === prefs.theme;
        btn.setAttribute('aria-pressed', isActive);
      });

      const quickContrastBtn = document.getElementById('btn-quick-contrast');
      quickContrastBtn.setAttribute('aria-pressed', prefs.theme === 'high-contrast-dark');

      // 3. Escala de cinza e Daltonismo
      htmlEl.classList.toggle('theme-grayscale', prefs.grayscale);
      document.getElementById('btn-grayscale').setAttribute('aria-pressed', prefs.grayscale);

      htmlEl.classList.remove('filter-protanopia', 'filter-deuteranopia', 'filter-tritanopia');
      if (prefs.daltonism !== 'none') {
        htmlEl.classList.add(`filter-${prefs.daltonism}`);
      }
      document.querySelectorAll('.daltonism-btn').forEach(btn => {
        btn.setAttribute('aria-pressed', btn.dataset.daltonism === prefs.daltonism);
      });

      // 4. Tipografia, Espaçamento, Links, Régua e Cursor
      htmlEl.classList.toggle('font-hyperlegible', prefs.hyperlegible);
      document.getElementById('btn-hyperlegible').setAttribute('aria-pressed', prefs.hyperlegible);

      htmlEl.classList.toggle('extra-spacing', prefs.extraSpacing);
      document.getElementById('btn-spacing').setAttribute('aria-pressed', prefs.extraSpacing);

      htmlEl.classList.toggle('highlight-links', prefs.highlightLinks);
      document.getElementById('btn-highlight-links').setAttribute('aria-pressed', prefs.highlightLinks);

      htmlEl.classList.toggle('reading-guide-active', prefs.readingGuide);
      document.getElementById('btn-reading-guide').setAttribute('aria-pressed', prefs.readingGuide);

      htmlEl.classList.toggle('large-cursor', prefs.largeCursor);
      document.getElementById('btn-large-cursor').setAttribute('aria-pressed', prefs.largeCursor);

      // 5. Configurações de voz
      document.getElementById('btn-hover-speak').setAttribute('aria-pressed', prefs.hoverSpeak);
      document.querySelectorAll('.rate-btn').forEach(btn => {
        btn.setAttribute('aria-pressed', parseFloat(btn.dataset.rate) === prefs.speechRate);
      });

      savePrefs();
    }

    // ======================================================================
    // CONTROLES DE TAMANHO DE FONTE
    // ======================================================================
    function changeFontSize(delta) {
      const newScale = Math.min(200, Math.max(85, prefs.fontScale + delta));
      if (newScale !== prefs.fontScale) {
        prefs.fontScale = newScale;
        applyPreferences();
        announce(`Tamanho do texto ajustado para ${prefs.fontScale} por cento.`);
      }
    }

    document.getElementById('btn-font-increase').addEventListener('click', () => changeFontSize(15));
    document.getElementById('btn-font-decrease').addEventListener('click', () => changeFontSize(-15));
    document.getElementById('btn-font-reset').addEventListener('click', () => {
      prefs.fontScale = 100;
      applyPreferences();
      announce('Tamanho do texto restaurado para 100 por cento.');
    });

    // ======================================================================
    // CONTROLES DE CONTRASTE, CORES E FILTROS
    // ======================================================================
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        prefs.theme = btn.dataset.theme;
        applyPreferences();
        announce(`Tema alterado para ${btn.textContent.trim()}.`);
      });
    });

    document.getElementById('btn-quick-contrast').addEventListener('click', () => {
      prefs.theme = prefs.theme === 'high-contrast-dark' ? 'default' : 'high-contrast-dark';
      applyPreferences();
      announce(prefs.theme === 'high-contrast-dark' ? 'Alto contraste escuro ativado.' : 'Alto contraste desativado.');
    });

    document.getElementById('btn-grayscale').addEventListener('click', () => {
      prefs.grayscale = !prefs.grayscale;
      applyPreferences();
      announce(prefs.grayscale ? 'Modo escala de cinza ativado.' : 'Modo escala de cinza desativado.');
    });

    document.querySelectorAll('.daltonism-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        prefs.daltonism = btn.dataset.daltonism;
        applyPreferences();
        announce(`Filtro de daltonismo: ${btn.textContent.trim()}.`);
      });
    });

    // ======================================================================
    // CONTROLES DE TIPOGRAFIA, ESPAÇAMENTO, RÉGUA E CURSOR
    // ======================================================================
    // Botões liga/desliga definidos por configuração (evita código repetido)
    const toggleButtons = [
      { id: 'btn-hyperlegible', key: 'hyperlegible', on: 'Fonte hiperlegível para baixa visão ativada.', off: 'Fonte padrão restaurada.' },
      { id: 'btn-spacing', key: 'extraSpacing', on: 'Espaçamento ampliado entre linhas e letras ativado.', off: 'Espaçamento padrão restaurado.' },
      { id: 'btn-highlight-links', key: 'highlightLinks', on: 'Destaque reforçado de links e botões ativado.', off: 'Destaque de links desativado.' },
      { id: 'btn-reading-guide', key: 'readingGuide', on: 'Régua guia de leitura ativada.', off: 'Régua guia de leitura desativada.' },
      { id: 'btn-large-cursor', key: 'largeCursor', on: 'Cursor ampliado de alto contraste ativado.', off: 'Cursor padrão restaurado.' }
    ];

    toggleButtons.forEach(({ id, key, on, off }) => {
      document.getElementById(id).addEventListener('click', () => {
        prefs[key] = !prefs[key];
        applyPreferences();
        announce(prefs[key] ? on : off);
      });
    });

    // Movimento da Régua de Leitura com Mouse e Toque
    const readingGuideEl = document.getElementById('reading-guide');
    window.addEventListener('mousemove', (e) => {
      if (prefs.readingGuide) {
        readingGuideEl.style.top = `${e.clientY}px`;
      }
    });
    window.addEventListener('touchmove', (e) => {
      if (prefs.readingGuide && e.touches.length > 0) {
        readingGuideEl.style.top = `${e.touches[0].clientY}px`;
      }
    }, { passive: true });

    // ======================================================================
    // EXPANDIR / RECOLHER BARRA AVANÇADA
    // ======================================================================
    const toggleToolbarBtn = document.getElementById('btn-toggle-toolbar');
    const advancedPanel = document.getElementById('toolbar-advanced-panel');
    const toolbarChevron = document.getElementById('toolbar-chevron');

    toggleToolbarBtn.addEventListener('click', () => {
      const isExpanded = toggleToolbarBtn.getAttribute('aria-expanded') === 'true';
      toggleToolbarBtn.setAttribute('aria-expanded', !isExpanded);
      advancedPanel.classList.toggle('hidden', isExpanded);
      toolbarChevron.classList.toggle('rotate-180', !isExpanded);
    });

    // ======================================================================
    // LEITOR DE VOZ (WEB SPEECH API EM PORTUGUÊS)
    // ======================================================================
    const synth = window.speechSynthesis;
    let isSpeakingPage = false;
    let currentHighlightedEl = null;

    function clearSpeechHighlight() {
      if (currentHighlightedEl) {
        currentHighlightedEl.classList.remove('tts-speaking-highlight');
        currentHighlightedEl = null;
      }
    }

    function speakText(text, targetElement = null) {
      if (!synth) {
        announce('Seu navegador não suporta síntese de voz.');
        return;
      }
      synth.cancel();
      clearSpeechHighlight();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = prefs.speechRate;

      if (targetElement) {
        currentHighlightedEl = targetElement;
        targetElement.classList.add('tts-speaking-highlight');
      }

      utterance.onend = () => {
        clearSpeechHighlight();
        if (isSpeakingPage) {
          isSpeakingPage = false;
          updateTtsButtonState();
        }
      };

      utterance.onerror = () => {
        clearSpeechHighlight();
        isSpeakingPage = false;
        updateTtsButtonState();
      };

      synth.speak(utterance);
    }

    function updateTtsButtonState() {
      const btn = document.getElementById('btn-tts-toggle');
      const label = document.getElementById('tts-btn-label');
      btn.setAttribute('aria-pressed', isSpeakingPage);
      label.textContent = isSpeakingPage ? 'Parar Leitura' : 'Ouvir Página';
    }

    function toggleFullPageSpeech() {
      if (!synth) return;
      if (isSpeakingPage || synth.speaking) {
        synth.cancel();
        clearSpeechHighlight();
        isSpeakingPage = false;
        updateTtsButtonState();
        announce('Leitura em voz alta interrompida.');
      } else {
        const mainText = document.getElementById('conteudo-principal').innerText;
        isSpeakingPage = true;
        updateTtsButtonState();
        speakText(mainText);
      }
    }

    document.getElementById('btn-tts-toggle').addEventListener('click', toggleFullPageSpeech);

    document.getElementById('btn-hero-listen').addEventListener('click', () => {
      const heroSection = document.querySelector('#conteudo-principal section');
      speakText(heroSection.innerText, heroSection);
    });

    // Botões individuais de ouvir cada card
    document.querySelectorAll('.speak-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const article = btn.closest('article');
        const title = article.querySelector('h3').innerText;
        const desc = article.querySelector('p').innerText;
        speakText(`${title}. ${desc}`, article);
      });
    });

    // Modo "Ler ao Focar ou Passar o Mouse"
    document.getElementById('btn-hover-speak').addEventListener('click', () => {
      prefs.hoverSpeak = !prefs.hoverSpeak;
      applyPreferences();
      announce(prefs.hoverSpeak ? 'Modo ler ao focar ou passar o mouse ativado.' : 'Modo ler ao focar desativado.');
      if (!prefs.hoverSpeak && synth) {
        synth.cancel();
        clearSpeechHighlight();
      }
    });

    let hoverTimeout = null;
    document.body.addEventListener('mouseover', (e) => {
      if (!prefs.hoverSpeak || isSpeakingPage) return;
      const target = e.target.closest('p, h1, h2, h3, a, button, label, td, th');
      if (target && target.innerText.trim().length > 1) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          speakText(target.innerText.trim(), target);
        }, 350);
      }
    });

    document.body.addEventListener('focusin', (e) => {
      if (!prefs.hoverSpeak || isSpeakingPage) return;
      const target = e.target;
      const labelText = target.getAttribute('aria-label') || target.innerText || target.placeholder;
      if (labelText && labelText.trim().length > 0) {
        speakText(labelText.trim(), target);
      }
    });

    // Velocidade da fala
    document.querySelectorAll('.rate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        prefs.speechRate = parseFloat(btn.dataset.rate);
        applyPreferences();
        announce(`Velocidade da fala ajustada para ${btn.textContent.trim()}.`);
      });
    });

    // ======================================================================
    // BOTÃO RESETAR TUDO
    // ======================================================================
    document.getElementById('btn-reset-all').addEventListener('click', () => {
      if (synth) synth.cancel();
      clearSpeechHighlight();
      isSpeakingPage = false;
      updateTtsButtonState();
      prefs = { ...defaultPrefs };
      applyPreferences();
      announce('Todas as preferências de acessibilidade foram restauradas para o padrão.');
    });

    // ======================================================================
    // ATALHOS DE TECLADO GLOBAIS (ALT + TECLA)
    // ======================================================================
    document.addEventListener('keydown', (e) => {
      if (!e.altKey) return;
      const key = e.key.toLowerCase();

      if (key === '1') {
        e.preventDefault();
        const main = document.getElementById('conteudo-principal');
        main.focus();
        announce('Foco movido para o conteúdo principal.');
      } else if (key === '2') {
        e.preventDefault();
        document.getElementById('btn-font-decrease').focus();
        announce('Foco movido para a barra de acessibilidade.');
      } else if (key === 'c') {
        e.preventDefault();
        document.getElementById('btn-quick-contrast').click();
      } else if (key === 'l') {
        e.preventDefault();
        toggleFullPageSpeech();
      } else if (key === '+' || key === '=') {
        e.preventDefault();
        changeFontSize(15);
      } else if (key === '-') {
        e.preventDefault();
        changeFontSize(-15);
      } else if (key === 'r') {
        e.preventDefault();
        document.getElementById('btn-reading-guide').click();
      }
    });

    // ======================================================================
    // SIMULADOR INTERATIVO DE CONTRASTE WCAG 2.2
    // ======================================================================
    const fgColorInput = document.getElementById('input-fg-color');
    const fgHexInput = document.getElementById('input-fg-hex');
    const bgColorInput = document.getElementById('input-bg-color');
    const bgHexInput = document.getElementById('input-bg-hex');
    const previewBox = document.getElementById('contrast-preview-box');
    const ratioValueEl = document.getElementById('contrast-ratio-value');
    const normalBadgeEl = document.getElementById('wcag-normal-badge');
    const largeBadgeEl = document.getElementById('wcag-large-badge');

    function hexToRgb(hex) {
      const cleanHex = hex.replace('#', '');
      if (cleanHex.length !== 6) return null;
      const num = parseInt(cleanHex, 16);
      if (isNaN(num)) return null;
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }

    function getLuminance({ r, g, b }) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function updateContrastSimulator(fgHex, bgHex) {
      const fgRgb = hexToRgb(fgHex);
      const bgRgb = hexToRgb(bgHex);
      if (!fgRgb || !bgRgb) return;

      previewBox.style.color = fgHex;
      previewBox.style.backgroundColor = bgHex;

      const lum1 = getLuminance(fgRgb);
      const lum2 = getLuminance(bgRgb);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      const ratio = (brightest + 0.05) / (darkest + 0.05);

      ratioValueEl.textContent = `${ratio.toFixed(2)} : 1`;

      // Avaliação Texto Normal (AAA >= 7.0, AA >= 4.5)
      if (ratio >= 7.0) {
        normalBadgeEl.textContent = 'APROVADO AAA (≥ 7:1)';
        normalBadgeEl.className = 'inline-block mt-1 px-3 py-1 rounded-lg font-extrabold text-sm bg-emerald-700 text-white';
      } else if (ratio >= 4.5) {
        normalBadgeEl.textContent = 'APROVADO AA (≥ 4.5:1)';
        normalBadgeEl.className = 'inline-block mt-1 px-3 py-1 rounded-lg font-extrabold text-sm bg-amber-600 text-white';
      } else {
        normalBadgeEl.textContent = 'REPROVADO (< 4.5:1)';
        normalBadgeEl.className = 'inline-block mt-1 px-3 py-1 rounded-lg font-extrabold text-sm bg-red-700 text-white';
      }

      // Avaliação Texto Grande (AAA >= 4.5, AA >= 3.0)
      if (ratio >= 4.5) {
        largeBadgeEl.textContent = 'APROVADO AAA (≥ 4.5:1)';
        largeBadgeEl.className = 'inline-block mt-1 px-3 py-1 rounded-lg font-extrabold text-sm bg-emerald-700 text-white';
      } else if (ratio >= 3.0) {
        largeBadgeEl.textContent = 'APROVADO AA (≥ 3:1)';
        largeBadgeEl.className = 'inline-block mt-1 px-3 py-1 rounded-lg font-extrabold text-sm bg-amber-600 text-white';
      } else {
        largeBadgeEl.textContent = 'REPROVADO (< 3:1)';
        largeBadgeEl.className = 'inline-block mt-1 px-3 py-1 rounded-lg font-extrabold text-sm bg-red-700 text-white';
      }
    }

    fgColorInput.addEventListener('input', (e) => {
      fgHexInput.value = e.target.value.toUpperCase();
      updateContrastSimulator(fgHexInput.value, bgHexInput.value);
    });

    bgColorInput.addEventListener('input', (e) => {
      bgHexInput.value = e.target.value.toUpperCase();
      updateContrastSimulator(fgHexInput.value, bgHexInput.value);
    });

    fgHexInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        fgColorInput.value = val;
        updateContrastSimulator(val, bgHexInput.value);
      }
    });

    bgHexInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        bgColorInput.value = val;
        updateContrastSimulator(fgHexInput.value, val);
      }
    });

    document.getElementById('btn-swap-colors').addEventListener('click', () => {
      const temp = fgHexInput.value;
      fgHexInput.value = bgHexInput.value;
      fgColorInput.value = bgHexInput.value;
      bgHexInput.value = temp;
      bgColorInput.value = temp;
      updateContrastSimulator(fgHexInput.value, bgHexInput.value);
      announce('Cores do simulador invertidas.');
    });

    document.querySelectorAll('.preset-contrast-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fg = btn.dataset.presetFg;
        const bg = btn.dataset.presetBg;
        fgHexInput.value = fg;
        fgColorInput.value = fg;
        bgHexInput.value = bg;
        bgColorInput.value = bg;
        updateContrastSimulator(fg, bg);
        announce(`Combinação carregada: ${btn.textContent.trim()}.`);
      });
    });

    // ======================================================================
    // VALIDAÇÃO ACESSÍVEL DO FORMULÁRIO DE FEEDBACK + FEEDBACK SONORO
    // ======================================================================
    const form = document.getElementById('accessible-feedback-form');
    const statusBox = document.getElementById('form-status-box');

    // Feedback sonoro suave via Web Audio API (sem arquivos externos)
    function playFeedbackTone(success = true) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(success ? 523.25 : 220, ctx.currentTime); // Dó5 ou Lá3
        if (success) {
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // Mi5
        }

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch (e) {
        // Ignora caso o navegador bloqueie áudio automático
      }
    }

    function validateField(inputEl, errorEl, condition, errorMsg) {
      if (!condition) {
        inputEl.setAttribute('aria-invalid', 'true');
        errorEl.textContent = errorMsg;
        errorEl.classList.remove('hidden');
        return false;
      } else {
        inputEl.removeAttribute('aria-invalid');
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
        return true;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('field-name');
      const emailInput = document.getElementById('field-email');
      const messageInput = document.getElementById('field-message');

      const isNameValid = validateField(
        nameInput,
        document.getElementById('error-name'),
        nameInput.value.trim().length >= 3,
        'Erro: Por favor, informe seu nome completo com pelo menos 3 letras.'
      );

      const isEmailValid = validateField(
        emailInput,
        document.getElementById('error-email'),
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()),
        'Erro: Por favor, informe um endereço de e-mail válido, como exemplo@dominio.com.'
      );

      const isMessageValid = validateField(
        messageInput,
        document.getElementById('error-message'),
        messageInput.value.trim().length >= 10,
        'Erro: Por favor, escreva uma mensagem com pelo menos 10 caracteres.'
      );

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        playFeedbackTone(false);
        statusBox.className = 'p-5 rounded-2xl border-2 font-bold text-lg bg-red-100 text-red-900 border-red-700 block';
        statusBox.textContent = 'Não foi possível enviar. Verifique os campos destacados com erro acima.';
        announce('Erro no formulário. Verifique os campos obrigatórios.');
       
        // Move o foco para o primeiro campo inválido
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Sucesso no envio
      playFeedbackTone(true);
      statusBox.className = 'p-5 rounded-2xl border-2 font-bold text-lg bg-emerald-100 text-emerald-950 border-emerald-700 block';
      statusBox.textContent = `Obrigado, ${nameInput.value.trim()}! Seu feedback de acessibilidade foi enviado com sucesso.`;
      announce(statusBox.textContent);
      form.reset();
    });

    // Inicializar preferências salvas ao carregar a página
    applyPreferences();
    updateContrastSimulator('#FFFF00', '#000000');
  });