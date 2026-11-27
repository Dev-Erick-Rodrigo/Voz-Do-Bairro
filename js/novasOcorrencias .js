const formOcorrencia = document.getElementById("formOcorrencia");
const numeroOcorrencia = document.getElementById("numeroOcorrencia");
const selo = document.querySelector(".rascunho");
const campoFotos = document.getElementById("fotos");
const textoFotos = document.querySelector(".semFotos");
const botaoSalvar = document.querySelector(".salvar");
const botaoLocalizacao = document.querySelector(".minhaLocalizacao");
const CHAVE_RASCUNHO = "vozDoBairroRascunho";
const TEXTO_PROTOCOLO = "Aqui vai gerar quando a ocorrência for postada";

const camposObrigatorios = [
  { id: "campoTituloOcorrencia", mensagem: "Escreva um título para a ocorrência." },
  { id: "ruaEnumero", mensagem: "Informe a rua e o número." },
  { id: "bairro", mensagem: "Informe o bairro." },
  { id: "descricao", mensagem: "Descreva o que está acontecendo." },
];

function lerFormulario() {
  const dados = new FormData(formOcorrencia);
  return {
    titulo: dados.get("campoTituloOcorrencia"),
    categoria: dados.get("categoria"),
    rua: dados.get("ruaEnumero"),
    bairro: dados.get("bairro"),
    descricao: dados.get("descricao"),
    nivel: dados.get("nivel"),
  };
}

function preencherFormulario(rascunho) {
  formOcorrencia.campoTituloOcorrencia.value = rascunho.titulo || "";
  formOcorrencia.ruaEnumero.value = rascunho.rua || "";
  formOcorrencia.bairro.value = rascunho.bairro || "";
  formOcorrencia.descricao.value = rascunho.descricao || "";
  const categoria = formOcorrencia.querySelector(
    `input[name="categoria"][value="${rascunho.categoria}"]`,
  );
  const nivel = formOcorrencia.querySelector(
    `input[name="nivel"][value="${rascunho.nivel}"]`,
  );
  if (categoria) categoria.checked = true;
  if (nivel) nivel.checked = true;
}

function validarFormulario() {
  let primeiroComErro = null;
  camposObrigatorios.forEach(({ id, mensagem }) => {
    const campo = document.getElementById(id);
    if (campo.value.trim() === "") {
      mostrarErro(campo, mensagem);
      if (!primeiroComErro) primeiroComErro = campo;
    } else {
      limparErro(campo);
    }
  });
  if (primeiroComErro) primeiroComErro.focus();
  return primeiroComErro === null;
}

function gerarProtocolo() {
  const ano = new Date().getFullYear();
  const numero = Math.floor(10000 + Math.random() * 90000);
  return `VB-${ano}-${numero}`;
}

function mostrarFotos() {
  const arquivos = Array.from(campoFotos.files);
  if (arquivos.length === 0) {
    textoFotos.textContent = "Nenhuma foto adicionada ainda.";
    textoFotos.classList.remove("comFotos");
    return;
  }
  const nomes = arquivos.map((arquivo) => arquivo.name).join(", ");
  const plural = arquivos.length > 1 ? "fotos adicionadas" : "foto adicionada";
  textoFotos.textContent = `${arquivos.length} ${plural}: ${nomes}`;
  textoFotos.classList.add("comFotos");
  pulsar(textoFotos);
}

campoFotos.addEventListener("change", mostrarFotos);

formOcorrencia.addEventListener("change", (evento) => {
  if (evento.target.type === "radio") {
    pulsar(formOcorrencia.querySelector(`label[for="${evento.target.id}"]`));
  }
});

formOcorrencia.addEventListener("input", (evento) => {
  if (evento.target.getAttribute("aria-invalid") === "true") {
    limparErro(evento.target);
  }
});

botaoSalvar.addEventListener("click", () => {
  const salvou = guardar(CHAVE_RASCUNHO, lerFormulario());
  mostrarAviso(
    salvou
      ? "Rascunho salvo neste navegador."
      : "Não foi possível salvar o rascunho neste navegador.",
  );
});

botaoLocalizacao.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    mostrarAviso("Seu navegador não permite usar a localização.");
    return;
  }
  mostrarAviso("Buscando sua localização...");
  navigator.geolocation.getCurrentPosition(
    (posicao) => {
      const { latitude, longitude } = posicao.coords;
      formOcorrencia.ruaEnumero.value = `Lat ${latitude.toFixed(5)}, Long ${longitude.toFixed(5)}`;
      limparErro(formOcorrencia.ruaEnumero);
      mostrarAviso("Localização preenchida. Ajuste a rua e o número se precisar.");
    },
    () => mostrarAviso("Não consegui pegar sua localização. Preencha manualmente."),
  );
});

formOcorrencia.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!validarFormulario()) return;

  const protocolo = gerarProtocolo();
  numeroOcorrencia.textContent = protocolo;
  selo.textContent = "Enviada";
  selo.classList.add("enviada");
  apagar(CHAVE_RASCUNHO);
  formOcorrencia.reset();
  mostrarFotos();
  mostrarAviso(`Ocorrência enviada! Seu protocolo é ${protocolo}.`);
  pulsar(selo);
  window.scrollTo({ top: 0, behavior: reduzMovimento ? "auto" : "smooth" });
});

const rascunhoSalvo = ler(CHAVE_RASCUNHO);
if (rascunhoSalvo) {
  preencherFormulario(rascunhoSalvo);
  numeroOcorrencia.textContent = TEXTO_PROTOCOLO;
  mostrarAviso("Recuperamos o rascunho que você salvou.");
}

animarEntrada(".ocorrenciaMainAlerta > *");
animarEntrada(".ocorrenciaCartao", 0.2);
animarEntrada("aside section", 0.35);
