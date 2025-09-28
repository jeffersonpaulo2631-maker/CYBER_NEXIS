document.addEventListener('DOMContentLoaded', () => {
  emailjs.init('SEU_PUBLIC_KEY'); // <-- Coloque seu Public Key do EmailJS aqui

  const steps = document.querySelectorAll('.step');
  const timerSpan = document.getElementById('time');
  const feedbackDivs = document.querySelectorAll('.step-feedback');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const finalizarBtn = document.getElementById('finalizar-btn');
  const resultadoEnvio = document.getElementById('resultado-envio');
  const quizForm = document.getElementById('quiz-form');
  const formEnvioEmail = document.getElementById('form-envio-email');
  const statusEnvio = document.getElementById('status-envio');
  const pontuacaoFinal = document.getElementById('pontuacao-final');
  const reiniciarBtn = document.getElementById('reiniciar-btn');
  let currentStep = 0;
  let tempoRestante = 20;
  let intervaloTempo;

  const gabarito = {
    q1: 'TCP/IP',
    q2: 'JavaScript',
    q3: 'Seguranca',
    q4: 'IP',
    q5: 'Endereco',
    q6: 'Conteudo',
    q7: 'Criptografia'
  };

  function startTimer() {
    clearInterval(intervaloTempo);
    tempoRestante = 20;
    timerSpan.textContent = tempoRestante;
    intervaloTempo = setInterval(() => {
      tempoRestante--;
      timerSpan.textContent = tempoRestante;
      if (tempoRestante <= 0) {
        clearInterval(intervaloTempo);
        feedbackDivs[currentStep].textContent = 'Tempo esgotado!';
        feedbackDivs[currentStep].style.color = 'orange';
        disableStepInputs(currentStep);
      }
    }, 1000);
  }

  function disableStepInputs(stepIndex) {
    const inputs = steps[stepIndex].querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
    nextButtons[stepIndex]?.setAttribute('disabled', true);
    if (finalizarBtn && stepIndex === steps.length - 1) {
      finalizarBtn.disabled = true;
    }
  }

  function enableStepInputs(stepIndex) {
    const inputs = steps[stepIndex].querySelectorAll('input');
    inputs.forEach(input => input.disabled = false);
    nextButtons[stepIndex]?.removeAttribute('disabled');
    if (finalizarBtn && stepIndex === steps.length - 1) {
      finalizarBtn.disabled = false;
    }
  }

  function validateStep(stepIndex) {
    const inputs = steps[stepIndex].querySelectorAll('input[type="radio"]');
    const perguntas = new Set();
    inputs.forEach(input => perguntas.add(input.name));
    for (const pergunta of perguntas) {
      const checked = steps[stepIndex].querySelector(`input[name="${pergunta}"]:checked`);
      if (!checked) {
        feedbackDivs[stepIndex].textContent = 'Por favor, responda todas as perguntas antes de continuar.';
        feedbackDivs[stepIndex].style.color = 'red';
        return false;
      }
    }
    feedbackDivs[stepIndex].textContent = '';
    return true;
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.style.display = i === index ? 'block' : 'none';
    });
    currentStep = index;
    feedbackDivs.forEach(div => div.textContent = '');
    enableStepInputs(currentStep);
    startTimer();
  }

  function calcularPontuacao() {
    let acertos = 0;
    for (const pergunta in gabarito) {
      const resposta = document.querySelector(`input[name="${pergunta}"]:checked`);
      if (resposta && resposta.value === gabarito[pergunta]) {
        acertos++;
      }
    }
    return acertos;
  }

  nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (!validateStep(index)) return;
      if (index < steps.length - 1) {
        showStep(index + 1);
      }
    });
  });

  prevButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (index > 0) {
        showStep(index - 1);
      }
    });
  });

  finalizarBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    clearInterval(intervaloTempo);

    const acertos = calcularPontuacao();
    const total = Object.keys(gabarito).length;
    pontuacaoFinal.textContent = `Você acertou ${acertos} de ${total} perguntas.`;

    document.querySelector('.quiz-container').style.display = 'none';
    resultadoEnvio.style.display = 'block';
  });

  formEnvioEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = formEnvioEmail.nome.value.trim();
    const email = formEnvioEmail.email.value.trim();

    if (!nome || !email) {
      statusEnvio.textContent = 'Por favor, preencha todos os campos.';
      statusEnvio.style.color = 'red';
      return;
    }

    let respostas = [];
    for (const pergunta in gabarito) {
      const resposta = document.querySelector(`input[name="${pergunta}"]:checked`);
      respostas.push(`${pergunta}: ${resposta ? resposta.value : 'Não respondida'}`);
    }

    const templateParams = {
      nome_usuario: nome,
      email_usuario: email,
      respostas_quiz: respostas.join('\n')
    };

    statusEnvio.textContent = 'Enviando...';
    statusEnvio.style.color = 'white';

    emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
      .then(() => {
        statusEnvio.textContent = 'Resultado enviado com sucesso!';
        statusEnvio.style.color = 'lime';
        formEnvioEmail.reset();
      }, (error) => {
        statusEnvio.textContent = 'Erro ao enviar. Verifique os dados.';
        statusEnvio.style.color = 'red';
        console.error('Erro EmailJS:', error);
      });
  });

  reiniciarBtn.addEventListener('click', () => {
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    resultadoEnvio.style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'block';
    showStep(0);
  });

  showStep(0);
});
