// Easter egg visual. Não use isso como segurança real.
const codigoSecreto = "nexis";
let bufferSecreto = "";

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  bufferSecreto += event.key.toLowerCase();
  bufferSecreto = bufferSecreto.slice(-codigoSecreto.length);

  if (bufferSecreto === codigoSecreto) ativarAcessoSecreto();
});

function ativarAcessoSecreto() {
  if (document.querySelector(".secret-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "secret-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-live", "polite");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(0,0,0,.92);
    color: #00ff88;
    font-family: monospace;
    text-align: center;
  `;

  const card = document.createElement("div");
  card.style.cssText = `
    max-width: 520px;
    padding: 28px;
    border: 1px solid #00ff88;
    border-radius: 18px;
    box-shadow: 0 0 28px rgba(0,255,136,.38);
    background: rgba(0,20,10,.72);
  `;

  const title = document.createElement("h2");
  title.textContent = "ACESSO OCULTO DETECTADO";

  const text = document.createElement("p");
  text.textContent = "Protocolo Cyber-Nexis liberado. Redirecionando para o painel simbólico.";

  card.append(title, text);
  overlay.append(card);
  document.body.appendChild(overlay);

  setTimeout(() => {
    window.location.href = "cyber-nexis-comando.html";
  }, 1800);
}
