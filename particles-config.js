particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    color: { value: "#8b0000" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ff0000",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "grab"
      }
    }
  },
  retina_detect: true
});