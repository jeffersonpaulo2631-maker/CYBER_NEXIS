document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("acesso-oculto");

  if (!botao) return;

  const flag = localStorage.getItem("cnx_flag");
  const tempo = localStorage.getItem("cnx_flag_time");

  // valida flag
  if (flag === "observador_aprovado" && tempo) {
    const agora = Date.now();
    const limite = 5 * 60 * 1000; // 5 minutos

    if (agora - tempo <= limite) {
      botao.style.display = "block";
      return;
    }
  }

  // se falhar, limpa tudo
  localStorage.removeItem("cnx_flag");
  localStorage.removeItem("cnx_flag_time");
});