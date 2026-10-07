const API_URL = "http://localhost:8080"

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const dashCards = document.querySelectorAll('.dash-card');
    const botoesVoltar = document.querySelectorAll('.btn-voltar-dash');
    const sections = document.querySelectorAll('.admin-section');


    const nome = document.getElementById('name-of-user');
    const nomeLogg = localStorage.getItem('nome');
    nome.innerText = nomeLogg;

    const cargo = document.getElementById('role-of-user');
    const cargoLogg = localStorage.getItem('cargo');
    cargo.innerText = cargoLogg;





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



    const btnCancelarRegistro = document.getElementById('cancelarRegistro');
    const botaoRegistrarAnimal = document.getElementById('btnAddAnimal');

    const formulario = document.querySelector('.form-animal');

    if (botaoRegistrarAnimal && formulario) {
        botaoRegistrarAnimal.addEventListener('click', (evento) => {
            evento.preventDefault();

            formulario.classList.remove('hide');

            formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (btnCancelarRegistro && formulario) {
        btnCancelarRegistro.addEventListener('click', () => {
            formulario.classList.add('hide');
        });
    }

    const formRegistro = document.getElementById('form-registro-animal');
    if (formRegistro) {
        formRegistro.addEventListener('submit', addCad);
    }

});

async function fetchAutenticado(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    options.headers = options.headers || {};
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${API_URL}${endpoint}`, options);
}

async function addCad(e) {
    e.preventDefault();

    // 1. Validação de cargo alinhada com o seu Spring Security
    const cargo = localStorage.getItem('cargo');
    if (cargo !== 'ADMIN') {
        alert('Apenas a Diretoria pode registrar animais.');
        return;
    }

    // 2. Buscando os valores usando os IDs que realmente existem no HTML
    const nome = document.getElementById('nome').value.trim();
    const fotoInput = document.getElementById('animalPicture');

    // 3. Declaramos a variável vazia primeiro, para existir no escopo inteiro
    let fotoFinal = null;

    if (fotoInput && fotoInput.files && fotoInput.files.length > 0) {
        try {
            // Se a conversão der certo, preenchemos a variável
            fotoFinal = await convertFileToBase64(fotoInput.files[0]);
        } catch (err) {
            console.error("Erro ao converter foto:", err);
            alert("Erro ao processar o arquivo de imagem.");
            return;
        }
    }

    // 4. Montamos o objeto referenciando a variável que acabamos de criar
    const novoAnimal = {
        nome: nome,
        foto: fotoFinal
    };

    // 5. Envio para o Java
    try {
        const response = await fetchAutenticado('/animal/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAnimal)
        });

        if (response.ok) {
            // Limpando o formulário pelo ID correto que definimos antes
            document.getElementById('form-registro-animal').reset();
            alert('Animal cadastrado com sucesso!');

            // Dica de usabilidade: Fechar o formulário de registro automaticamente
            document.querySelector('.form-animal').classList.add('hide');
        } else {
            alert('Erro ao cadastrar animal.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
