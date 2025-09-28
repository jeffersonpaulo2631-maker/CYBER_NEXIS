// ==================== CRIPTOGRAFIA AES ====================
// Usando CryptoJS (adicione no HTML <head> antes deste script)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  const tokenInput = document.getElementById("token-input");
  const validarTokenBtn = document.getElementById("validar-token");
  const tokenFeedback = document.getElementById("token-feedback");

  const osintInput = document.getElementById("senha-osint");
  const validarOsintBtn = document.getElementById("validar-osint");
  const osintFeedback = document.getElementById("osint-feedback");

  // Chave secreta fixa
  const SECRET_KEY = "NEXIS_KEY";

  // Função para gerar token esperado com base na hora atual (hh:mm)
  function gerarTokenAtual() {
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, "0");
    const minuto = agora.getMinutes().toString().padStart(2, "0");
    const texto = `${hora}:${minuto}`;
    const tokenCriptografado = CryptoJS.AES.encrypt(texto, SECRET_KEY).toString();
    return tokenCriptografado;
  }

  // Armazena token correto no console para testes
  const tokenCorreto = gerarTokenAtual();
  console.log("DEBUG (token esperado):", tokenCorreto);

  // Validação do Token
  validarTokenBtn.addEventListener("click", () => {
    const tokenInserido = tokenInput.value.trim();
    if (!tokenInserido) {
      tokenFeedback.textContent = "Digite um token.";
      return;
    }
    if (tokenInserido === tokenCorreto) {
      tokenFeedback.style.color = "#0f0";
      tokenFeedback.textContent = "✅ Token válido! Redirecionando...";
      setTimeout(() => {
        window.location.href = "pagina-secreta.html"; // Página secreta
      }, 2000);
    } else {
      tokenFeedback.style.color = "red";
      tokenFeedback.textContent = "❌ Token incorreto.";
    }
  });

  // Validação OSINT
  validarOsintBtn.addEventListener("click", () => {
    const senhaInserida = osintInput.value.trim();
    if (!senhaInserida) {
      osintFeedback.textContent = "Digite a senha.";
      return;
    }
    if (senhaInserida === "chaos_master") {
      osintFeedback.style.color = "#0f0";
      osintFeedback.textContent = "✅ Senha correta! Acesse agora...";
      setTimeout(() => {
        window.location.href = "pagina-secreta.html"; // Mesma página secreta
      }, 2000);
    } else {
      osintFeedback.style.color = "red";
      osintFeedback.textContent = "❌ Senha errada.";
    }
  });
});
