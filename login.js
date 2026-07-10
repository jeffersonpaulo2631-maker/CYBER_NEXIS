import { login, loginAnonimo, redirectIfLoggedIn, register } from "./site.js";

redirectIfLoggedIn("index.html");

const form = document.getElementById("login-form");
const registerButton = document.getElementById("register-button");
const anonymousButton = document.getElementById("anonymous-button");
const statusEl = document.getElementById("auth-status");

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`.trim();
}

function getCredentials() {
  return {
    name: document.getElementById("name").value.trim() || "Operador",
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
  };
}

function validate(email, password) {
  if (!email || !password) {
    setStatus("Informe e-mail e senha.", "error");
    return false;
  }
  if (password.length < 6) {
    setStatus("A senha precisa ter pelo menos 6 caracteres.", "error");
    return false;
  }
  return true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { email, password } = getCredentials();
  if (!validate(email, password)) return;

  setStatus("Validando acesso...");
  try {
    await login(email, password);
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    setStatus("Falha no login. Confira e-mail, senha e provedor do Firebase.", "error");
  }
});

registerButton.addEventListener("click", async () => {
  const { name, email, password } = getCredentials();
  if (!validate(email, password)) return;

  setStatus("Criando operador...");
  try {
    await register(email, password, name);
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    setStatus("Não foi possível criar conta. Verifique se e-mail/senha está habilitado no Firebase Auth.", "error");
  }
});

anonymousButton.addEventListener("click", async () => {
  setStatus("Abrindo sessão visitante...");
  try {
    await loginAnonimo();
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    setStatus("Login anônimo falhou. Ative Anonymous no Firebase Auth.", "error");
  }
});
