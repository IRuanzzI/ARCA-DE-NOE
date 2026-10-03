document.addEventListener('DOMContentLoaded', () => {

    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.carousel-item');
        const btnPrev = carousel.querySelector('.prev');
        const btnNext = carousel.querySelector('.next');
        
        let currentIndex = 0;

        function updateCarousel(newIndex) {
            items[currentIndex].classList.remove('active');
            currentIndex = (newIndex + items.length) % items.length;
            items[currentIndex].classList.add('active');
        }

        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
            });

            btnNext.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
            });
        }
    });

    const netflixCarousels = document.querySelectorAll('.carousel-netflix');

    netflixCarousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const btnPrev = carousel.querySelector('.prev-netflix');
        const btnNext = carousel.querySelector('.next-netflix');

        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                track.scrollBy({ left: -340, behavior: 'smooth' });
            });

            btnNext.addEventListener('click', () => {
                track.scrollBy({ left: 340, behavior: 'smooth' });
            });
        }
    });

    const botoesAdotar = document.querySelectorAll('.btn-adotar');
    const formAdocao = document.querySelector('.form-adocao');
    const selectAnimal = document.getElementById('animal');
    const btnFechar = document.getElementById('fechar-form');

    botoesAdotar.forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const cartao = evento.target.closest('.card-animal');
            const nomeAnimal = cartao.querySelector('h3').innerText.toLowerCase();

            if (selectAnimal) {
                Array.from(selectAnimal.options).forEach((opcao, index) => {
                    if (opcao.text.toLowerCase() === nomeAnimal) {
                        selectAnimal.selectedIndex = index;
                    }
                });
            }

            formAdocao.classList.remove('hide');
            formAdocao.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            formAdocao.classList.add('hide');
        });
    }

    const linkGerencia = document.getElementById('btn-login-nav');
    const modalLogin = document.getElementById('modal-login');
    const btnFecharLogin = document.getElementById('fechar-login');
    const formAcessoAdmin = document.getElementById('form-acesso-admin');

    if (linkGerencia) {
        linkGerencia.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            modalLogin.classList.remove('hide');
            document.body.classList.add('no-scroll'); 
        });
    }

    if (btnFecharLogin) {
        btnFecharLogin.addEventListener('click', () => {
            modalLogin.classList.add('hide');
            document.body.classList.remove('no-scroll');
        });
    }

    if (formAcessoAdmin) {
        formAcessoAdmin.addEventListener('submit', (evento) => {
            evento.preventDefault(); 
            window.location.href = 'admin.html';
        });
    }

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
});