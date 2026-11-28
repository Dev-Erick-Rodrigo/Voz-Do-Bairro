document.addEventListener("DOMContentLoaded", () => {
    const linksEmergencia = document.querySelectorAll(".heroServiceCards a");

    linksEmergencia.forEach((link) => {
        link.addEventListener("click", (evento) => {
            const numeroTelefone = link.getAttribute("href").replace("tel:", "");
            const nomeOrgao = link.parentElement.querySelector("h3").innerText;
            const Dispositivo = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (Dispositivo) {
                const confirmarLigacao = confirm(`Deseja ligar agora para ${nomeOrgao} (${numeroTelefone})?`);
                if (!confirmarLigacao) {
                    evento.preventDefault();
                }
            } else {
                evento.preventDefault();
                navigator.clipboard.writeText(numeroTelefone).then(() => {
                    const textoOriginal = link.innerText;
                    link.innerText = `Número ${numeroTelefone} copiado! ✓`;
                    link.style.color = "#6BBF00";

                    setTimeout(() => {
                        link.innerText = textoOriginal;
                        link.style.color = "";
                    }, 3000);
                });
            }
        });
    });
});
