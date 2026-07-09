// ============================================================
// Cyber-Nexis | Contato com validação e EmailJS opcional
// Preencha os 3 valores abaixo com dados reais do EmailJS.
// ============================================================

const EMAILJS_PUBLIC_KEY = "COLOQUE_SUA_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "COLOQUE_SEU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "COLOQUE_SEU_TEMPLATE_ID";

const form = document.getElementById("contact-form");
const resposta = document.getElementById("resposta");

function setMessage(text, type = "") {
  resposta.textContent = text;
  resposta.className = `status-message ${type}`.trim();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function emailJsConfigured() {
  return window.emailjs
    && !EMAILJS_PUBLIC_KEY.startsWith("COLOQUE_")
    && !EMAILJS_SERVICE_ID.startsWith("COLOQUE_")
    && !EMAILJS_TEMPLATE_ID.startsWith("COLOQUE_");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (document.getElementById("hp-field").value.trim()) return;

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  if (nome.length < 3) return setMessage("Nome precisa ter pelo menos 3 caracteres.", "error");
  if (!validateEmail(email)) return setMessage("Digite um e-mail válido.", "error");
  if (mensagem.length < 10) return setMessage("Mensagem precisa ter pelo menos 10 caracteres.", "error");

  if (!emailJsConfigured()) {
    console.info("Mensagem validada localmente:", { nome, email, mensagem });
    setMessage("Formulário validado. Configure o EmailJS em contato.js para enviar de verdade.", "ok");
    return;
  }

  setMessage("Enviando mensagem...");

  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: nome,
      from_email: email,
      message: mensagem,
    });
    form.reset();
    setMessage("Mensagem enviada com sucesso.", "ok");
  } catch (error) {
    console.error(error);
    setMessage("Erro ao enviar mensagem. Confira as chaves do EmailJS.", "error");
  }
});
