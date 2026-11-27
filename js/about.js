
gsap.registerPlugin(ScrollTrigger);
const secoes = gsap.utils.toArray(
    "main > section, .mainFooter"
);

secoes.forEach((secao) => {

    gsap.fromTo(secao,

        {
            opacity: 0,
            y: 70
        },

        {
            opacity: 1,
            y: 0,

            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
                trigger: secao,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }

    );

});

document.addEventListener("DOMContentLoaded", () => {
    const newsForm = document.querySelector(".newsForm");
    const phoneInput = document.querySelector(".userPhone");

    if (phoneInput){
        phoneInput.addEventListener("input", (event) => {
            let value = event.target.value.replace(/\D/g,"");

            if (value.length > 11){
                value = value.slice(0,11);
            }

            if (value.length > 6){
                event.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 2){
                event.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                event.target.value = `(${value}`;
            }
        });
    }
    if (newsForm) {
        newsForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const userNameInput = document.getElementById("userName");
            const userEmailInput = document.getElementById("userEmail");
            const submitBtn = newsForm.querySelector(".submitFormBtn");

            const userName = userNameInput.value.trim();
            const userEmail = userEmailInput.value.trim();

            if (!userName || !userEmail) return;

            const existingFeedback = newsForm.querySelector(".formFeedbackMessage");
            if (existingFeedback) {
                existingFeedback.remove();
            }

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Enviado!";
            submitBtn.disabled = true;

            const feedbackMessage = document.createElement("p");
            feedbackMessage.className = "formFeedbackMessage";
            feedbackMessage.innerText = `Obrigado, ${userName}! A sua inscrição foi realizada com sucesso. Você receberá as novidades e avisos da sua região.`;

            Object.assign(feedbackMessage.style, {
                color: "#2d421e",
                backgroundColor: "#eefff0",
                padding: "14px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                marginTop: "8px",
                maxWidth: "720px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
            });

            newsForm.appendChild(feedbackMessage);
            newsForm.reset();

            setTimeout(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }, 4000);
        });
    }
});
