export const gabarito = {
  q1: "TLS",
  q2: "IP",
  q3: "Senha",
  q4: "Reportar"
};

export function calcularPontuacao(respostas) {
  let acertos = 0;

  for (const pergunta in gabarito) {
    if (respostas[pergunta] === gabarito[pergunta]) {
      acertos++;
    }
  }

  return acertos;
}
