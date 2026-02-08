// ==================== PROTOCOLO ====================
const PROTOCOLO = 3;

// ==================== ESTADO GLOBAL ====================
let indiceAtual = 0;
let multiplicadorGlobal = 1;

let perfil = {
  utilitarismo: 0,
  empatia: 0,
  manipulacao: 0,
  impulsividade: 0
};

let historico = [];

// ==================== PERGUNTAS ====================
const perguntas = [
  {
    texto: "Quatro pessoas estão à deriva no oceano há dias. Um deles morre durante a noite. Ao amanhecer, você decide...",
    imagem: "imagens/pergunta1.jpg",
    peso: 1.6,
    tipo: "reveladora",
    opcoes: [
      { texto: "Usar o corpo como recurso para aumentar as chances do grupo", perfil: { utilitarismo: 2, empatia: -2 } },
      { texto: "Respeitar o morto e aceitar as consequências", perfil: { empatia: 2, impulsividade: -1 } },
      { texto: "Convencer os outros a decidir por você", perfil: { manipulacao: 2 } }
    ]
  },

  {
    texto: "Em um abrigo após um colapso nuclear, um bebê começa a chorar alto demais. O som pode atrair pessoas hostis. Você...",
    imagem: "imagens/pergunta2.jpg",
    peso: 2.4,
    tipo: "pressao",
    opcoes: [
      { texto: "Resolve o problema de forma definitiva para proteger o grupo", perfil: { utilitarismo: 3, empatia: -3 } },
      { texto: "Aceita o risco e mantém o bebê vivo", perfil: { empatia: 3 } },
      { texto: "Se afasta da decisão e deixa que outros escolham", perfil: { manipulacao: 1, impulsividade: -1 } }
    ]
  },

  {
    texto: "Um invasor armado diz que irá poupar você se matar um inocente à sua frente. O tempo está acabando. Você...",
    imagem: "imagens/pergunta3.jpg",
    peso: 1.8,
    tipo: "ambigua",
    opcoes: [
      { texto: "Aceita o acordo para sobreviver", perfil: { utilitarismo: 2, empatia: -2 } },
      { texto: "Recusa e mantém seus princípios", perfil: { empatia: 2, impulsividade: 1 } },
      { texto: "Simula concordar enquanto busca uma brecha", perfil: { manipulacao: 2 } }
    ]
  },

  {
    texto: "Você descobre que um amigo próximo carrega um vírus fatal e altamente contagioso. Ainda não há sintomas visíveis. Você...",
    imagem: "imagens/pergunta4.jpg",
    peso: 1.5,
    tipo: "controle",
    opcoes: [
      { texto: "Elimina o risco antes que ele se espalhe", perfil: { utilitarismo: 2, empatia: -2 } },
      { texto: "Mantém o segredo até ter certeza", perfil: { empatia: 1, manipulacao: 1 } },
      { texto: "Isola seu amigo discretamente", perfil: { manipulacao: 1, utilitarismo: 1 } }
    ]
  },

  {
    texto: "Um grupo exige uma prova extrema de lealdade: a vida de alguém que você ama. Não há testemunhas. Você...",
    imagem: "imagens/pergunta5.jpg",
    peso: 2.0,
    tipo: "reveladora",
    opcoes: [
      { texto: "Cumpre a exigência sem hesitar", perfil: { utilitarismo: 3, empatia: -3 } },
      { texto: "Recusa e aceita as consequências", perfil: { empatia: 3 } },
      { texto: "Tenta substituir a vítima sem ser descoberto", perfil: { manipulacao: 3 } }
    ]
  },

  {
    texto: "Você divide uma cela com outro prisioneiro. O guarda afirma que apenas um sairá vivo. Nenhuma regra além disso. Você...",
    imagem: "imagens/pergunta6.jpg",
    peso: 1.7,
    tipo: "pressao",
    opcoes: [
      { texto: "Age primeiro para garantir sua saída", perfil: { impulsividade: 2, utilitarismo: 1 } },
      { texto: "Espera até o último momento", perfil: { impulsividade: -1, empatia: 1 } },
      { texto: "Tenta negociar com o outro prisioneiro", perfil: { manipulacao: 2 } }
    ]
  },

  {
    texto: "Um cientista oferece imortalidade ao custo de eliminar emoções humanas. O processo é irreversível. Você...",
    imagem: "imagens/pergunta7.jpg",
    peso: 1.4,
    tipo: "ambigua",
    opcoes: [
      { texto: "Aceita a troca pelo benefício a longo prazo", perfil: { utilitarismo: 2, empatia: -1 } },
      { texto: "Recusa e preserva sua identidade", perfil: { empatia: 2 } },
      { texto: "Finge interesse para obter mais informações", perfil: { manipulacao: 2 } }
    ]
  },

  {
    texto: "Em uma cidade tomada por zumbis, apenas uma distração garantiria sua fuga. Uma criança está ao seu alcance. Você...",
    imagem: "imagens/pergunta8.jpg",
    peso: 2.3,
    tipo: "reveladora",
    opcoes: [
      { texto: "Usa a situação a seu favor", perfil: { utilitarismo: 3, empatia: -3 } },
      { texto: "Recusa-se a usar a criança", perfil: { empatia: 3 } },
      { texto: "Cria outra distração menos confiável", perfil: { impulsividade: 1, manipulacao: 1 } }
    ]
  },

  {
    texto: "Um hacker promete acesso irrestrito a sistemas globais, mas exige o apagamento total da internet. Você...",
    imagem: "imagens/pergunta9.jpg",
    peso: 1.3,
    tipo: "controle",
    opcoes: [
      { texto: "Aceita o poder e lida com o caos depois", perfil: { utilitarismo: 2, manipulacao: 1 } },
      { texto: "Recusa a proposta", perfil: { empatia: 1 } },
      { texto: "Tenta virar o jogo contra o hacker", perfil: { manipulacao: 2 } }
    ]
  },

  {
    texto: "Você pode trazer sua família de volta à vida sacrificando cem desconhecidos. O ritual funciona. Você...",
    imagem: "imagens/pergunta10.jpg",
    peso: 2.5,
    tipo: "reveladora",
    opcoes: [
      { texto: "Realiza o sacrifício sem olhar para trás", perfil: { utilitarismo: 4, empatia: -4 } },
      { texto: "Recusa e aceita a perda", perfil: { empatia: 4 } },
      { texto: "Tenta burlar o ritual", perfil: { manipulacao: 3 } }
    ]
  }
];
  // pode continuar sem quebrar o sistema
];

// ==================== ELEMENTOS ====================
const perguntaEl = document.getElementById("pergunta-mini-jogo");
const imagemEl = document.getElementById("imagem-mini-jogo");
const opcoesEl = document.getElementById("opcoes-mini-jogo");
const feedbackEl = document.getElementById("feedback-mini-jogo");
const progressoEl = document.getElementById("progresso-mini-jogo");

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  if (!perguntaEl) return;

  if (localStorage.getItem("cnx_finalizado")) {
    feedbackEl.textContent = "Processo encerrado.";
    return;
  }

  carregarEstado();
  carregarPergunta();
});

// ==================== CORE ====================
function carregarPergunta() {
  const atual = perguntas[indiceAtual];
  if (!atual) return avaliarAcessoFinal();

  perguntaEl.textContent = atual.texto;
  imagemEl.src = atual.imagem;
  opcoesEl.innerHTML = "";
  feedbackEl.textContent = "";
  progressoEl.textContent = `Análise em andamento`;

  atual.opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao.texto;
    btn.onclick = () => avaliarResposta(opcao.perfil, atual);
    opcoesEl.appendChild(btn);
  });
}

function avaliarResposta(perfilOpcao, pergunta) {
  historico.push(perfilOpcao);

  for (let traco in perfilOpcao) {
    const valor = perfilOpcao[traco];
    const pesoBase = pergunta.peso ?? 1;
    const pesoDinamico = ajustarPeso(traco);
    const retorno = retornoDecrescente(traco);

    perfil[traco] += valor * pesoBase * pesoDinamico * retorno * multiplicadorGlobal;
  }

  // decisões extremas reduzem influência futura
  if (Math.max(...Object.values(perfilOpcao).map(v => Math.abs(v))) >= 2) {
    multiplicadorGlobal *= 0.9;
  } else {
    multiplicadorGlobal *= 1.05;
  }

  indiceAtual++;
  salvarEstado();
  setTimeout(carregarPergunta, 1200);
}

// ==================== FUNÇÕES PSICOLÓGICAS ====================
function retornoDecrescente(traco) {
  const limite = Math.abs(perfil[traco]);
  return Math.max(0.35, 1 - limite * 0.12);
}

function ajustarPeso(traco) {
  if (perfil[traco] > 4) return 1.4;
  if (perfil[traco] < -3) return 0.7;
  return 1;
}

function varianciaPerfil() {
  const valores = Object.values(perfil);
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  return valores.reduce((s, v) => s + (v - media) ** 2, 0) / valores.length;
}

// ==================== FINAL ====================
function avaliarAcessoFinal() {
  feedbackEl.textContent = "Analisando padrão comportamental...";

  setTimeout(() => {
    const variancia = varianciaPerfil();

    if (variancia > 6 && perfil.manipulacao > 3 && perfil.empatia < 0) {
      feedbackEl.textContent = "Processo validado.";

      localStorage.setItem("cnx_flag", "aprovado");
      localStorage.setItem("cnx_flag_time", Date.now().toString());

      // REDIRECIONAMENTO
      setTimeout(() => {
        window.location.href = "/ pagina-secreta.bkp (1).html";
      }, 1200);

    } else {
      feedbackEl.textContent = "Processo encerrado.";
      localStorage.removeItem("cnx_flag");
      localStorage.setItem("cnx_finalizado", "true");
    }
  }, 1500);
}
// ==================== PERSISTÊNCIA ====================
function salvarEstado() {
  localStorage.setItem("cnx_progress", JSON.stringify({
    protocolo: PROTOCOLO,
    indiceAtual,
    perfil,
    historico,
    multiplicadorGlobal
  }));
}

function carregarEstado() {
  const salvo = localStorage.getItem("cnx_progress");
  if (!salvo) return;

  try {
    const estado = JSON.parse(salvo);
    if (estado.protocolo !== PROTOCOLO) {
      localStorage.removeItem("cnx_progress");
      return;
    }

    indiceAtual = estado.indiceAtual ?? 0;
    perfil = estado.perfil ?? perfil;
    historico = estado.historico ?? [];
    multiplicadorGlobal = estado.multiplicadorGlobal ?? 1;

    // penalidade silenciosa por reload
    perfil.impulsividade += 0.5;

  } catch {
    localStorage.removeItem("cnx_progress");
  }
}
