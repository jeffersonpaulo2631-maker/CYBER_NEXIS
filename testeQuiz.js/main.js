import { gabarito, calcularPontuacao } from './quizEngine.js';
import { iniciarTimer, pararTimer } from './timer.js';
import { mostrarEtapa, atualizarProgresso } from './uiController.js';

document.addEventListener('DOMContentLoaded', () => {

  // ===== INICIALIZA EMAILJS =====
  emailjs.init('_wMmR0Rqn5VoasHqR');

  // ===== ELEMENTOS =====
  const steps = document.querySelectorAll('.step');
  const timerSpan = document.getElementById('time');
  const progressBar = document.getElementById('progress-bar');
  const finalizarBtn = document.getElementById('finalizar-btn');
  const pontuacaoFinal = document.getElementById('pontuacao-final');
  const formEnvioEmail = document.getElementById('form-envio-email');
  const statusEnvio = document.getElementById('status-envio');

  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');

  let currentStep = 0;

  // ===== FUNÇÃO COLETAR RESPOSTAS =====
  function coletarRespostas() {
    const respostas = {};
    for (const pergunta in gabarito) {
      const marcada = document.querySelector(`input[name="${pergunta}"]:checked`);
      respostas[pergunta] = marcada ? marcada.value : null;
    }
    return respostas;
  }

  // ===== ENVIAR EMAIL =====
  function enviarResultadoEmail(nome, email, respostas, pontuacao) {

    const templateParams = {
      nome_usuario: nome,
      email_usuario: email,
      respostas_quiz: respostas,
      pontuacao_final: pontuacao
    };

    return emailjs.send(
      'service_h21ez1j',      // SEU SERVICE ID
      'template_xxxxxxx',     // COLOQUE AQUI SEU TEMPLATE ID REAL
      templateParams
    );
  }

  // ===== BOTÕES NEXT =====
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        mostrarEtapa(steps, currentStep);
        atualizarProgresso(progressBar, currentStep, steps.length);
      }
    });
  });

  // ===== BOTÕES PREV =====
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        mostrarEtapa(steps, currentStep);
        atualizarProgresso(progressBar, currentStep, steps.length);
      }
    });
  });

  // ===== FINALIZAR =====
  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', () => {

      pararTimer();

      const respostas = coletarRespostas();
      const acertos = calcularPontuacao(respostas);

      pontuacaoFinal.textContent =
        `Pontuação final: ${acertos} de ${Object.keys(gabarito).length}`;
    });
  }

  // ===== ENVIO EMAIL =====
  if (formEnvioEmail) {
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
  }

  // ===== INICIALIZAÇÃO =====
  if (steps.length > 0) {
    mostrarEtapa(steps, 0);
    atualizarProgresso(progressBar, 0, steps.length);
  }

  if (timerSpan) {
    iniciarTimer(timerSpan, () => {
      alert('Tempo esgotado!');
    });
  }

});
