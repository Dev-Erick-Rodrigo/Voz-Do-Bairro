const formFiltro = document.getElementById("formFiltroAvaliacoes");
const listaAvaliacoes = document.querySelector(".listaAvaliacoes");
const cardsAvaliacoes = Array.from(document.querySelectorAll(".avaliacaoCard"));
const mensagemVazia = document.querySelector(".semAvaliacoes");
const formAvaliacao = document.getElementById("formAvaliacao");
const rotulosEstrelas = Array.from(
  document.querySelectorAll(".notaAvaliacao label"),
);
const campoComentario = document.getElementById("comentario");
const contador = document.getElementById("contadorComentario");

function notaDoFiltro(valor) {
  return valor === "todas" ? null : Number(valor);
}

function passaNoFiltro(card, valor) {
  const nota = Number(card.dataset.nota);
  if (valor === "todas") return true;
  if (valor === "3") return nota <= 3;
  return nota === Number(valor);
}

function ordenarCards(criterio) {
  const copia = [...cardsAvaliacoes];
  copia.sort((a, b) => {
    if (criterio === "antigas") return a.dataset.data.localeCompare(b.dataset.data);
    if (criterio === "maiorNota") return b.dataset.nota - a.dataset.nota;
    if (criterio === "menorNota") return a.dataset.nota - b.dataset.nota;
    return b.dataset.data.localeCompare(a.dataset.data);
  });
  copia.forEach((card) => listaAvaliacoes.insertBefore(card, mensagemVazia));
}

function atualizarLista() {
  const filtro = formFiltro.filtroNota.value;
  ordenarCards(formFiltro.ordenar.value);
  let visiveis = 0;
  cardsAvaliacoes.forEach((card) => {
    const mostrar = passaNoFiltro(card, filtro);
    card.hidden = !mostrar;
    if (mostrar) visiveis++;
  });
  mensagemVazia.hidden = visiveis > 0;
  if (podeAnimar) {
    gsap.from(cardsAvaliacoes.filter((card) => !card.hidden), {
      opacity: 0,
      y: 16,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "all",
    });
  }
}

formFiltro.addEventListener("change", atualizarLista);
formFiltro.addEventListener("submit", (evento) => evento.preventDefault());

listaAvaliacoes.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".botaoUtil");
  if (!botao) return;
  const marcado = botao.getAttribute("aria-pressed") === "true";
  const total = Number(botao.dataset.total) + (marcado ? 0 : 1);
  botao.setAttribute("aria-pressed", String(!marcado));
  botao.querySelector("span").textContent = marcado
    ? botao.dataset.total
    : total;
  pulsar(botao);
});

function pintarEstrelas(ate) {
  rotulosEstrelas.forEach((rotulo, indice) => {
    rotulo.classList.toggle("ativa", indice < ate);
  });
}

function notaSelecionada() {
  const marcada = formAvaliacao.querySelector('input[name="nota"]:checked');
  return marcada ? Number(marcada.value) : 0;
}

rotulosEstrelas.forEach((rotulo, indice) => {
  rotulo.addEventListener("mouseenter", () => pintarEstrelas(indice + 1));
  rotulo.addEventListener("mouseleave", () => pintarEstrelas(notaSelecionada()));
});

formAvaliacao.addEventListener("change", (evento) => {
  if (evento.target.name !== "nota") return;
  pintarEstrelas(notaSelecionada());
  const rotulo = formAvaliacao.querySelector(`label[for="${evento.target.id}"]`);
  pulsar(rotulo);
  const erroNota = document.getElementById("erroNota");
  if (erroNota) erroNota.remove();
});

campoComentario.addEventListener("input", () => {
  contador.textContent = `${campoComentario.value.length}/300`;
  limparErro(campoComentario);
});

["nomeAvaliacao", "bairroAvaliacao"].forEach((id) => {
  document.getElementById(id).addEventListener("input", (evento) => {
    limparErro(evento.target);
  });
});

function mostrarErroNota() {
  if (document.getElementById("erroNota")) return;
  const erro = document.createElement("p");
  erro.className = "erroCampo";
  erro.id = "erroNota";
  erro.textContent = "Escolha uma nota de 1 a 5 estrelas.";
  formAvaliacao.querySelector(".notaAvaliacao").insertAdjacentElement("afterend", erro);
  tremer(erro);
}

formAvaliacao.addEventListener("submit", (evento) => {
  evento.preventDefault();
  let primeiroComErro = null;

  if (notaSelecionada() === 0) {
    mostrarErroNota();
    primeiroComErro = formAvaliacao.querySelector("#nota-1");
  }

  [
    { id: "nomeAvaliacao", mensagem: "Digite seu nome." },
    { id: "bairroAvaliacao", mensagem: "Digite o seu bairro." },
    { id: "comentario", mensagem: "Escreva um comentário sobre a plataforma." },
  ].forEach(({ id, mensagem }) => {
    const campo = document.getElementById(id);
    if (campo.value.trim() === "") {
      mostrarErro(campo, mensagem);
      if (!primeiroComErro) primeiroComErro = campo;
    } else {
      limparErro(campo);
    }
  });

  if (primeiroComErro) {
    primeiroComErro.focus();
    return;
  }

  formAvaliacao.reset();
  pintarEstrelas(0);
  contador.textContent = "0/300";
  mostrarAviso("Avaliação enviada! Ela será analisada pela equipe em até 48 horas.");
});

document.querySelectorAll(".perguntasFrequentes details").forEach((detalhe) => {
  detalhe.addEventListener("toggle", () => {
    if (!detalhe.open || !podeAnimar) return;
    gsap.from(detalhe.querySelector("p"), {
      opacity: 0,
      y: -8,
      duration: 0.35,
      ease: "power2.out",
    });
  });
});

if (podeAnimar) {
  document.querySelectorAll("progress").forEach((barra) => {
    const valor = Number(barra.getAttribute("value"));
    gsap.fromTo(
      barra,
      { value: 0 },
      { value: valor, duration: 1, delay: 0.5, ease: "power2.out" },
    );
  });
}

animarEntrada(".avaliacaoMainDestaque > *");
animarEntrada(".resumoAvaliacoes", 0.2);
animarEntrada(".avaliacaoCard", 0.35);
animarEntrada("aside section", 0.3);
