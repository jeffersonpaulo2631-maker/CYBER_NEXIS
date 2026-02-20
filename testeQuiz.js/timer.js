let intervalo;
let tempoRestante = 20;

export function iniciarTimer(displayElement, onTimeout) {
  clearInterval(intervalo);
  tempoRestante = 20;
  displayElement.textContent = tempoRestante;

  intervalo = setInterval(() => {
    tempoRestante--;
    displayElement.textContent = tempoRestante;

    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      onTimeout();
    }
  }, 1000);
}

export function pararTimer() {
  clearInterval(intervalo);
}