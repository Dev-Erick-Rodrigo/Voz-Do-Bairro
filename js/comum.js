const temGsap = typeof gsap !== "undefined";
const reduzMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const podeAnimar = temGsap && !reduzMovimento;

function animarEntrada(seletor, atraso = 0) {
  if (!podeAnimar) return;
  gsap.from(seletor, {
    opacity: 0,
    y: 24,
    duration: 0.6,
    delay: atraso,
    stagger: 0.12,
    ease: "power2.out",
    clearProps: "all",
  });
}

function tremer(elemento) {
  if (!podeAnimar) return;
  gsap.fromTo(
    elemento,
    { x: -6 },
    { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", clearProps: "x" },
  );
}

function pulsar(elemento) {
  if (!podeAnimar) return;
  gsap.fromTo(
    elemento,
    { scale: 0.92 },
    { scale: 1, duration: 0.35, ease: "back.out(3)", clearProps: "transform" },
  );
}

let avisoAtual = null;

function mostrarAviso(mensagem) {
  if (avisoAtual) avisoAtual.remove();
  const aviso = document.createElement("div");
  aviso.className = "aviso";
  aviso.setAttribute("role", "status");
  aviso.textContent = mensagem;
  document.body.appendChild(aviso);
  avisoAtual = aviso;

  if (podeAnimar) {
    gsap.from(aviso, { opacity: 0, y: 20, duration: 0.4, ease: "power2.out" });
  }

  setTimeout(() => {
    if (avisoAtual !== aviso) return;
    if (podeAnimar) {
      gsap.to(aviso, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        onComplete: () => aviso.remove(),
      });
    } else {
      aviso.remove();
    }
  }, 4000);
}

function mostrarErro(campo, mensagem) {
  limparErro(campo);
  const erro = document.createElement("p");
  erro.className = "erroCampo";
  erro.id = campo.id + "Erro";
  erro.textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
  campo.setAttribute("aria-describedby", erro.id);
  campo.insertAdjacentElement("afterend", erro);
  tremer(campo);
}

function limparErro(campo) {
  const erro = document.getElementById(campo.id + "Erro");
  if (erro) erro.remove();
  campo.removeAttribute("aria-invalid");
  campo.removeAttribute("aria-describedby");
}

function guardar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    return false;
  }
  return true;
}

function ler(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave));
  } catch (erro) {
    return null;
  }
}

function apagar(chave) {
  try {
    localStorage.removeItem(chave);
  } catch (erro) {
    return;
  }
}

document.querySelectorAll(".duvidas button").forEach((botao) => {
  botao.addEventListener("click", () => {
    window.location.href = "./contacs.html";
  });
});
