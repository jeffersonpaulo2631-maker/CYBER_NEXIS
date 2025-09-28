document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("SEU_PUBLIC_KEY"); // <-- Insira aqui seu Public Key do EmailJS

  const form = document.getElementById("contact-form");
  const resposta = document.getElementById("resposta");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Anti-SPAM: verifica honeypot
    if (document.getElementById("hp-field").value !== "") {
      return;
    }

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    resposta.innerHTML = "";

    // Validações front-end
    if (nome.length < 3) {
      showMessage("alert-erro", "Nome deve ter no mínimo 3 caracteres.");
      return;
    }
    if (!validateEmail(email)) {
      showMessage("alert-erro", "Digite um email válido.");
      return;
    }
    if (mensagem.length < 10) {
      showMessage("alert-erro", "A mensagem deve ter pelo menos 10 caracteres.");
      return;
    }

    // Mostra carregando
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading");
    loadingDiv.textContent = "Enviando mensagem...";
    resposta.appendChild(loadingDiv);

    // Parâmetros para EmailJS
    const templateParams = {
      from_name: nome,
      email: email,
      message: mensagem
    };

    emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", templateParams)
      .then(() => {
        resposta.innerHTML = "";
        showMessage("alert-sucesso", "Mensagem enviada com sucesso!");
        form.reset();
      })
      .catch(() => {
        resposta.innerHTML = "";
        showMessage("alert-erro", "Erro ao enviar mensagem. Tente novamente.");
      });
  });

  function showMessage(type, text) {
    const div = document.createElement("div");
    div.classList.add("alert", type);
    div.textContent = text;
    resposta.appendChild(div);
    setTimeout(() => div.remove(), 5000);
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});
