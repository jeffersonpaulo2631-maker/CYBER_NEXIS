document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // 🔌 UI
    // ================================
    const UI = {
        feedback: document.querySelector('.feedback-resposta'),
        pergunta: document.querySelector('.pergunta-enigma'),
        input: document.querySelector('.resposta-criptografia'),
        botao: document.querySelector('.verificar-resposta'),
        timer: document.querySelector('.timer'),
        barraTempo: document.querySelector('.tempo-restante'),
        log: document.querySelector('.terminal-log'),
        circulos: document.querySelectorAll('.circulo'),
        ia: document.querySelector('.ia-guardia')
    };

    // ================================
    // 🧠 STATE
    // ================================
    const STATE = {
        enigmaAtual: 0,
        tempo: 20,
        timer: null,
        codigoSecreto: [],
        erros: 0,
        respostasRapidas: 0,
        tempoTotal: 0,
        inicioResposta: null
    };

    // ================================
    // 👁 SENTINEL
    // ================================
    const SENTINEL = {
        humor: "neutro"
    };

    // ================================
    // 🌑 ENIGMAS
    // ================================
    const hora = new Date().getHours();

    const enigmasSombrio = [
        { pergunta: '🌑 Eu existo na ausência de luz...', resposta: 'sombra', palavraChave: 'umbra' },
        { pergunta: '👁️ Eu observo sem olhos...', resposta: 'sistema', palavraChave: 'watch' },
        { pergunta: '⏳ Nunca paro...', resposta: 'tempo', palavraChave: 'flow' }
    ];

    const enigmasDia = [
        { pergunta: '☀️ Eu protejo dados...', resposta: 'senha', palavraChave: 'red' },
        { pergunta: '🌐 VPN é o quê?', resposta: 'rede privada virtual', palavraChave: 'sec' },
        { pergunta: '🔌 Porta HTTP?', resposta: '80', palavraChave: 'ret' }
    ];

    const enigmasNoite = [
        { pergunta: '🌆 O que protege sistemas?', resposta: 'firewall', palavraChave: 'sun' },
        { pergunta: '💻 Quem invade sistemas?', resposta: 'hacker', palavraChave: 'set' },
        { pergunta: '🔐 Nunca compartilhar?', resposta: 'senha', palavraChave: 'key' }
    ];

    const enigmas = hora < 6 ? enigmasSombrio : hora < 18 ? enigmasDia : enigmasNoite;

    // ================================
    // 🔐 ROTAS
    // ================================
    const ROTAS = {
        admin: 'pagina-secreta.bkp (1).html',
        root: 'pagina-secreta.bkp (1).html',
        '1234': 'pagina-secreta.bkp (1).html',
        hack: 'pagina-secreta.bkp (1).html'
    };

    // ================================
    // 🧼 UTIL
    // ================================
    function normalizar(txt = "") {
        return txt.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function log(msg) {
        if (!UI.log) return;
        const p = document.createElement("p");
        p.textContent = `> ${msg}`;
        UI.log.appendChild(p);
        if (UI.log.children.length > 6) UI.log.removeChild(UI.log.firstChild);
    }

    function feedbackIA(msg, tipo = "info") {
        UI.feedback.textContent = msg;
        UI.feedback.style.color =
            tipo === "ok" ? "#00ff88" :
            tipo === "erro" ? "#ff4444" :
            "#ffffff";
    }

    // ================================
    // ⏱ TIMER
    // ================================
    function iniciarTimer() {
        clearInterval(STATE.timer);
        STATE.tempo = 20;
        STATE.inicioResposta = Date.now();

        STATE.timer = setInterval(() => {
            STATE.tempo--;

            UI.timer.textContent = `⏱ ${STATE.tempo}s`;

            const pct = (STATE.tempo / 20) * 100;
            UI.barraTempo.style.width = pct + "%";

            if (STATE.tempo <= 0) {
                clearInterval(STATE.timer);
                STATE.erros++;
                log("Tempo esgotado.");
                bloquearEntrada();
                setTimeout(proximoEnigma, 1500);
            }

        }, 1000);
    }

    // ================================
    // INPUT
    // ================================
    function bloquearEntrada() {
        UI.input.disabled = true;
        UI.botao.disabled = true;
    }

    function liberarEntrada() {
        UI.input.disabled = false;
        UI.botao.disabled = false;
    }

    // ================================
    // ENIGMA
    // ================================
    function mostrarEnigma() {
        const atual = enigmas[STATE.enigmaAtual];

        liberarEntrada();
        UI.input.value = "";

        UI.pergunta.textContent = atual.pergunta;
        feedbackIA("", "neutro");

        iniciarTimer();
    }

    // ================================
    // VERIFICAÇÃO
    // ================================
    function verificarResposta() {

        const atual = enigmas[STATE.enigmaAtual];
        const resposta = normalizar(UI.input.value);

        const tempoResposta = (Date.now() - STATE.inicioResposta) / 1000;

        STATE.tempoTotal += tempoResposta;

        if (tempoResposta < 3) STATE.respostasRapidas++;

        if (ROTAS[resposta]) {
            window.location.href = ROTAS[resposta];
            return;
        }

        if (resposta !== normalizar(atual.resposta)) {
            STATE.erros++;
            feedbackIA("✖ Acesso negado", "erro");
            bloquearEntrada();
            setTimeout(proximoEnigma, 1200);
            return;
        }

        STATE.codigoSecreto.push(atual.palavraChave);

        feedbackIA("✔ Aceito", "ok");
        bloquearEntrada();
        setTimeout(proximoEnigma, 900);
    }

    // ================================
    // PROXIMO
    // ================================
    function proximoEnigma() {
        STATE.enigmaAtual++;

        if (STATE.enigmaAtual >= enigmas.length) {
            iniciarFinal();
            return;
        }

        mostrarEnigma();
    }

    // ================================
    // FINAL
    // ================================
    function iniciarFinal() {

        UI.pergunta.textContent = "👁 SENTINEL ATIVA";
        bloquearEntrada();

        UI.botao.onclick = () => {
            const codigo = STATE.codigoSecreto.join("");

            if (codigo === "redsecret") {
                window.location.href = "final-secreto.html";
            } else if (STATE.erros === 0) {
                window.location.href = "manual.html";
            } else {
                window.location.href = "serviços.html";
            }
        };
    }

    // ================================
    // START
    // ================================
    UI.botao.addEventListener('click', verificarResposta);

    mostrarEnigma();
});
