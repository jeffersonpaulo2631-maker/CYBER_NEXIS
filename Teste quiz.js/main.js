import { gabarito, calcularPontuacao } from './quizEngine.js';
import { iniciarTimer, pararTimer } from './timer.js';
import { mostrarEtapa, atualizarProgresso } from './uiController.js';

document.addEventListener('DOMContentLoaded', () => {function 

  emailjs.init('_wMmR0Rqn5VoasHqR')() {
    
};

  // ELEMENTOS
  const steps = document.querySelectorAll('.step');
  const timerSpan = document.getElementById('time');
  const progressBar = document.getElementById('progress-bar');
  const finalizarBtn = document.getElementById('finalizar-btn');
  const pontuacaoFinal = document.getElementById('pontuacao-final');
  const formEnvioEmail = document.getElementById('form-envio-email');
  const statusEnvio = document.getElementById('status-envio');

  let currentStep = 0;

  // FUNÇÕES
  function coletarRespostas() {
    const respostas = {};
    for (const pergunta in gabarito) {
      const marcada = document.querySelector(`input[name="${pergunta}"]:checked`);
      respostas[pergunta] = marcada ? marcada.value : null;
    }
    return respostas;
  }

  function enviarResultadoEmail(nome, email, respostas, pontuacao) {
    const templateParams = {
      nome_usuario: nome,
      email_usuario: email,
      respostas_quiz: respostas,
      pontuacao_final: pontuacao
    };

    return emailjs.send(
      'service_h21ez1j',
      'service_h21ez1j',
      templateParams
    );
  }

  // EVENTO FINALIZAR
  finalizarBtn.addEventListener('click', () => {
    pararTimer();
    const respostas = coletarRespostas();
    const acertos = calcularPontuacao(respostas);

    pontuacaoFinal.textContent =
      `Pontuação final: ${acertos} de ${Object.keys(gabarito).length}`;
  });

  // EVENTO ENVIO EMAIL
  formEnvioEmail.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();

    const respostasObj = coletarRespostas();
    const acertos = calcularPontuacao(respostasObj);

    const respostasTexto = Object.entries(respostasObj)
      .map(([pergunta, valor]) => `${pergunta}: ${valor}`)
      .join('\n');

    enviarResultadoEmail(nome, email, respostasTexto, acertos)
      .then(() => {
        statusEnvio.textContent = "Resultado enviado com sucesso.";
        statusEnvio.style.color = "lime";
      })
      .catch(() => {
        statusEnvio.textContent = "Erro ao enviar.";
        statusEnvio.style.color = "red";
      });
  });

  // INICIALIZAÇÃO
  mostrarEtapa(steps, 0);
  atualizarProgresso(progressBar, 0, steps.length);
  iniciarTimer(timerSpan, () => {
    alert('Tempo esgotado!');
  });

});