export function mostrarEtapa(steps, index) {
  steps.forEach((step, i) => {
    step.style.display = i === index ? 'block' : 'none';
  });
}

export function atualizarProgresso(bar, currentStep, totalSteps) {
  const percent = ((currentStep + 1) / totalSteps) * 100;
  bar.style.width = percent + '%';
}