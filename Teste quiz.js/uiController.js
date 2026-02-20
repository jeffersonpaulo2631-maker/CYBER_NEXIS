// ===== UI CONTROLLER =====
// Responsável apenas por controle visual do quiz

export function mostrarEtapa(steps, index) {
  if (!steps || steps.length === 0) return;

  steps.forEach((step, i) => {
    step.style.display = i === index ? 'block' : 'none';
  });
}

export function atualizarProgresso(progressBar, currentStep, totalSteps) {
  if (!progressBar || totalSteps <= 0) return;

  const percent = ((currentStep + 1) / totalSteps) * 100;
  progressBar.style.width = percent + '%';
}

export function resetarProgresso(progressBar) {
  if (!progressBar) return;
  progressBar.style.width = '0%';
}
