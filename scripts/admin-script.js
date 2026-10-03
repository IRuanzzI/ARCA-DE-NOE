document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const dashCards = document.querySelectorAll('.dash-card');
    const botoesVoltar = document.querySelectorAll('.btn-voltar-dash');
    const sections = document.querySelectorAll('.admin-section');

    function alternarSecao(targetId) {
        navButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        sections.forEach(sec => sec.classList.add('hide'));
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hide');
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            alternarSecao(button.getAttribute('data-target'));
        });
    });

    dashCards.forEach(card => {
        card.addEventListener('click', () => {
            alternarSecao(card.getAttribute('data-target'));
        });
    });

    botoesVoltar.forEach(botao => {
        botao.addEventListener('click', () => {
            alternarSecao('dashboard');
        });
    });
});