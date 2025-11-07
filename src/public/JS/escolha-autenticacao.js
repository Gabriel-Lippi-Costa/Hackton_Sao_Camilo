const btnResponsavel = document.querySelector(".responsavel");
const btnAdministrador = document.querySelector(".administrador");
const formResponsavel = document.querySelector(".info-responsavel");
const formAdministrador = document.querySelector(".info-administrador");
const botaoEntrar = document.querySelector(".confirmar-dados button");

let tipoUsuario = "responsavel"; // por padrão
const baseURL = "http://localhost:3000"; // backend Express

// === Alternar formulários ===
btnResponsavel.addEventListener("click", () => {
  tipoUsuario = "responsavel";
  btnResponsavel.classList.add("ativo");
  btnAdministrador.classList.remove("ativo");
  formResponsavel.style.display = "block";
  formAdministrador.style.display = "none";
});

btnAdministrador.addEventListener("click", () => {
  tipoUsuario = "administrador";
  btnAdministrador.classList.add("ativo");
  btnResponsavel.classList.remove("ativo");
  formAdministrador.style.display = "block";
  formResponsavel.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {
  btnResponsavel.click(); // começa com o form do responsável
});

// === Ação do botão de login ===
botaoEntrar.addEventListener("click", async (e) => {
  e.preventDefault();

  let email, senha, endpoint;

  if (tipoUsuario === "responsavel") {
    email = document.querySelector("#email-responsavel").value.trim();
    senha = document.querySelector("#senha-responsavel").value.trim();
    endpoint = "/auth/login/cuidador";
  } else {
    email = document.querySelector("#email-administrador").value.trim();
    senha = document.querySelector("#senha-administrador").value.trim();
    endpoint = "/auth/login/funcionario";
  }

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    console.log("URL final:", `${baseURL}${endpoint}`);
    const response = await axios.post(`${baseURL}${endpoint}`, {
      email,
      senha,
    });

    console.log(response.data);
    alert(response.data.mensagem || "Login realizado com sucesso!");

    // 🔹 Salva o usuário logado no localStorage (CORREÇÃO PRINCIPAL)
    localStorage.removeItem("usuarioLogado");
    localStorage.setItem("usuarioLogado", JSON.stringify(response.data.usuario));

    // 🔹 Redireciona para a página correta
    if (tipoUsuario === "responsavel") {
      window.location.href = "escolha-perfil.html";
    } else {
      window.location.href = "painel-admin.html";
    }

  } catch (erro) {
    console.error(erro);
    if (erro.response?.data?.erro) {
      alert(erro.response.data.erro);
    } else {
      alert("Erro ao tentar fazer login. Verifique o servidor.");
    }
  }
});
