 const API_URL = "http://localhost:8080"

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
    const botoesApadrinhar = document.querySelectorAll('.btn-apadrinhar');
    const formAdocao = document.querySelector('.form-adocao');
    const formApadrinha = document.querySelector('.form-apadrinha');

    // Seletores específicos para cada formulário
    const selectAnimalAdocao = document.getElementById('animal-adocao');
    const selectAnimalApadrinha = document.getElementById('animal-apadrinha');
    const btnFecharAdocao = document.getElementById('fechar-adocao');
    const btnFecharApadrinha = document.getElementById('fechar-apadrinha');

    // Lógica de Adoção
    botoesAdotar.forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const cartao = evento.target.closest('.card-animal');
            const nomeAnimal = cartao.querySelector('h3').innerText.toLowerCase();

            if (selectAnimalAdocao) {
                Array.from(selectAnimalAdocao.options).forEach((opcao, index) => {
                    if (opcao.text.toLowerCase() === nomeAnimal) {
                        selectAnimalAdocao.selectedIndex = index;
                    }
                });
            }

            formAdocao.classList.remove('hide');
            formAdocao.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (btnFecharAdocao) {
        btnFecharAdocao.addEventListener('click', () => {
            formAdocao.classList.add('hide');
        });
    }

    // Lógica de Apadrinhamento
    botoesApadrinhar.forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const cartao = evento.target.closest('.card-animal');
            const nomeAnimal = cartao.querySelector('h3').innerText.toLowerCase();

            if (selectAnimalApadrinha) {
                Array.from(selectAnimalApadrinha.options).forEach((opcao, index) => {
                    if (opcao.text.toLowerCase() === nomeAnimal) {
                        selectAnimalApadrinha.selectedIndex = index;
                    }
                });
            }
            formApadrinha.classList.remove('hide');
            formApadrinha.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (btnFecharApadrinha) {
        btnFecharApadrinha.addEventListener('click', () => {
            formApadrinha.classList.add('hide');
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
            entrar();
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

    // ==========================================
    // MODAL DE AMPLIAÇÃO DE IMAGEM DO ANIMAL (CORRIGIDO)
    // ==========================================
    const imagensCards = document.querySelectorAll('.card-animal img');
    const modalImagemAnimal = document.getElementById('modal-imagem-animal');
    const imgAmpliada = document.getElementById('img-ampliada');
    const tituloModalAnimal = document.getElementById('titulo-modal-animal');
    const btnFecharModalImagem = document.getElementById('fechar-modal-imagem');

    if (modalImagemAnimal && imgAmpliada) {
        imagensCards.forEach(imagem => {
            imagem.style.cursor = 'pointer';
            
            // Removemos eventos antigos duplicados para evitar conflitos
            imagem.replaceWith(imagem.cloneNode(true));
        });

        // Reatribui os ouvintes aos novos elementos limpos
        document.querySelectorAll('.card-animal img').forEach(imagem => {
            imagem.style.cursor = 'pointer';
            imagem.addEventListener('click', (evento) => {
                const cartao = evento.target.closest('.card-animal');
                if (cartao) {
                    const h3 = cartao.querySelector('h3');
                    const nomeAnimal = h3 ? h3.innerText : 'Animal';
                    
                    // Usa diretamente a propriedade src da imagem clicada
                    imgAmpliada.src = imagem.src;
                    tituloModalAnimal.innerText = nomeAnimal;

                    modalImagemAnimal.classList.remove('hide');
                    document.body.classList.add('no-scroll');
                }
            });
        });

        if (btnFecharModalImagem) {
            btnFecharModalImagem.addEventListener('click', () => {
                modalImagemAnimal.classList.add('hide');
                document.body.classList.remove('no-scroll');
            });
        }

        modalImagemAnimal.addEventListener('click', (evento) => {
            if (evento.target === modalImagemAnimal) {
                modalImagemAnimal.classList.add('hide');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    //TEXTO ANIMADO

    const elemento = document.getElementById('texto-animado');
    const textoCompleto = elemento.getAttribute('data-text');
    elemento.textContent = '';

    // Função que digita letra por letra
    function digitar(elemento, texto, index = 0) {
        if (index < texto.length) {
            elemento.textContent += texto.charAt(index);
            setTimeout(() => digitar(elemento, texto, index + 1), 20); //controle por MS
        }
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                digitar(elemento, textoCompleto);
                observador.disconnect(); // Para de observar depois que digita a primeira vez
            }
        });
    });

    observador.observe(elemento);



});

async function entrar() {
    const nome = document.getElementById("admin-user").value.trim();
    const senha = document.getElementById("admin-pass").value.trim();
    const mensagemErro = document.getElementById("erro");
    mensagemErro.textContent = "";

    try {
        const resposta = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nome, senha: senha })
        });

        if (resposta.status === 200) {
            const data = await resposta.json();
            if (data.token) localStorage.setItem('jwt_token', data.token);
            if (data.nome) {
                localStorage.setItem('nome', data.nome);
            }
            if (data.cargo) localStorage.setItem('cargo', data.cargo);
            if (data.id) localStorage.setItem('usuario.id', data.id);
            window.location.href = 'admin.html'
            

        } else {
            mensagemErro.textContent = "Usuário ou senha incorretos!";
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        mensagemErro.textContent = "Erro ao conectar com o servidor. Tente novamente.";
    }
}