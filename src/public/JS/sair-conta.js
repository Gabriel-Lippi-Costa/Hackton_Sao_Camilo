const btnSair = document.querySelector("header button");

  btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");

    localStorage.clear();

    window.location.href = "index.html";
  });