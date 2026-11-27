const formFiltro = document.getElementById("formFiltroNoticias");
const cardsNoticias = Array.from(document.querySelectorAll(".noticiaCard"));
const mensagemVazia = document.querySelector(".semNoticias");
const formEmail = document.getElementById("formReceberAvisos");
const campoEmail = document.getElementById("emailAvisos");

function filtrarNoticias(categoria) {
  let visiveis = 0;
  cardsNoticias.forEach((card) => {
    const mostrar = categoria === "todas" || card.dataset.categoria === categoria;
    card.hidden = !mostrar;
    if (mostrar) visiveis++;
  });
  mensagemVazia.hidden = visiveis > 0;
  if (podeAnimar) {
    gsap.from(cardsNoticias.filter((card) => !card.hidden), {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.4,
      stagger: 0.07,
      ease: "power2.out",
      clearProps: "all",
    });
  }
}

formFiltro.addEventListener("change", (evento) => {
  if (evento.target.name !== "filtroCategoria") return;
  filtrarNoticias(evento.target.value);
  pulsar(formFiltro.querySelector(`label[for="${evento.target.id}"]`));
});

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

campoEmail.addEventListener("input", () => limparErro(campoEmail));

formEmail.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const valor = campoEmail.value.trim();
  if (!emailValido(valor)) {
    mostrarErro(campoEmail, "Digite um e-mail válido, como nome@exemplo.com.");
    campoEmail.focus();
    return;
  }
  limparErro(campoEmail);
  formEmail.reset();
  mostrarAviso("Pronto! Você vai receber os avisos do seu bairro por e-mail.");
});

animarEntrada(".noticiaMainDestaque > *");
animarEntrada(".avisoCard", 0.2);
animarEntrada(".noticiaCard", 0.35);
animarEntrada("aside section", 0.3);
