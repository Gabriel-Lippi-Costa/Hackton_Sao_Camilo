const btnResponsavel = document.querySelector(".responsavel");
const btnAdministrador = document.querySelector(".administrador");
const formResponsavel = document.querySelector(".info-responsavel");
const formAdministrador = document.querySelector(".info-administrador");

btnResponsavel.addEventListener("click", () => {
  btnResponsavel.classList.add("ativo");
  btnAdministrador.classList.remove("ativo");

  formResponsavel.style.display = "block";
  formAdministrador.style.display = "none";
});

btnAdministrador.addEventListener("click", () => {
  btnAdministrador.classList.add("ativo");
  btnResponsavel.classList.remove("ativo");

  formAdministrador.style.display = "block";
  formResponsavel.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {
  btnResponsavel.click();
});
