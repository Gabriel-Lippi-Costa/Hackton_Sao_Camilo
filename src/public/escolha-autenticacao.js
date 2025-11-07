// Seleciona os botões e formulários
const btnResponsavel = document.querySelector(".responsavel");
const btnAdministrador = document.querySelector(".administrador");
const formResponsavel = document.querySelector(".info-responsavel");
const formAdministrador = document.querySelector(".info-administrador");

// Função para mostrar o formulário do Responsável
btnResponsavel.addEventListener("click", () => {
  // adiciona a classe ativo ao botão clicado
  btnResponsavel.classList.add("ativo");
  btnAdministrador.classList.remove("ativo");

  // mostra o form correspondente e esconde o outro
  formResponsavel.style.display = "block";
  formAdministrador.style.display = "none";
});

// Função para mostrar o formulário do Administrador
btnAdministrador.addEventListener("click", () => {
  btnAdministrador.classList.add("ativo");
  btnResponsavel.classList.remove("ativo");

  formAdministrador.style.display = "block";
  formResponsavel.style.display = "none";
});

// Exibe o formulário do Responsável como padrão ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  btnResponsavel.click();
});
