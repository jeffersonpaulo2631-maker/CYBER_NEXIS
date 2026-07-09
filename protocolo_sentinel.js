/* =====================================================
   CYBER-NEXIS — PROTOCOLO SENTINEL NO INDEX
   Arquivo correto: protocolo_sentinel.js
   Matrix vermelho + relógio + pergunta por hora

   IMPORTANTE:
   Este arquivo é SOMENTE do Protocolo Sentinel.
   Não misture com teste_observacao.js.
   ===================================================== */

(() => {
  const SENTINEL_SCRIPT_FLAG = "__PROTOCOLO_SENTINEL_CARREGADO__";

  if (window[SENTINEL_SCRIPT_FLAG]) {
    console.warn("Protocolo Sentinel já foi carregado. Execução duplicada bloqueada.");
    return;
  }

  window[SENTINEL_SCRIPT_FLAG] = true;

  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("sentinel-matrix");
    const questionEl = document.getElementById("sentinel-question");
    const form = document.getElementById("sentinel-form");

    /*
      Se a seção Sentinel não existir nesta página,
      o arquivo simplesmente não faz nada.
      Isso evita conflito com outras páginas.
    */
    if (!canvas || !questionEl || !form) {
      console.info("Protocolo Sentinel não encontrado nesta página.");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Não foi possível iniciar o canvas do Protocolo Sentinel.");
      return;
    }

    const clockEl = document.getElementById("sentinel-clock");
    const input = document.getElementById("sentinel-answer");
    const button = document.getElementById("sentinel-button");
    const statusEl = document.getElementById("sentinel-status");
    const attemptsEl = document.getElementById("sentinel-attempts");
    const layerEl = document.getElementById("sentinel-layer");
    const windowEl = document.getElementById("sentinel-window");

    const overlay = document.getElementById("sentinel-overlay");
    const resultTitle = document.getElementById("sentinel-result-title");
    const resultMessage = document.getElementById("sentinel-result-message");

    const requiredElements = [
      clockEl,
      input,
      button,
      statusEl,
      attemptsEl,
      layerEl,
      windowEl,
      overlay,
      resultTitle,
      resultMessage
    ];

    if (requiredElements.some((element) => !element)) {
      console.error("Erro: existem elementos do Protocolo Sentinel faltando no HTML.");
      return;
    }

    let attempts = 0;
    let currentChallenge = null;
    let locked = false;
    let revealTimer = null;
    let matrixAnimationId = null;

    const CHARS = "01NEXISUMBRAREDSENTINELROOTACCESSN4";
    let columns = [];
    let fontSize = 15;

    /*
      TESTE:
      Deixe false para funcionar pela hora real.

      Para testar a rota secreta agora, troque para true.
      Depois volte para false antes de publicar.
    */
    const FORCE_SECRET_TEST = false;

    /*
      Quantas tentativas erradas antes de redirecionar.
      Use 1 para redirecionar logo no primeiro erro.
      Use 3 para deixar mais parecido com sistema de triagem.
    */
    const MAX_ATTEMPTS_BEFORE_FAIL = 1;

    const challenges = [
      {
        id: "madrugada",
        start: 0,
        end: 5,
        layer: "Observação",
        windowText: "sombria",
        question: "Eu não faço barulho, mas revelo quem observa. Onde estou?",
        answers: ["comentario", "comentarios", "html"],
        successRoute: "manual.html",
        failRoute: "Regras.html",
        secret: false,
        successTitle: "ACESSO PARCIAL",
        successMessage: "Observação aceita. A camada pública será aberta."
      },
      {
        id: "manha",
        start: 6,
        end: 11,
        layer: "Disciplina",
        windowText: "pública",
        question: "Antes de atacar, antes de defender, antes de agir. O que vem primeiro?",
        answers: ["observacao", "observar", "analise"],
        successRoute: "Regras.html",
        failRoute: "contato.html",
        secret: false,
        successTitle: "ACESSO PARCIAL",
        successMessage: "Disciplina reconhecida. Redirecionando para as regras."
      },
      {
        id: "tarde",
        start: 12,
        end: 17,
        layer: "Decodificação",
        windowText: "técnica",
        question: "01001110 01000101 01011000 01001001 01010011 forma qual palavra?",
        answers: ["nexis", "cybernexis", "cyber nexis"],
        successRoute: "serviços.html",
        failRoute: "Regras.html",
        secret: false,
        successTitle: "ACESSO PARCIAL",
        successMessage: "Decodificação aceita. Enviando para a camada de serviços."
      },
      {
        id: "noite",
        start: 18,
        end: 22,
        layer: "Padrão",
        windowText: "instável",
        question: "O falso hacker procura ferramentas. O real procura o quê?",
        answers: ["padroes", "padrao", "logica", "estrutura"],
        successRoute: "recrutamento.html",
        failRoute: "contato.html",
        secret: false,
        successTitle: "ACESSO PARCIAL",
        successMessage: "Padrão identificado. Redirecionando para recrutamento."
      },
      {
        id: "sentinel",
        start: 23,
        end: 23,
        layer: "Restrita",
        windowText: "ativa",
        question: "A porta não está escondida. Está esperando a chave. Qual é o núcleo da Cyber-Nexis?",
        answers: ["sentinel", "protocolo sentinel", "nucleo sentinel"],
        successRoute: "pagina-secreta.bkp (1).html",
        failRoute: "Regras.html",
        secret: true,
        successTitle: "ACESSO CONCEDIDO",
        successMessage: "Classificação: Operador Sentinel. Janela temporal validada. Redirecionando para o núcleo..."
      }
    ];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;

      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      fontSize = window.innerWidth < 700 ? 12 : 15;

      const count = Math.floor(width / fontSize);
      columns = Array.from({ length: count }, () => Math.random() * height);
    }

    function drawMatrix() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px Courier New`;

      columns.forEach((y, index) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = index * fontSize;
        const glow = Math.random() > 0.985;

        ctx.fillStyle = glow
          ? "rgba(255, 130, 140, 0.95)"
          : "rgba(255, 21, 53, 0.58)";

        ctx.shadowColor = "#ff1535";
        ctx.shadowBlur = glow ? 18 : 4;
        ctx.fillText(char, x, y);

        columns[index] = y > height + Math.random() * 900 ? 0 : y + fontSize;
      });

      ctx.shadowBlur = 0;
      matrixAnimationId = requestAnimationFrame(drawMatrix);
    }

    function pad(num) {
      return String(num).padStart(2, "0");
    }

    function getCurrentChallenge() {
      const hour = new Date().getHours();

      if (FORCE_SECRET_TEST) {
        return challenges.find((item) => item.id === "sentinel");
      }

      return challenges.find((item) => hour >= item.start && hour <= item.end) || challenges[0];
    }

    function updateClock() {
      const now = new Date();

      clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const nextChallenge = getCurrentChallenge();

      if (!currentChallenge || nextChallenge.id !== currentChallenge.id) {
        currentChallenge = nextChallenge;
        setupChallenge();
      }
    }

    function normalize(text = "") {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    function scrambleText(text, progress) {
      const symbols = "█▓▒░01NEXISRED";

      return text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";

          const threshold = index / text.length;

          if (threshold < progress) {
            return char;
          }

          return symbols[Math.floor(Math.random() * symbols.length)];
        })
        .join("");
    }

    function revealQuestion(text) {
      if (revealTimer) {
        clearInterval(revealTimer);
      }

      let progress = 0;

      revealTimer = setInterval(() => {
        progress += 0.045;
        questionEl.textContent = scrambleText(text, progress);

        if (progress >= 1) {
          clearInterval(revealTimer);
          revealTimer = null;
          questionEl.textContent = text;
        }
      }, 45);
    }

    function setStatus(message) {
      statusEl.innerHTML = `<span>Status:</span> ${message}`;
    }

    function setupChallenge() {
      if (!currentChallenge) return;

      locked = false;
      button.disabled = false;
      button.textContent = "VERIFICAR ACESSO";

      layerEl.textContent = currentChallenge.layer;
      windowEl.textContent = currentChallenge.windowText;

      if (currentChallenge.secret) {
        windowEl.style.color = "#00ff88";
        layerEl.style.color = "#00ff88";
      } else {
        windowEl.style.color = "";
        layerEl.style.color = "";
      }

      input.value = "";
      setStatus("aguardando operador...");
      revealQuestion(currentChallenge.question);
    }

    function showResult(type, title, message, route) {
      locked = true;
      button.disabled = true;
      button.textContent = "ANALISANDO...";

      overlay.className = "sentinel-overlay active";

      if (type === "secret") {
        overlay.classList.add("secret");
      }

      resultTitle.textContent = title;
      resultMessage.textContent = message;

      setTimeout(() => {
        window.location.href = route;
      }, 2600);
    }

    function registerFail() {
      attempts++;
      attemptsEl.textContent = attempts;

      if (attempts >= 3) {
        setStatus("muitas tentativas. Sentinel está irritada.");
      } else {
        setStatus("resposta recusada.");
      }
    }

    function handleFail() {
      registerFail();

      if (attempts >= MAX_ATTEMPTS_BEFORE_FAIL) {
        showResult(
          "fail",
          "ACESSO NEGADO",
          "Você procurou a resposta. Não procurou o padrão. Redirecionando para camada pública...",
          currentChallenge.failRoute
        );

        return;
      }

      input.value = "";
      input.focus();
    }

    function handleSuccess() {
      if (currentChallenge.secret) {
        showResult(
          "secret",
          currentChallenge.successTitle,
          currentChallenge.successMessage,
          currentChallenge.successRoute
        );

        return;
      }

      showResult(
        "partial",
        currentChallenge.successTitle,
        currentChallenge.successMessage,
        currentChallenge.successRoute
      );
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (locked || !currentChallenge) return;

      const answer = normalize(input.value);

      if (!answer) {
        setStatus("campo vazio não abre portas.");
        input.focus();
        return;
      }

      const accepted = currentChallenge.answers.includes(answer);

      if (!accepted) {
        handleFail();
        return;
      }

      handleSuccess();
    });

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("beforeunload", () => {
      if (matrixAnimationId) {
        cancelAnimationFrame(matrixAnimationId);
      }

      if (revealTimer) {
        clearInterval(revealTimer);
      }
    });

    resizeCanvas();
    drawMatrix();

    currentChallenge = getCurrentChallenge();
    setupChallenge();
    updateClock();

    setInterval(updateClock, 1000);

    console.info("CYBER-NEXIS // PROTOCOLO SENTINEL");
    console.info("A pergunta muda pela hora. A resposta certa só libera o núcleo na janela certa.");
  });
})();