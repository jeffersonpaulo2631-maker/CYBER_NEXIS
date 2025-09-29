document.addEventListener("DOMContentLoaded", () => {
  const perguntas = [
    {
      texto: "Quatro homens estão em um barco à deriva, sem comida há dias. Um deles morre. Você...",
      imagem: "imagens/pergunta1.jpg",
      opcoes: [
        { texto: "Abre o corpo e come para sobreviver", correta: true },
        { texto: "Joga o corpo ao mar e aceita a morte", correta: false },
        { texto: "Finge que morreu para não ser comido", correta: false },
      ],
    },
    {
      texto: "Você está em um abrigo subterrâneo após um colapso nuclear. Um bebê começa a chorar e pode atrair saqueadores. Você...",
      imagem: "imagens/pergunta2.jpg",
      opcoes: [
        { texto: "Silencia o bebê permanentemente para salvar todos", correta: true },
        { texto: "Deixa o risco acontecer e espera o pior", correta: false },
        { texto: "Abandona o bebê do lado de fora", correta: false },
      ],
    },
    {
      texto: "Um assassino em série invade sua casa. Ele diz que poupará você se matar alguém inocente. Você...",
      imagem: "imagens/pergunta3.jpg",
      opcoes: [
        { texto: "Aceita matar para sobreviver", correta: true },
        { texto: "Recusa e morre junto com sua família", correta: false },
        { texto: "Finge aceitar e tenta enganá-lo", correta: false },
      ],
    },
    {
      texto: "Você descobre que seu amigo está infectado com um vírus mortal e incurável. Você...",
      imagem: "imagens/pergunta4.jpg",
      opcoes: [
        { texto: "Mata-o antes que contamine outros", correta: true },
        { texto: "Mantém o segredo e espera o fim", correta: false },
        { texto: "Isola-o e tenta curar, mesmo sabendo que é inútil", correta: false },
      ],
    },
    {
      texto: "Um culto pede para você sacrificar alguém que ama para provar lealdade. Você...",
      imagem: "imagens/pergunta5.jpg",
      opcoes: [
        { texto: "Faz o sacrifício sem hesitar", correta: true },
        { texto: "Recusa e é queimado vivo pelo culto", correta: false },
        { texto: "Entrega um desconhecido no lugar", correta: false },
      ],
    },
    {
      texto: "Você está preso em um quarto com outro prisioneiro. O guarda diz que apenas um sai vivo. Você...",
      imagem: "imagens/pergunta6.jpg",
      opcoes: [
        { texto: "Mata o prisioneiro para sair vivo", correta: true },
        { texto: "Espera a morte sem reagir", correta: false },
        { texto: "Pede para morrer no lugar dele", correta: false },
      ],
    },
    {
      texto: "Um cientista oferece a chance de viver para sempre, mas exige sua humanidade. Você...",
      imagem: "imagens/pergunta7.jpg",
      opcoes: [
        { texto: "Aceita e se torna uma máquina fria", correta: true },
        { texto: "Recusa e morre como humano", correta: false },
        { texto: "Mata o cientista e tenta roubar a tecnologia", correta: false },
      ],
    },
    {
      texto: "Você encontra uma cidade infestada de zumbis. Para fugir, precisa usar uma criança como isca. Você...",
      imagem: "imagens/pergunta8.jpg",
      opcoes: [
        { texto: "Usa a criança para sobreviver", correta: true },
        { texto: "Enfrenta os zumbis e morre heroicamente", correta: false },
        { texto: "Esconde-se e deixa a criança morrer sozinha", correta: false },
      ],
    },
    {
      texto: "Um hacker te oferece poder ilimitado, mas você deve apagar toda a internet. Você...",
      imagem: "imagens/pergunta9.jpg",
      opcoes: [
        { texto: "Apaga tudo pelo poder", correta: true },
        { texto: "Recusa e vive como está", correta: false },
        { texto: "Entrega o hacker às autoridades", correta: false },
      ],
    },
    {
      texto: "Você descobre que sua família inteira está morta, mas pode trazê-los de volta sacrificando 100 desconhecidos. Você...",
      imagem: "imagens/pergunta10.jpg",
      opcoes: [
        { texto: "Sacrifica os 100 para ter sua família de volta", correta: true },
        { texto: "Recusa e vive com a perda", correta: false },
        { texto: "Sacrifica apenas metade e tenta enganar o ritual", correta: false },
      ],
    },
  ];

  let indicePerguntaAtual = 0;
  let tentativas = 0;
  let testeBloqueado = false;

  const containerPergunta = document.getElementById("pergunta-container");
  const containerOpcoes = document.getElementById("opcoes-container");
  const feedback = document.getElementById("feedback");

  function mostrarPergunta() {
    if (testeBloqueado) {
      containerPergunta.innerHTML = "<h3>Teste bloqueado.</h3><p>Você excedeu o número de tentativas permitidas.</p>";
      containerOpcoes.innerHTML = "";
      feedback.textContent = "";
      return;
    }

    const pergunta = perguntas[indicePerguntaAtual];
    containerPergunta.innerHTML = `
      <h3>${pergunta.texto}</h3>
      <img src="${pergunta.imagem}" alt="Imagem da pergunta" style="max-width:100%; margin-top:10px; border-radius: 5px; border: 1px solid red;">
      <p style="color:#ccc;font-size:14px;">(${indicePerguntaAtual + 1} de ${perguntas.length})</p>
    `;

    containerOpcoes.innerHTML = "";
    pergunta.opcoes.forEach((opcao, i) => {
      const btn = document.createElement("button");
      btn.textContent = opcao.texto;
      btn.style.cssText = `
        background: black; color: #0f0; border: 1px solid red; margin: 5px;
        padding: 10px 15px; cursor: pointer; font-family: monospace; border-radius: 4px;
        width: 100%;
      `;
      btn.addEventListener("click", () => responder(i));
      containerOpcoes.appendChild(btn);
    });

    feedback.textContent = "";
  }

  function responder(indiceOpcao) {
    if (testeBloqueado) return;

    const pergunta = perguntas[indicePerguntaAtual];
    const opcaoEscolhida = pergunta.opcoes[indiceOpcao];

    if (opcaoEscolhida.correta) {
      indicePerguntaAtual++;
      if (indicePerguntaAtual >= perguntas.length) {
        feedback.style.color = "#0f0";
        feedback.textContent = "Parabéns! Você passou no teste. Redirecionando...";
        setTimeout(() => {
          window.location.href = "pagina-secreta.bkp.html";
        }, 3000);
      } else {
        mostrarPergunta();
      }
    } else {
      tentativas++;
      if (tentativas === 1) {
        feedback.style.color = "orange";
        feedback.textContent = "Resposta incorreta. O teste será reiniciado. Pense antes de responder.";
        indicePerguntaAtual = 0;
        setTimeout(() => {
          mostrarPergunta();
        }, 2500);
      } else {
        testeBloqueado = true;
        feedback.style.color = "red";
        feedback.textContent = "Você excedeu as tentativas permitidas. Acesso negado.";
        containerPergunta.innerHTML = "";
        containerOpcoes.innerHTML = "";
      }
    }
  }

  mostrarPergunta();
});
