const btnCriarPerfil = document.querySelector(".criar-perfil button");
const modalContainer = document.getElementById("modal-criar-perfil");
const btnCancelar = document.getElementById("cancelar");
const formCriar = document.getElementById("form-criar-perfil");
const cardsContainer = document.querySelector(".cards");

const baseURL = "http://localhost:3000/auth";

const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuario) {
  alert("Você precisa estar logado para acessar esta página!");
  window.location.href = "index.html";
}

document.querySelector(".nome-responsavel").innerText =
  usuario.nome;

btnCriarPerfil.addEventListener("click", () => modalContainer.classList.add("ativo"));
btnCancelar.addEventListener("click", () => modalContainer.classList.remove("ativo"));
modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) modalContainer.classList.remove("ativo");
});

function calcularIdade(dataNasc) {
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

function renderizarPacientes(pacientes) {
  cardsContainer.innerHTML = "";

  if (!pacientes.length) {
    cardsContainer.innerHTML = "<p>Nenhum perfil cadastrado ainda.</p>";
    return;
  }

  pacientes.forEach((p) => {
    const idade = calcularIdade(p.data_nascimento);
    const card = document.createElement("section");
    card.classList.add("card");
    card.innerHTML = `
      <i class="bi bi-person"></i>
      <div class="card-info">
        <span class="nome-paciente">${p.nome}</span>
        <span class="info-paciente">${idade} anos - ${p.condicoes_cronicas}</span>
      </div>
      <i class="bi bi-trash" data-id="${p.paciente_id}"></i>
    `;

    card.querySelector(".bi-trash").addEventListener("click", async () => {
      if (confirm(`Excluir o perfil de ${p.nome}?`)) {
        try {
          await axios.delete(`${baseURL}/pacientes/${p.paciente_id}`);
          alert("Perfil removido com sucesso!");
          carregarPerfis();
        } catch (erro) {
          console.error("Erro ao excluir paciente:", erro);
          alert("Erro ao excluir paciente. Verifique o servidor.");
        }
      }
    });

    cardsContainer.appendChild(card);
  });
}

async function carregarPerfis() {
  if (!usuario.cuidador_id) {
    cardsContainer.innerHTML = "<p>Somente cuidadores têm perfis vinculados.</p>";
    return;
  }

  try {
    const resposta = await axios.get(`${baseURL}/pacientes/${usuario.cuidador_id}`);
    renderizarPacientes(resposta.data.pacientes);
  } catch (erro) {
    console.error("Erro ao carregar perfis:", erro);
    cardsContainer.innerHTML = "<p>Erro ao carregar perfis do servidor.</p>";
  }
}

formCriar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value.trim();
  const parentesco = document.getElementById("parentesco").value.trim();

  if (!nome || !idade || !parentesco) {
    alert("Preencha todos os campos!");
    return;
  }

  const cuidador_id = usuario.cuidador_id || usuario.id_cuidador || null;
  const funcionario_id = usuario.funcionario_id || usuario.id_funcionario || null;

  try {
    await axios.post(`${baseURL}/pacientes`, {
      nome,
      idade,
      parentesco,
      cuidador_id,
      funcionario_id,
    });

    alert("Perfil criado com sucesso!");
    modalContainer.classList.remove("ativo");
    formCriar.reset();
    carregarPerfis();
  } catch (erro) {
    console.error("Erro ao criar perfil:", erro);
    alert("Erro ao criar perfil. Verifique o servidor.");
  }
});

carregarPerfis();
