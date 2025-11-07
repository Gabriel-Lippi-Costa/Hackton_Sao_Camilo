const btnResp = document.querySelector(".responsavel");
const btnAdm = document.querySelector(".administrador");
const formResp = document.querySelector(".info-responsavel");
const formAdm = document.querySelector(".info-administrador");

// Alternar entre os tipos de usuário
btnResp.addEventListener("click", () => {
  btnResp.classList.add("ativo");
  btnAdm.classList.remove("ativo");
  formResp.classList.add("ativo");
  formAdm.classList.remove("ativo");
});

btnAdm.addEventListener("click", () => {
  btnAdm.classList.add("ativo");
  btnResp.classList.remove("ativo");
  formAdm.classList.add("ativo");
  formResp.classList.remove("ativo");
});

window.addEventListener("DOMContentLoaded", () => {
  btnResp.click();
});
