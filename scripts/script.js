const API_URL = "http://localhost:8080"



document.addEventListener('input', function (event) {
    const elemento = event.target;

    if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {

        // Ignora arquivos, senhas, e-mails e a classe de exceção
        if (elemento.type === 'file' ||
            elemento.type === 'password' ||
            elemento.type === 'email' ||
            elemento.classList.contains('ignorar-maiusculo')) {
            return;
        }

        const tiposValidos = ['text', 'search', 'url', 'tel'];
        if (elemento.tagName === 'TEXTAREA' || tiposValidos.includes(elemento.type)) {

            const start = elemento.selectionStart;
            const end = elemento.selectionEnd;

            elemento.value = elemento.value.toUpperCase();

            elemento.setSelectionRange(start, end);
        }
    }

    const formAdocao = document.querySelector('.form-adocao form');
    if (formAdocao) {
        formAdocao.addEventListener('submit', (e) => enviarSolicitacao(e, 'Adoção'));
    }

    // Adiciona o ouvinte para o formulário de APADRINHAMENTO
    const formApadrinha = document.querySelector('.form-apadrinha form');
    if (formApadrinha) {
        formApadrinha.addEventListener('submit', (e) => enviarSolicitacao(e, 'Apadrinhamento'));
    }
});



document.addEventListener('DOMContentLoaded', () => {



    carregarAnimaisPublico()
    carregarDiaADia();





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

async function carregarDiaADia() {
    try {
        const response = await fetch(`${API_URL}/diario`);

        if (response.ok) {
            const diarios = await response.json();
            renderizarCarrosselDiaADia(diarios);
        } else {
            console.error('Erro ao buscar publicações do Dia-a-Dia.');
        }
    } catch (error) {
        console.error('Erro de conexão com a API:', error);
    }
}

function renderizarCarrosselDiaADia(diarios) {
    const carousel = document.getElementById('dia-a-dia-dinamico');
    if (!carousel) return;

    // Salva os botões antes de limpar o carrossel
    const btnPrev = carousel.querySelector('.prev');
    const btnNext = carousel.querySelector('.next');

    // Limpa o conteúdo atual (remove o HTML estático)
    carousel.innerHTML = '';

    if (diarios.length === 0) {
        carousel.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center; padding: 2rem;">Nenhuma atualização recente no momento.</p>';
        return;
    }


    diarios.forEach((post, index) => {
        const div = document.createElement('div');

        div.className = `carousel-item ${index === 0 ? 'active' : ''}`;


        const imgSrc = post.foto && post.foto !== 'null' ? post.foto : 'assets/imgs/default-placeholder.jpeg';


        div.innerHTML = `
            <img src="${imgSrc}" alt="${post.nome || 'Dia-a-dia'}">
            <p>${post.descricao || 'Rotina de amor no abrigo.'}</p>
        `;

        carousel.appendChild(div);
    });


    if (diarios.length > 1) {
        if (btnPrev) carousel.appendChild(btnPrev);
        if (btnNext) carousel.appendChild(btnNext);


        ativarNavegacaoCarrossel(carousel);
    }
}

function ativarNavegacaoCarrossel(carousel) {
    const items = carousel.querySelectorAll('.carousel-item');
    const btnPrev = carousel.querySelector('.prev');
    const btnNext = carousel.querySelector('.next');
    let currentIndex = 0;


    const newPrev = btnPrev.cloneNode(true);
    const newNext = btnNext.cloneNode(true);
    btnPrev.replaceWith(newPrev);
    btnNext.replaceWith(newNext);


    newPrev.addEventListener('click', () => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
        items[currentIndex].classList.add('active');
    });


    newNext.addEventListener('click', () => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
        items[currentIndex].classList.add('active');
    });
}

// ==========================================
// CARREGAR ANIMAIS NA LANDING PAGE
// ==========================================
async function carregarAnimaisPublico() {
    try {
        // Faz a requisição pública (sem fetchAutenticado)
        const response = await fetch(`${API_URL}/animal`);

        if (response.ok) {
            const animais = await response.json();

            // Filtra apenas os animais que estão marcados como disponíveis (true ou null/assumido true)
            const animaisDisponiveis = animais.filter(animal => animal.disponivel !== false);

            renderizarCarrosselAnimais(animaisDisponiveis);
            atualizarSelectsFormularios(animaisDisponiveis);
        } else {
            console.error('Erro ao buscar a lista de animais.');
        }
    } catch (error) {
        console.error('Erro de conexão com a API:', error);
    }
}

function renderizarCarrosselAnimais(animais) {
    const trackAdocao = document.querySelector('#adote .carousel-track');
    const trackApadrinhe = document.querySelector('#apadrinhe .carousel-track');

    if (!trackAdocao || !trackApadrinhe) return;

    trackAdocao.innerHTML = '';
    trackApadrinhe.innerHTML = '';

    if (animais.length === 0) {
        const msg = '<p style="color: var(--cor-texto-claro); text-align: center; width: 100%;">Nenhum animal disponível no momento.</p>';
        trackAdocao.innerHTML = msg;
        trackApadrinhe.innerHTML = msg;
        return;
    }

    animais.forEach(animal => {
        const prontuario = animal.prontuario || {};
        const idade = prontuario.idade || 'Idade não inf.';
        const vacinas = (prontuario.vacinas && prontuario.vacinas.length > 0) ? prontuario.vacinas.join(', ') : 'Não informado';

        let dataEntrada = 'Não informada';
        if (prontuario.dataEntrada) {
            dataEntrada = prontuario.dataEntrada.split('-').reverse().join('/');
        }

        const foto = animal.foto && animal.foto !== 'null' ? animal.foto : 'assets/imgs/default-placeholder.jpeg';

        const cardBaseHTML = `
            <img src="${foto}" alt="${animal.nome}">
            <div class="dados-animal">
                <h3>${animal.nome}</h3>
                <p><i class="fas fa-calendar-alt"></i> ENTRADA: ${dataEntrada}</p>
                <p><i class="fas fa-birthday-cake"></i> ${idade}</p>
                <p><i class="fas fa-syringe"></i> ${vacinas}</p>
        `;

        // ADICIONAMOS O data-id="${animal.id}" NOS BOTÕES AQUI!
        const articleAdocao = document.createElement('article');
        articleAdocao.className = 'card-animal';
        articleAdocao.innerHTML = cardBaseHTML + `
                <button class="btn-adotar" data-id="${animal.id}">ADOTAR ${animal.nome.toUpperCase()}</button>
            </div>
        `;
        trackAdocao.appendChild(articleAdocao);

        const articleApadrinhe = document.createElement('article');
        articleApadrinhe.className = 'card-animal';
        articleApadrinhe.innerHTML = cardBaseHTML + `
                <button class="btn-apadrinhar" data-id="${animal.id}">APADRINHAR ${animal.nome.toUpperCase()}</button>
            </div>
        `;
        trackApadrinhe.appendChild(articleApadrinhe);
    });

    reativarEventosDinamicos();
}

function atualizarSelectsFormularios(animais) {
    const selectAdocao = document.getElementById('animal-adocao');
    const selectApadrinha = document.getElementById('animal-apadrinha');

    // Agora o "value" do select será o ID do animal
    const optionsHTML = '<option value="">Selecione...</option>' +
        animais.map(animal => `<option value="${animal.id}">${animal.nome}</option>`).join('');

    if (selectAdocao) selectAdocao.innerHTML = optionsHTML;
    if (selectApadrinha) selectApadrinha.innerHTML = optionsHTML;
}

function reativarEventosDinamicos() {
    const formAdocao = document.querySelector('.form-adocao');
    const formApadrinha = document.querySelector('.form-apadrinha');
    const selectAnimalAdocao = document.getElementById('animal-adocao');
    const selectAnimalApadrinha = document.getElementById('animal-apadrinha');

    // Captura o ID diretamente do botão clicado
    document.querySelectorAll('.btn-adotar').forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const animalId = evento.target.getAttribute('data-id');
            if (selectAnimalAdocao) selectAnimalAdocao.value = animalId;
            formAdocao.classList.remove('hide');
            formAdocao.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.querySelectorAll('.btn-apadrinhar').forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const animalId = evento.target.getAttribute('data-id');
            if (selectAnimalApadrinha) selectAnimalApadrinha.value = animalId;
            formApadrinha.classList.remove('hide');
            formApadrinha.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const modalImagemAnimal = document.getElementById('modal-imagem-animal');
    const imgAmpliada = document.getElementById('img-ampliada');
    const tituloModalAnimal = document.getElementById('titulo-modal-animal');

    document.querySelectorAll('.card-animal img').forEach(imagem => {
        imagem.style.cursor = 'pointer';
        imagem.addEventListener('click', (evento) => {
            const cartao = evento.target.closest('.card-animal');
            if (cartao) {
                imgAmpliada.src = imagem.src;
                tituloModalAnimal.innerText = cartao.querySelector('h3').innerText;
                modalImagemAnimal.classList.remove('hide');
                document.body.classList.add('no-scroll');
            }
        });
    });
}

// ==========================================
// ENVIO DE SOLICITAÇÕES (ADOÇÃO / APADRINHAMENTO)
// ==========================================

async function enviarSolicitacao(evento, tipoFormulario) {
    evento.preventDefault(); // Impede o recarregamento da página

    const form = evento.target;
    const btnSubmit = form.querySelector('button[type="submit"]');

    // 1. TRAVA DE SEGURANÇA: Se o botão já estiver desativado, ignora os próximos cliques
    if (btnSubmit.disabled) return;
    
    // 2. Desativa o botão e altera o texto para dar feedback visual
    btnSubmit.disabled = true;
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = "ENVIANDO...";

    const nome = form.querySelector('[name="nome"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const telefone = form.querySelector('[name="telefone"]').value.trim();
    const animalId = form.querySelector('[name="animal"]').value;

    if (!animalId) {
        alert("Por favor, selecione o animal desejado na lista.");
        // Restaura o botão se der erro de validação
        btnSubmit.disabled = false;
        btnSubmit.innerText = textoOriginal;
        return;
    }

    const novaSolicitacao = {
        nome: nome,
        email: email,
        telefone: telefone,
        tipo: tipoFormulario
    };

    try {
        const response = await fetch(`${API_URL}/animal/solicitacao/${animalId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaSolicitacao)
        });

        if (response.ok) {
            alert(`Sua solicitação de ${tipoFormulario} foi enviada com sucesso! Entraremos em contato em breve.`);
            form.reset(); 
            form.closest('.hide').classList.add('hide'); 
        } else {
            alert("Erro ao enviar a solicitação. Tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
    } finally {
        // 3. O bloco "finally" executa sempre no final (dando certo ou erro)
        // Isso garante que o botão volte ao normal para usos futuros
        btnSubmit.disabled = false;
        btnSubmit.innerText = textoOriginal;
    }
}