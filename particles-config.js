// Configuração leve. Se a biblioteca particles.js não carregar, o site continua funcionando.
window.addEventListener("DOMContentLoaded", () => {
  if (!window.particlesJS || !document.getElementById("particles-js")) return;

  particlesJS("particles-js", {
    particles: {
      number: { value: 42, density: { enable: true, value_area: 900 } },
      color: { value: "#ff1744" },
      shape: { type: "circle" },
      opacity: { value: 0.28, random: true },
      size: { value: 2, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ff1744",
        opacity: 0.14,
        width: 1,
      },
      move: { enable: true, speed: 1.1, direction: "none", out_mode: "out" },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.24 } } },
    },
    retina_detect: true,
  });
});
