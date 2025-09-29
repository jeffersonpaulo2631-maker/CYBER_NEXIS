document.addEventListener('DOMContentLoaded', () => {
  const feedbackResposta = document.querySelector('.feedback-resposta');
  const timersDisplay = document.querySelector('.timer');
  const perguntasEnigma = document.querySelector('.pergunta-enigma');
  const respostasUsuario = document.querySelector('.resposta-criptografia');
  const botaoVerificar = document.querySelector('.verificar-resposta');

  let enigmaAtual = 0;
  let tempoRestante = 20;
  let timer;

  const enigmas = [
    {
      pergunta: '🧠 Eu protejo dados, mas quando sou fraco, tudo pode ser roubado. Quem sou eu?',
      resposta: 'senha',
      dica: 'É uma sequência de caracteres usada para autenticação.',
      redireciona: true // Somente ESTE enigma dá acesso
    },
    {
      pergunta: '🌐 O que significa a sigla VPN?',
      resposta: 'rede privada virtual',
      dica: 'Usada para proteger a privacidade na internet.',
      redireciona: false
    },
    {
      pergunta: '🔌 Em que porta padrão o protocolo HTTP opera?',
      resposta: '80',
      dica: 'É uma porta muito utilizada para navegação na web.',
      redireciona: false
    },
    {
      pergunta: '☠️ Sou o pesadelo dos sistemas: exploro vulnerabilidades. Quem sou eu?',
      resposta: 'malware',
      dica: 'É um tipo de software malicioso.',
      redireciona: false
    },
    {
      pergunta: '📁 Qual comando Linux é usado para listar arquivos?',
      resposta: 'ls',
      dica: 'É um comando básico para navegação no terminal.',
      redireciona: false
    }
  ];

  function exibirEnigma() {
    const atual = enigmas[enigmaAtual];
    perguntasEnigma.textContent = atual.pergunta;
    respostasUsuario.value = '';
    feedbackResposta.textContent = '';
    feedbackResposta.style.color = '';
    desbloquearInput();
    tempoRestante = 20;
    atualizarTimer();
    iniciarTimer();
  }

  function iniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      tempoRestante--;
      atualizarTimer();
      if (tempoRestante <= 0) {
        clearInterval(timer);
        feedbackResposta.textContent = '⏳ Tempo esgotado!';
        feedbackResposta.style.color = 'red';
        bloquearInput();
        setTimeout(proximoEnigma, 3000);
      }
    }, 1000);
  }

  function atualizarTimer() {
    timersDisplay.textContent = `⏱️ Tempo restante: ${tempoRestante} segundos`;
  }

  function bloquearInput() {
    respostasUsuario.disabled = true;
    botaoVerificar.disabled = true;
  }

  function desbloquearInput() {
    respostasUsuario.disabled = false;
    botaoVerificar.disabled = false;
  }

  function verificarResposta() {
    const atual = enigmas[enigmaAtual];
    const respostaCorreta = atual.resposta.toLowerCase().trim();
    const respostaDigitada = respostasUsuario.value.toLowerCase().trim();

    if (respostaDigitada === respostaCorreta) {
      clearInterval(timer);
      bloquearInput();
      feedbackResposta.textContent = '✅ Resposta correta! Acesso concedido.';
      feedbackResposta.style.color = 'lime';

      if (atual.redireciona) {
        setTimeout(() => {
          window.location.href = 'pagina-secreta.bkp.html';
        }, 1500);
      } else {
        setTimeout(proximoEnigma, 2500);
      }
    } else {
      feedbackResposta.textContent = `❌ Resposta incorreta. Dica: ${atual.dica}`;
      feedbackResposta.style.color = 'orange';
    }
  }

  function proximoEnigma() {
    enigmaAtual++;
    if (enigmaAtual >= enigmas.length) {
      feedbackResposta.textContent = '🎯 Você concluiu todos os enigmas. Mas apenas um dava acesso direto...';
      feedbackResposta.style.color = 'aqua';
      bloquearInput();
      return;
    }
    exibirEnigma();
  }

  // Suporte ao botão e tecla Enter
  botaoVerificar.addEventListener('click', verificarResposta);
  respostasUsuario.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      verificarResposta();
    }
  });

  exibirEnigma();
});
