document.addEventListener('DOMContentLoaded', () => {
  const feedback = document.querySelector('.feedback-resposta');
  const pergunta = document.querySelector('.pergunta-enigma');
  const input = document.querySelector('.resposta-criptografia');
  const botao = document.querySelector('.verificar-resposta');
  const timerDisplay = document.querySelector('.timer');

  let enigmaAtual = 0;
  let tempo = 20;
  let timer;
  let codigoSecreto = [];

  // 👁️ monitoramento
  let erros = 0;
  let respostasRapidas = 0;
  let tempoTotal = 0;
  let tempoInicioPergunta;

  const hora = new Date().getHours();

  // 🌑 enigmas sombrios
  const enigmasSombrio = [
    { pergunta: '🌑 Eu existo na ausência de luz... o que sou?', resposta: 'sombra', palavraChave: 'umbra' },
    { pergunta: '👁️ Eu observo sem olhos... quem sou?', resposta: 'sistema', palavraChave: 'watch' },
    { pergunta: '⏳ Nunca paro... o que sou?', resposta: 'tempo', palavraChave: 'flow' }
  ];

  function getEnigmas() {
    if (hora < 6) return enigmasSombrio;

    if (hora < 18) {
      return [
        { pergunta: '☀️ Eu protejo dados... Quem sou eu?', resposta: 'senha', palavraChave: 'red' },
        { pergunta: '🌐 O que significa VPN?', resposta: 'rede privada virtual', palavraChave: 'sec' },
        { pergunta: '🔌 Porta do HTTP?', resposta: '80', palavraChave: 'ret' }
      ];
    }

    return [
      { pergunta: '🌆 O que protege sistemas?', resposta: 'firewall', palavraChave: 'sun' },
      { pergunta: '💻 Quem invade sistemas?', resposta: 'hacker', palavraChave: 'set' },
      { pergunta: '🔐 O que nunca deve ser compartilhado?', resposta: 'senha', palavraChave: 'key' }
    ];
  }

  const enigmas = getEnigmas();

  const caminhos = {
    'admin': 'final-tecnico.html',
    'root': 'final-tecnico.html',
    '1234': 'final-caos.html',
    'hack': 'final-caos.html'
  };

  function normalizar(txt) {
    return txt.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function iniciarTimer() {
    clearInterval(timer);
    tempoInicioPergunta = Date.now();

    timer = setInterval(() => {
      tempo--;
      timerDisplay.textContent = `⏱️ ${tempo}s`;

      if (tempo <= 0) {
        clearInterval(timer);
        erros++;
        feedback.textContent = '⏳ Tempo esgotado... você hesitou.';
        bloquear();
        setTimeout(proximo, 2000);
      }
    }, 1000);
  }

  function bloquear() {
    input.disabled = true;
    botao.disabled = true;
  }

  function desbloquear() {
    input.disabled = false;
    botao.disabled = false;
  }

  function mostrarEnigma() {
    const atual = enigmas[enigmaAtual];
    pergunta.textContent = atual.pergunta;
    input.value = '';
    feedback.textContent = '';
    tempo = 20;
    desbloquear();
    iniciarTimer();
  }

  function verificar() {
    const resposta = normalizar(input.value);
    const atual = enigmas[enigmaAtual];

    const tempoResposta = (Date.now() - tempoInicioPergunta) / 1000;
    tempoTotal += tempoResposta;

    if (tempoResposta < 3) respostasRapidas++;
    if (resposta !== normalizar(atual.resposta)) erros++;

    // 🔴 atalhos secretos
    if (caminhos[resposta]) {
      window.location.href = caminhos[resposta];
      return;
    }

    if (resposta === normalizar(atual.resposta)) {
      codigoSecreto.push(atual.palavraChave);

      clearInterval(timer);
      bloquear();

      feedback.textContent = '✅ Correto... continuando análise.';
      feedback.style.color = 'lime';

      setTimeout(proximo, 1200);
    } else {
      feedback.textContent = tempoResposta > 8 
        ? '❌ Demorou... ficou com dúvida?' 
        : '❌ Errado... ou observado.';
      feedback.style.color = 'orange';
    }
  }

  function proximo() {
    enigmaAtual++;

    if (enigmaAtual >= enigmas.length) {
      iniciarEnigmaFinal();
      return;
    }

    mostrarEnigma();
  }

  // 🌀 ENIGMA FINAL VIVO
  function iniciarEnigmaFinal() {
    pergunta.textContent = '';
    input.value = '';
    feedback.textContent = '';
    desbloquear();

    const fases = [
      "👁️ Eu nunca mudo. Confie.",
      "👁️ Eu quase nunca mudo.",
      "👁️ Eu mudo às vezes.",
      "👁️ Eu sempre mudo.",
      "👁️ Eu já mudei enquanto você lia.",
      "👁️ Você percebeu tarde demais."
    ];

    let estado = 0;

    const intervalo = setInterval(() => {
      estado++;
      if (estado >= fases.length) estado = fases.length - 1;

      pergunta.textContent = fases[estado] + " ⏳ " + new Date().toLocaleTimeString();
    }, 2500);

    botao.onclick = () => {
      clearInterval(intervalo);

      const resposta = normalizar(input.value);
      finalizar(resposta);
    };
  }

  function finalizar(respostaFinal = '') {
    const codigo = codigoSecreto.join('');

    // 🟣 final secreto
    if (codigo === 'redsecret' || codigo === 'umbrawatchflow' || respostaFinal === 'tempo') {
      window.location.href = 'final-secreto.html';
      return;
    }

    // 👁️ observado
    if (respostasRapidas >= 2 && erros === 0) {
      window.location.href = 'manual.html';
      return;
    }

    // 🔵 técnico
    if (erros <= 1) {
      window.location.href = 'serviços.html';
      return;
    }

    // 🔴 caos
    window.location.href = 'final-caos.html';
  }

  botao.addEventListener('click', verificar);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') verificar();
  });

  mostrarEnigma();
});
