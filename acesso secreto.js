// ===== ACESSO SECRETO CYBER-NEXIS =====

const codigoSecreto = "nexis";
let bufferSecreto = "";

document.addEventListener("keydown", (e) => {
  bufferSecreto += e.key.toLowerCase();

  if (bufferSecreto.length > codigoSecreto.length) {
    bufferSecreto = bufferSecreto.slice(-codigoSecreto.length);
  }

  if (bufferSecreto === codigoSecreto) {
    ativarAcessoSecreto();
  }
});

function ativarAcessoSecreto() {
  document.body.style.transition = "0.5s";
  document.body.style.background = "#001a0d";

  const aviso = document.createElement("div");

  aviso.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.92);
      color:#00ff88;
      z-index:9999;
      display:flex;
      justify-content:center;
      align-items:center;
      font-family:monospace;
      text-align:center;
    ">
      <div style="
        border:1px solid #00ff88;
        padding:30px;
        box-shadow:0 0 25px #00ff88;
      ">
        <h2>ACESSO OCULTO DETECTADO</h2>
        <p>Protocolo Cyber-Nexis liberado...</p>
        <p>Redirecionando para o sistema restrito.</p>
      </div>
    </div>
  `;

  document.body.appendChild(aviso);

  setTimeout(() => {
    window.location.href = "cyber_nexis_comando_real.html";
  }, 2500);
}