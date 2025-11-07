const btnResp = document.querySelector(".responsavel");
const btnAdm = document.querySelector(".administrador");
const formResp = document.querySelector("#form-responsavel");
const formAdm = document.querySelector("#form-administrador");

const baseURL = "http://localhost:3000/auth"; // rota base no servidor

// === Alternância de formulários ===
btnResp.addEventListener("click", () => {
  btnResp.classList.add("ativo");
  btnAdm.classList.remove("ativo");
  formResp.parentElement.style.display = "block";
  formAdm.parentElement.style.display = "none";
});

btnAdm.addEventListener("click", () => {
  btnAdm.classList.add("ativo");
  btnResp.classList.remove("ativo");
  formAdm.parentElement.style.display = "block";
  formResp.parentElement.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {
  btnResp.click();
});

// === Envio do formulário do Responsável ===
formResp.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.querySelector("#nome-completo-responsavel").value.trim();
  const email = document.querySelector("#email-responsavel").value.trim();
  const senha = document.querySelector("#senha-responsavel").value.trim();
  const telefone = document.querySelector("#telefone-responsavel").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  try {
    const resposta = await axios.post(`${baseURL}/cadastro`, {
      nome,
      email,
      telefone,
      senha,
    });

    alert(resposta.data.mensagem || "Cadastro de responsável realizado com sucesso!");
    console.log(resposta.data);

    // Redirecionar após sucesso (opcional)
    window.location.href = "index.html";

  } catch (erro) {
    console.error(erro);
    if (erro.response?.data?.erro) {
      alert(erro.response.data.erro);
    } else {
      alert("Erro ao cadastrar responsável. Verifique o servidor.");
    }
  }
});

// === Envio do formulário do Administrador ===
formAdm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.querySelector("#nome-completo-administrador").value.trim();
  const email = document.querySelector("#email-administrador").value.trim();
  const senha = document.querySelector("#senha-administrador").value.trim();
  const telefone = document.querySelector("#telefone-administrador").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  try {
    const resposta = await axios.post(`${baseURL}/cadastro-funcionario`, {
      nome,
      email,
      telefone,
      senha,
    });

    alert(resposta.data.mensagem || "Cadastro de administrador realizado com sucesso!");
    console.log(resposta.data);

    window.location.href = "index.html";

  } catch (erro) {
    console.error(erro);
    if (erro.response?.data?.erro) {
      alert(erro.response.data.erro);
    } else {
      alert("Erro ao cadastrar administrador. Verifique o servidor.");
    }
  }
});
