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
    carregarAnimais();

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
            carregarAnimais();

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

async function abrirModalProntuario(animalId) {
    try {
        // GET simples, apenas com a URL do ID
        const response = await fetchAutenticado(`/animal/prontuario/${animalId}`, {
            method: 'GET'
        });

        // Guardamos o ID no input escondido, independentemente se já existe prontuário ou não
        document.getElementById('modal-animal-id').value = animalId;

        if (response.ok) {
            // Se encontrou o prontuário, extraímos o JSON
            const prontuario = await response.json();

            // Preenchemos os campos do formulário com os dados do banco!
            document.getElementById('modal-especie').value = prontuario.especie || '';
            document.getElementById('modal-idade').value = prontuario.idade || '';
            document.getElementById('modal-peso').value = prontuario.peso || '';

            // Tratamento especial para selects e listas
            if (prontuario.castrado !== null) {
                document.getElementById('modal-castrado').value = prontuario.castrado.toString();
            }
            if (prontuario.vacinado !== null) {
                document.getElementById('modal-vacinado').value = prontuario.vacinado.toString();
            }
            if (prontuario.vacinas && prontuario.vacinas.length > 0) {
                document.getElementById('modal-vacinas').value = prontuario.vacinas.join(', ');
            }
            document.getElementById('modal-entrada').value = prontuario.dataEntrada || '';
            document.getElementById('modal-saida').value = prontuario.dataSaida || '';
            document.getElementById('modal-adotante').value = prontuario.adotante || '';

            document.getElementById('modal-info').value = prontuario.info || '';


        } else if (response.status === 404) {
            // Se não encontrou (404), apenas limpamos o formulário para um cadastro novo
            document.getElementById('form-prontuario').reset();
        } else {
            alert('Erro ao buscar o prontuário.');
            return; // Se for outro erro, para a execução e não abre o modal
        }

        // Finalmente, mostramos o modal na tela
        document.getElementById('modal-prontuario').classList.remove('hide');
        document.querySelector('.admin-content').classList.add('no-scroll')

    } catch (error) {
        console.error('Erro:', error);
    }
}


function fecharModalProntuario() {
    document.getElementById('modal-prontuario').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
}


document.getElementById('form-prontuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const animalId = document.getElementById('modal-animal-id').value;
    const vacinasInput = document.getElementById('modal-vacinas').value;

    const dadosProntuario = {
        especie: document.getElementById('modal-especie').value,
        idade: document.getElementById('modal-idade').value,
        peso: parseFloat(document.getElementById('modal-peso').value),
        castrado: document.getElementById('modal-castrado').value === 'true',
        vacinado: document.getElementById('modal-vacinado').value === 'true',
        vacinas: vacinasInput ? vacinasInput.split(',').map(v => v.trim()) : [],
        info: document.getElementById('modal-info').value,
        dataEntrada: document.getElementById('modal-entrada').value,
        dataSaida: document.getElementById('modal-saida').value,
        adotante: document.getElementById('modal-adotante').value,
    };

    try {
        const response = await fetchAutenticado(`/animal/prontuario/${animalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosProntuario)
        });

        if (response.ok) {
            alert('Prontuário salvo com sucesso!');
            fecharModalProntuario();
            carregarAnimais(); // Chama a função que recarrega a tabela para atualizar a tela
        } else {
            alert('Erro ao salvar o prontuário.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function carregarAnimais() {
    try {
        const response = await fetchAutenticado('/animal', {
            method: 'GET'
        });

        if (response.ok) {
            const animais = await response.json();

            const tbody = document.querySelector('#animais .data-table tbody');

            console.log("Animais recebidos do banco:", animais); // ADICIONE ESTA LINHA


            tbody.innerHTML = '';

            animais.forEach(animal => {
                const tr = document.createElement('tr');

                // Verifica se o prontuário existe antes de tentar extrair os dados
                const idade = animal.prontuario?.idade || '-';

                const dataEntrada = animal.prontuario?.dataEntrada || '-';

                const dataSaida = animal.prontuario?.dataSaida || '-';

                const adotante = animal.prontuario?.adotante || '-';

                // Formata o boolean para "Sim" ou "Não"
                const castrado = animal.prontuario?.castrado === true ? 'Sim' :
                    animal.prontuario?.castrado === false ? 'Não' : '-';

                // Se vacinas for um array, junta com vírgula. Se não existir, mostra '-'
                const vacinas = (animal.prontuario?.vacinas && animal.prontuario.vacinas.length > 0)
                    ? animal.prontuario.vacinas.join(', ')
                    : '-';

                const info = animal.prontuario?.info || '-';

                // Lógica da Badge de Status
                const isDisponivel = animal.disponivel !== false; // Assume true se for nulo
                const badgeClass = isDisponivel ? 'available' : 'unavailable';
                const badgeText = isDisponivel ? 'Disponível' : 'Adotado/Inativo';
                const corBadge = isDisponivel ? 'background-color: #28a745;' : 'background-color: #dc3545;'; // Verde ou Vermelho

                tr.innerHTML = `
                    <!-- Clique na foto ou no nome abre a edição básica -->
                    <td style="cursor: pointer;" onclick="abrirModalEditaAnimal(${animal.id}, '${animal.nome}', '${animal.foto}')">
                        <img src="${animal.foto || 'assets/imgs/default-placeholder.jpeg'}" class="table-img">
                    </td>
                    <td style="cursor: pointer;" onclick="abrirModalEditaAnimal(${animal.id}, '${animal.nome}', '${animal.foto}')">
                        <strong>${animal.nome}</strong> <i class="fas fa-pencil-alt" style="font-size: 0.8em; color: gray;"></i>
                    </td>
                    <td>${idade}</td> 
                    <td>${vacinas}</td>
                    <td>${castrado}</td>
                    <td>${dataEntrada}</td>
                    <td>${dataSaida}</td>
                    <td>${adotante}</td>
                    <td>${info}</td>
                    <td style="cursor: pointer;" onclick="alternarStatusAnimal(${animal.id}, ${isDisponivel})">
                        <span class="status-badge ${badgeClass}" style="${corBadge}">${badgeText}</span>
                    </td>
                   
                    <td>
                        <button class="btn-icon" onclick="abrirModalFotos(${animal.id})" title="Gerir Fotos" style="background: rgba(75, 192, 232, 0.2); color: var(--cor-primaria);">
                            <i class="fas fa-images"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn-icon" onclick="abrirModalDocumentos(${animal.id})" title="Gerir Documentos" style="background: rgba(155, 89, 182, 0.2); color: #9b59b6;">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn-icon edit" onclick="abrirModalProntuario(${animal.id})" title="Editar Prontuário">
                            <i class="fas fa-notes-medical"></i>
                        </button>
                    </td>
                   <td>
                        <button class="btn-icon delete" onclick="deletar(${animal.id})"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error('Erro ao carregar a lista de animais.');
        }
    } catch (error) {
        console.error('Erro de conexão ao carregar animais:', error);
    }
}

function abrirModalEditaAnimal(id, nomeAtual, fotoAtual) {
    document.getElementById('edita-animal-id').value = id;
    document.getElementById('edita-nome').value = nomeAtual;

    const preview = document.getElementById('preview-foto-atual');
    preview.src = fotoAtual && fotoAtual !== 'null' ? fotoAtual : 'assets/imgs/default-placeholder.jpeg';

    // Limpa o input de arquivo
    document.getElementById('edita-foto').value = '';

    document.getElementById('modal-edita-animal').classList.remove('hide');
    document.querySelector('.admin-content').classList.add('no-scroll');
}

function fecharModalEditaAnimal() {
    
    document.getElementById('modal-edita-animal').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
}

function deletar(id) {
    // Guarda o ID no input hidden do modal de exclusão
    document.getElementById('deletar-animal-id').value = id;
    document.getElementById('modal-deletar').classList.remove('hide');
    document.querySelector('.admin-content').classList.add('no-scroll');
}

function nDeletar() {
    document.getElementById('modal-deletar').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
}

async function deletarFv() {
    const animalId = document.getElementById('deletar-animal-id').value;

    try {
        const response = await fetchAutenticado(`/animal/${animalId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('Animal apagado com sucesso!');
            nDeletar();
            carregarAnimais();
        } else {
            alert('Erro ao apagar o animal.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Lida com o envio do formulário de edição do animal
document.getElementById('form-edita-animal').addEventListener('submit', async (e) => {
    e.preventDefault();

    const animalId = document.getElementById('edita-animal-id').value;
    const novoNome = document.getElementById('edita-nome').value.trim();
    const inputNovaFoto = document.getElementById('edita-foto');

    let fotoFinal = document.getElementById('preview-foto-atual').src; // Mantém a antiga por padrão

    // Se o utilizador escolheu uma nova foto, converte para Base64
    if (inputNovaFoto.files && inputNovaFoto.files.length > 0) {
        try {
            fotoFinal = await convertFileToBase64(inputNovaFoto.files[0]);
        } catch (err) {
            console.error("Erro ao converter foto:", err);
            alert("Erro ao processar a nova imagem.");
            return;
        }
    }

    const animalAtualizado = {
        nome: novoNome,
        foto: fotoFinal
    };

    try {
        const response = await fetchAutenticado(`/animal/${animalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animalAtualizado)
        });

        if (response.ok) {
            alert('Dados do animal atualizados!');
            fecharModalEditaAnimal();
            carregarAnimais();
        } else {
            alert('Erro ao atualizar o animal.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

// Lida com o clique rápido na badge de Disponível/Indisponível
async function alternarStatusAnimal(animalId, statusAtual) {
    // Inverte o status: Se era true, fica false. Se era false, fica true.
    const novoStatus = !statusAtual;

    if (!confirm(`Deseja alterar o status deste animal para ${novoStatus ? 'Disponível' : 'Adotado/Inativo'}?`)) {
        return;
    }

    const animalAtualizado = {
        disponivel: novoStatus
    };

    try {
        const response = await fetchAutenticado(`/animal/${animalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animalAtualizado)
        });

        if (response.ok) {
            carregarAnimais(); // Recarrega a tabela para mostrar a nova cor
        } else {
            alert('Erro ao alterar o status do animal.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// ==========================================
// GESTÃO DE FOTOS DO PRONTUÁRIO
// ==========================================
let animalSelecionadoMidia = null;
let listaFotosAtual = [];
let listaDocsAtual = [];

async function abrirModalFotos(animalId) {
    animalSelecionadoMidia = animalId;

    try {
        const response = await fetchAutenticado(`/animal/prontuario/${animalId}`, { method: 'GET' });

        if (response.status === 404) {
            alert('Por favor, crie o prontuário primeiro (clique no ícone de adição médica) antes de anexar fotos.');
            return;
        }

        const prontuario = await response.json();
        listaFotosAtual = prontuario.fotos || [];

        renderizarFotos();

        document.getElementById('modal-fotos').classList.remove('hide');
        document.querySelector('.admin-content').classList.add('no-scroll');
    } catch (error) {
        console.error('Erro:', error);
    }
}

function fecharModalFotos() {
    document.getElementById('modal-fotos').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
    document.getElementById('input-nova-foto').value = '';
}

function renderizarFotos() {
    const container = document.getElementById('container-fotos');
    container.innerHTML = '';

    if (listaFotosAtual.length === 0) {
        container.innerHTML = '<p style="color: var(--cor-texto-claro); grid-column: 1 / -1;">Nenhuma foto anexada.</p>';
        return;
    }

    listaFotosAtual.forEach((fotoBase64, index) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.innerHTML = `
            <img src="${fotoBase64}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid var(--glass-border);">
            <button onclick="removerFoto(${index})" style="position: absolute; top: 5px; right: 5px; background: rgba(231, 76, 60, 0.9); border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">&times;</button>
        `;
        container.appendChild(div);
    });
}

async function adicionarFoto() {
    const input = document.getElementById('input-nova-foto');
    if (!input.files || input.files.length === 0) {
        alert("Selecione uma imagem primeiro.");
        return;
    }

    try {
        const fotoBase64 = await convertFileToBase64(input.files[0]);
        listaFotosAtual.push(fotoBase64);
        await salvarMidiaProntuario({ fotos: listaFotosAtual });

        input.value = ''; // Limpa o input
        renderizarFotos();
    } catch (err) {
        alert("Erro ao processar a imagem.");
    }
}

async function removerFoto(index) {
    if (!confirm("Tem a certeza que deseja eliminar esta foto?")) return;

    listaFotosAtual.splice(index, 1);
    await salvarMidiaProntuario({ fotos: listaFotosAtual });
    renderizarFotos();
}


// ==========================================
// GESTÃO DE DOCUMENTOS DO PRONTUÁRIO
// ==========================================

async function abrirModalDocumentos(animalId) {
    animalSelecionadoMidia = animalId;

    try {
        const response = await fetchAutenticado(`/animal/prontuario/${animalId}`, { method: 'GET' });

        if (response.status === 404) {
            alert('Por favor, crie o prontuário primeiro antes de anexar documentos.');
            return;
        }

        const prontuario = await response.json();
        listaDocsAtual = prontuario.documentos || [];

        renderizarDocumentos();

        document.getElementById('modal-documentos').classList.remove('hide');
        document.querySelector('.admin-content').classList.add('no-scroll');
    } catch (error) {
        console.error('Erro:', error);
    }
}

function fecharModalDocumentos() {
    document.getElementById('modal-documentos').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
    document.getElementById('input-novo-doc').value = '';
}

function renderizarDocumentos() {
    const container = document.getElementById('container-documentos');
    container.innerHTML = '';

    if (listaDocsAtual.length === 0) {
        container.innerHTML = '<p style="color: var(--cor-texto-claro);">Nenhum documento anexado.</p>';
        return;
    }

    listaDocsAtual.forEach((docBase64, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px;';

        // Verifica se é PDF para colocar o ícone correto
        const isPdf = docBase64.includes('application/pdf');
        const icon = isPdf ? '<i class="fas fa-file-pdf" style="color: #e74c3c; font-size: 1.5rem;"></i>' : '<i class="fas fa-file-image" style="color: var(--cor-primaria); font-size: 1.5rem;"></i>';

        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                ${icon}
                <span style="color: var(--cor-texto);">Documento ${index + 1}</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="${docBase64}" download="documento_${index + 1}" style="background: var(--cor-secundaria); color: white; padding: 5px 10px; border-radius: 5px; text-decoration: none; font-size: 0.85rem;"><i class="fas fa-download"></i> Baixar</a>
                <button onclick="removerDocumento(${index})" style="background: #e74c3c; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
}

async function adicionarDocumento() {
    const input = document.getElementById('input-novo-doc');
    if (!input.files || input.files.length === 0) {
        alert("Selecione um ficheiro primeiro.");
        return;
    }

    try {
        const docBase64 = await convertFileToBase64(input.files[0]);
        listaDocsAtual.push(docBase64);
        await salvarMidiaProntuario({ documentos: listaDocsAtual });

        input.value = '';
        renderizarDocumentos();
    } catch (err) {
        alert("Erro ao processar o ficheiro.");
    }
}

async function removerDocumento(index) {
    if (!confirm("Tem a certeza que deseja eliminar este documento?")) return;

    listaDocsAtual.splice(index, 1);
    await salvarMidiaProntuario({ documentos: listaDocsAtual });
    renderizarDocumentos();
}

// ==========================================
// FUNÇÃO GENÉRICA DE SALVAR PARA AS MÍDIAS
// ==========================================
async function salvarMidiaProntuario(dadosParciais) {
    try {
        const response = await fetchAutenticado(`/animal/prontuario/${animalSelecionadoMidia}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParciais)
        });

        if (!response.ok) {
            alert('Erro ao guardar as alterações no servidor.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}