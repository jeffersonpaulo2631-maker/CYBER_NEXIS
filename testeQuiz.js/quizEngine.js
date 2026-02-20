export const gabarito = {
  q1: "TLS",
  q2: "IP",
  q3: "HTTP",
  q4: "Senha",
  q5: "RateLimit",
  q6: "Nmap",
  q7: "Reportar"
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