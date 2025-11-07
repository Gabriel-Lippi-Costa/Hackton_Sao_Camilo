const btnCriarPerfil = document.querySelector(".criar-perfil button");
const modalContainer = document.getElementById("modal-criar-perfil");
const btnCancelar = document.getElementById("cancelar");
const formCriar = document.getElementById("form-criar-perfil");
const cardsContainer = document.querySelector(".cards");

btnCriarPerfil.addEventListener("click", () => {
  modalContainer.classList.add("ativo");
});

btnCancelar.addEventListener("click", () => {
  modalContainer.classList.remove("ativo");
});

modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    modalContainer.classList.remove("ativo");
  }
});

formCriar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value.trim();
  const parentesco = document.getElementById("parentesco").value.trim();

  if (!nome || !idade || !parentesco) return;

  const card = document.createElement("section");
  card.classList.add("card");
  card.innerHTML = `
    <i class="bi bi-person"></i>
    <span class="nome-paciente">${nome}</span>
    <span class="info-paciente">${idade} anos - ${parentesco}</span>
    <i class="bi bi-trash"></i>
  `;

  cardsContainer.appendChild(card);

  modalContainer.classList.remove("ativo");
  formCriar.reset();

  card.querySelector(".bi-trash").addEventListener("click", () => {
    card.remove();
  });
});
