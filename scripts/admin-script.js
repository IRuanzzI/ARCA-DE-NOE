const token = localStorage.getItem('jwt_token');
const cargo = localStorage.getItem('cargo');

if (!token) {
    window.location.replace('index.html');
}

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
});

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



    const btnNovoLancamento = document.getElementById('btnNovoLancamento');
    const btnCancelarLancamento = document.getElementById('cancelarLancamento');
    const formFinanceiro = document.getElementById('formulario-financeiro');

    if (btnNovoLancamento && formFinanceiro) {
        btnNovoLancamento.addEventListener('click', () => {
            formFinanceiro.classList.remove('hide');
            // Por padrão, colocar a data de hoje
            document.getElementById('fin-data').value = new Date().toISOString().split('T')[0];
        });
    }

    if (btnCancelarLancamento && formFinanceiro) {
        btnCancelarLancamento.addEventListener('click', () => {
            formFinanceiro.classList.add('hide');
            document.getElementById('form-registro-financeiro').reset();
        });
    }

    const formRegFinanceiro = document.getElementById('form-registro-financeiro');
    if (formRegFinanceiro) {
        formRegFinanceiro.addEventListener('submit', novoLancamento);
    }

    // Eventos de Filtro
    const filtroTipo = document.getElementById('filtro-tipo-financeiro');
    const filtroMes = document.getElementById('filtro-mes-financeiro');

    if (filtroTipo) filtroTipo.addEventListener('change', aplicarFiltrosFinanceiros);

    if (filtroMes) {
        filtroMes.addEventListener('change', aplicarFiltrosFinanceiros);
        // --> ADICIONA ESTAS DUAS LINHAS PARA DEFINIR O MÊS ATUAL
        const dataAtual = new Date();
        const mesAnoFormatoString = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;
        filtroMes.value = mesAnoFormatoString;
    }





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

        // ==========================================
        // LAZY LOADING (Carrega dados apenas ao abrir a aba)
        // ==========================================
        switch (targetId) {
            case 'dia-a-dia':
                carregarDiarioAdmin();
                break;
            case 'animais':
                carregarAnimais();
                break;
            case 'doacoes':
                carregarFinanceiro();
                break;
            case 'documentos':
                carregarDocumentosGerais();
                break;
            case 'solicitacoes':
                solicitacoes();
                break;
            case 'estrelinhas':
                carregarEstrelinhas();
                break;

        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            alternarSecao(button.getAttribute('data-target'));
        });
    });

    dashCards.forEach(card => {
        card.addEventListener('click', () => {
            const alvo = card.getAttribute('data-target');


            if (alvo) {
                alternarSecao(alvo);
            }
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

    // ==========================================
    // EXIBIR NOME DO FICHEIRO SELECIONADO (ARCA)
    // ==========================================
    const inputNovoDocArca = document.getElementById('input-novo-doc');
    const displayNomeFicheiroArca = document.getElementById('nome-ficheiro-selecionado-arca');
    const inputNomeDigitadoArca = document.getElementById('nome-ficheiro');

    if (inputNovoDocArca && displayNomeFicheiroArca) {
        inputNovoDocArca.addEventListener('change', function () {
            if (this.files && this.files.length > 0) {
                const nomeFicheiro = this.files[0].name;
                displayNomeFicheiroArca.textContent = nomeFicheiro;
                displayNomeFicheiroArca.style.color = "var(--cor-texto)";

                // Preencher automaticamente o campo "Nome:" se estiver vazio
                if (inputNomeDigitadoArca && inputNomeDigitadoArca.value.trim() === '') {
                    const nomeSemExtensao = nomeFicheiro.split('.').slice(0, -1).join('.');
                    inputNomeDigitadoArca.value = nomeSemExtensao.toUpperCase();
                }
            } else {
                displayNomeFicheiroArca.textContent = "Nenhum ficheiro selecionado";
                displayNomeFicheiroArca.style.color = "var(--cor-texto-claro)";
            }
        });
    }

    // ==========================================
    // EXIBIR NOME DO FICHEIRO SELECIONADO (PRONTUÁRIO)
    // ==========================================
    // ==========================================
    // EXIBIR NOME DO FICHEIRO SELECIONADO (PRONTUÁRIO)
    // ==========================================
    const inputNovoDocProntuario = document.getElementById('input-novo-doc-prontuario');
    const displayNomeFicheiroProntuario = document.getElementById('nome-ficheiro-selecionado-prontuario');

    if (inputNovoDocProntuario && displayNomeFicheiroProntuario) {
        inputNovoDocProntuario.addEventListener('change', function () {
            if (this.files && this.files.length > 0) {
                // Apenas pega o nome para mostrar no ecrã
                const nomeFicheiro = this.files[0].name;
                displayNomeFicheiroProntuario.textContent = nomeFicheiro;
                displayNomeFicheiroProntuario.style.color = "var(--cor-texto)";
            } else {
                displayNomeFicheiroProntuario.textContent = "Nenhum ficheiro selecionado";
                displayNomeFicheiroProntuario.style.color = "var(--cor-texto-claro)";
            }
        });
    }

});

async function fetchAutenticado(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    options.headers = options.headers || {};

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);


        if (response.status === 401 || response.status === 403) {
            alert('A sua sessão expirou ou não tem permissões. Por favor, faça login novamente.');

            // Limpa os dados falsos/expirados
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('nome');
            localStorage.removeItem('cargo');

            // Redireciona para o início
            window.location.replace('index.html');
            return null;
        }

        return response;
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        throw error;
    }
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
        foto: fotoFinal,
        disponivel: true
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

function abrirModalDeletarSolicitacao(id) {
    document.getElementById('solicitacoes').value = id;
    document.getElementById('modal-deletar-solicitacao').classList.remove('hide');
    document.querySelector('.admin-content').classList.add('no-scroll');

}

async function deletarSolicitacaoConfirmado() {
    const id = document.getElementById('solicitacoes').value;

    try {
        const response = await fetchAutenticado(`/animal/solicitacoes/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('Solicitação apagada com sucesso!');
            fecharModalDeletarSolicitacao();
            solicitacoes();
        } else {
            alert('Erro ao apagar a solicitação.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }

}

function nDeletar() {
    document.getElementById('modal-deletar').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
}

function fecharModalDeletarSolicitacao() {
    document.getElementById('modal-deletar-solicitacao').classList.add('hide');
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

    // Limpa o ficheiro
    const inputDoc = document.getElementById('input-novo-doc-prontuario');
    if (inputDoc) inputDoc.value = '';

    // Repõe o texto do span
    const displaySpan = document.getElementById('nome-ficheiro-selecionado-prontuario');
    if (displaySpan) {
        displaySpan.textContent = "Nenhum ficheiro selecionado";
        displaySpan.style.color = "var(--cor-texto-claro)";
    }
}

async function adicionarDocumentoProntuario() {
    const input = document.getElementById('input-novo-doc-prontuario');
    if (!input.files || input.files.length === 0) {
        alert("Selecione um ficheiro primeiro.");
        return;
    }

    try {
        const docBase64 = await convertFileToBase64(input.files[0]);

        listaDocsAtual.push(docBase64);
        await salvarMidiaProntuario({ documentos: listaDocsAtual });

        input.value = ''; // Limpa o ficheiro selecionado

        // Volta o texto para o padrão
        const displaySpan = document.getElementById('nome-ficheiro-selecionado-prontuario');
        if (displaySpan) {
            displaySpan.textContent = "Nenhum ficheiro selecionado";
            displaySpan.style.color = "var(--cor-texto-claro)";
        }

        renderizarDocumentos();
    } catch (err) {
        console.error(err);
        alert("Erro ao processar o ficheiro do prontuário.");
    }
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

async function adicionarDocumentoARCA() {
    const input = document.getElementById('input-novo-doc');
    if (!input.files || input.files.length === 0) {
        alert("Selecione um ficheiro primeiro.");
        return;
    }

    const inputNome = document.getElementById('nome-ficheiro');
    const nomeDigitado = inputNome.value.trim();

    if (!nomeDigitado) {
        alert("Por favor, dê um nome ao documento.");
        return;
    }

    try {
        const docBase64 = await convertFileToBase64(input.files[0]);       // Retirei as linhas do listaDocsAtual, pois isto é um doc geral, não do prontuário
        // A aba geral apenas guarda no banco de dados, sem estar associada a um animalSelecionadoMidia.

        const novoDocumento = {
            arquivo: docBase64,
            nome: nomeDigitado,
        };

        const response = await fetchAutenticado(`/documentos/newDocument`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoDocumento)
        });

        if (!response.ok) {
            alert('Erro ao guardar as alterações no servidor.');
        } else {
            // Limpa os campos após o sucesso
            input.value = '';
            inputNome.value = '';

            const displayNomeFicheiroArca = document.getElementById('nome-ficheiro-selecionado-arca');
            if (displayNomeFicheiroArca) {
                displayNomeFicheiroArca.textContent = "Nenhum ficheiro selecionado";
                displayNomeFicheiroArca.style.color = "var(--cor-texto-claro)";
            }
            alert("Documento salvo na aba geral.");
            carregarDocumentosGerais();
        }

        // Se tiveres uma função carregarDocumentosGerais(), deves chamá-la aqui.
    } catch (err) {
        console.error(err);
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



async function uploadDiario() {

    const form = document.getElementById('form-diario');


    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }


    const descricao = document.getElementById("descricao-atividade").value.trim();
    const data = document.getElementById("data").value.trim();
    const foto = document.getElementById("fotos");



    // 3. Declaramos a variável vazia primeiro, para existir no escopo inteiro
    let fotoFinal = null;

    if (foto && foto.files && foto.files.length > 0) {
        try {
            fotoFinal = await convertFileToBase64(foto.files[0]);
        } catch (err) {
            console.error("Erro ao converter foto:", err);
            alert("Erro ao processar o arquivo de imagem.");
            return;
        }
    }

    const novoDiario = {
        foto: fotoFinal,
        descricao: descricao,
        data: data
    };

    try {
        const response = await fetchAutenticado('/diario/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoDiario)
        });

        if (response.ok) {
            document.getElementById('form-diario').reset();
            alert('Rotina cadastrada com sucesso!');
            arregarDiarioAdmin();
        } else {
            alert('Erro ao cadastrar rotina.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }


}


// ==========================================
// APAGAR DOCUMENTO GERAL DA ONG
// ==========================================
async function apagarDocumentoGeral(idDocumento) {
    if (!confirm("Tem certeza que deseja eliminar este documento? Esta ação não pode ser desfeita.")) {
        return;
    }

    try {
        // Envia a requisição DELETE para a rota que criaste no teu backend Java
        const response = await fetchAutenticado(`/documentos/${idDocumento}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Documento eliminado com sucesso.");
            // Após apagar, recarregamos a lista para atualizar a página
            carregarDocumentosGerais();
        } else {
            alert("Erro ao tentar eliminar o documento no servidor.");
        }
    } catch (error) {
        console.error("Erro na requisição de exclusão:", error);
        alert("Ocorreu um erro ao comunicar com o servidor.");
    }
}

// ==========================================
// GESTÃO DO DIA-A-DIA
// ==========================================

async function carregarDiarioAdmin() {
    try {
        const response = await fetchAutenticado('/diario', {
            method: 'GET'
        });

        if (response.ok) {
            const diarios = await response.json();
            const container = document.getElementById('lista-diario');
            container.innerHTML = '';

            if (diarios.length === 0) {
                container.innerHTML = '<p style="color: var(--cor-texto-claro); grid-column: 1 / -1; text-align: center;">Nenhuma rotina publicada ainda.</p>';
                return;
            }

            diarios.forEach(post => {
                const div = document.createElement('div');
                div.className = 'request-card'; // Reaproveitando o estilo de cards de solicitação

                const imgSrc = post.foto && post.foto !== 'null' ? post.foto : 'assets/imgs/default-placeholder.jpeg';

                div.innerHTML = `
                    <div class="request-header">
                        <span class="status-badge available">${post.data || ''}</span>
                    </div>
                    <div class="request-body" style="text-align: center;">
                        <img src="${imgSrc}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; border: 1px solid var(--glass-border);">
                        <p>${post.descricao || ''}</p>
                    </div>
                    <div class="request-actions">
                        <button class="btn-danger" style="width: 100%; background-color: #e74c3c; border: none; padding: 10px; color: white; border-radius: 8px; cursor: pointer;" onclick="abrirModalDeletarDiario(${post.id})">
                            <i class="fas fa-trash"></i> APAGAR POST
                        </button>
                    </div>
                `;
                container.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar lista do dia-a-dia:', error);
    }
}

function abrirModalDeletarDiario(id) {
    document.getElementById('deletar-diario-id').value = id;
    document.getElementById('modal-deletar-diario').classList.remove('hide');
    document.querySelector('.admin-content').classList.add('no-scroll');
}

function fecharModalDeletarDiario() {
    document.getElementById('modal-deletar-diario').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
}

async function deletarDiarioConfirmado() {
    const id = document.getElementById('deletar-diario-id').value;

    try {
        const response = await fetchAutenticado(`/diario/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('Post apagado com sucesso!');
            fecharModalDeletarDiario();
            carregarDiarioAdmin(); // Recarrega a tela para o item sumir
        } else {
            alert('Erro ao apagar o post.');
        }
    } catch (error) {
        console.error('Erro na requisição de deleção:', error);
    }
}

///SOLICITAÇÕES

async function solicitacoes() {

    const cardSolicitacao = document.querySelector('#solicitacoes .card-list');

    try {
        const response = await fetchAutenticado(`/animal/solicitacoes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {



            const listaSolicitacoes = await response.json();


            cardSolicitacao.innerHTML = '';

            const badgeSolicitacoes = document.querySelector('.nav-btn[data-target="solicitacoes"] .badge');


            if (badgeSolicitacoes) {

                badgeSolicitacoes.innerText = listaSolicitacoes.length;


                badgeSolicitacoes.style.display = listaSolicitacoes.length > 0 ? 'inline-block' : 'none';
            }



            listaSolicitacoes.forEach(solicitacao => {


                const cardHtml = document.createElement('div');
                cardHtml.className = 'request-card';

                cardHtml.innerHTML = `
                    <div class="solicitacao-header">
                        <span class="status-badge available">${solicitacao.animal.nome || 'N/A'}</span>
                    </div>
                    <div class="request-body" style="text-align: left; margin-top: 15px;">
                        <p><strong>Candidato:</strong> ${solicitacao.nome || ''}</p>
                        <p><strong>E-mail:</strong> ${solicitacao.email || ''}</p>
                        <p><strong>WhatsApp:</strong> ${solicitacao.telefone || ''}</p>
                        <p><strong>Pedido:</strong> ${solicitacao.tipo || ''}</p>
                    </div>
                    <div class="request-actions-solicitacoes">
                       <button class="btn-danger" onclick="abrirModalDeletarSolicitacao(${solicitacao.id})"><i class="fas fa-trash"></i> EXCLUIR</button>
                    </div>
                   
                `;
                cardSolicitacao.appendChild(cardHtml);

            });
        }
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
    }
}

//FINANCEIRO
let dadosFinanceirosGlobal = [];

// ----------------------------------------------------
// 1. CARREGAR E RENDERIZAR
// ----------------------------------------------------
async function carregarFinanceiro() {
    try {
        const response = await fetchAutenticado(`/financeiro/lancamentos`, { method: 'GET' });

        if (response.ok) {
            dadosFinanceirosGlobal = await response.json();
            console.log(dadosFinanceirosGlobal)
            aplicarFiltrosFinanceiros();
        } else {
            console.error('Erro ao carregar dados financeiros.');
        }
    } catch (error) {
        console.error('Erro na requisição de carregamento:', error);
    }
}

function aplicarFiltrosFinanceiros() {
    const filtroTipo = document.getElementById('filtro-tipo-financeiro').value.toUpperCase(); // Garante que fica em maiúsculas
    const mesFiltro = document.getElementById('filtro-mes-financeiro').value;

    let dadosDoMes = dadosFinanceirosGlobal || [];

    // 1. Filtra PRIMEIRO pelo mês (aplica-se ao dashboard e à tabela)
    if (mesFiltro) {
        dadosDoMes = dadosDoMes.filter(item => {
            if (!item.data) return false;
            return item.data.includes(mesFiltro); // O includes resolve problemas se a data vier com horas (ex: 2024-03-20T10:00:00)
        });
    }

    // 2. Calcula o resumo do MÊS para os cartões (antes de filtrar o tipo)
    calcularResumoFinanceiro(dadosDoMes);

    // 3. Filtra DEPOIS pelo Tipo (aplica-se APENAS à tabela)
    let dadosParaTabela = dadosDoMes;

    if (filtroTipo !== 'TODOS') {
        dadosParaTabela = dadosParaTabela.filter(item =>
            item.tipo && item.tipo.toUpperCase() === filtroTipo
        );
    }

    // 4. Renderiza a tabela com o resultado final
    renderizarTabelaFinanceiro(dadosParaTabela);
}

function renderizarTabelaFinanceiro(dados) {
    const tbody = document.querySelector('#tabela-financeiro tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum lançamento encontrado.</td></tr>';
        return;
    }

    dados.forEach(lancamento => {
        const tr = document.createElement('tr');

        // Formatação de data (BR)
        const dataArr = lancamento.data.split('-');
        const dataFormatada = `${dataArr[2]}/${dataArr[1]}/${dataArr[0]}`;

        // Formatação de Moeda
        const valorFormatado = parseFloat(lancamento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Estilo baseado no tipo
        const classeBadge = lancamento.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-saida';
        const iconeTipo = lancamento.tipo === 'ENTRADA' ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>';
        const corValor = lancamento.tipo === 'ENTRADA' ? '#2ecc71' : '#e74c3c';

        // Comprovativo
        const botaoComprovativo = lancamento.comprovante && lancamento.comprovante !== 'null'
            ? `<a href="${lancamento.comprovante}" download class="btn-icon" style="display:inline-flex; align-items:center; justify-content:center; background: rgba(75, 192, 232, 0.2); color: var(--cor-primaria);" title="Baixar"><i class="fas fa-download"></i></a>`
            : '<span style="color: var(--cor-texto-claro); font-size: 0.8rem;">N/A</span>';

        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td><strong>${lancamento.descricao}</strong></td>
            <td><span class="${classeBadge}">${iconeTipo} ${lancamento.tipo}</span></td>
            <td style="color: ${corValor}; font-weight: bold;">${valorFormatado}</td>
            <td>${botaoComprovativo}</td>
            <td class="table-actions">
                <button class="btn-icon delete" onclick="apagarLancamento(${lancamento.id})" title="Excluir"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calcularResumoFinanceiro(dados) {
    let entradas = 0;
    let saidas = 0;

    dados.forEach(item => {
        if (item.tipo === 'ENTRADA') entradas += parseFloat(item.valor);
        if (item.tipo === 'SAIDA') saidas += parseFloat(item.valor);
    });

    const saldo = entradas - saidas;

    document.getElementById('total-entradas').innerText = entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-saidas').innerText = saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('saldo-total').innerText = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// ----------------------------------------------------
// 2. CRIAR E EXCLUIR LANÇAMENTOS
// ----------------------------------------------------
async function novoLancamento(e) {
    e.preventDefault();

    // 1. Validar cargo (opcional, dependendo de quem mexe no dinheiro)
    const cargo = localStorage.getItem('cargo');
    if (cargo !== 'ADMIN') {
        alert('Apenas a Diretoria pode registar lançamentos financeiros.');
        return;
    }

    // 2. Pegar valores corretamente
    const valorStr = document.getElementById('fin-valor').value;
    const tipoVal = document.getElementById('fin-tipo').value;
    const dataVal = document.getElementById('fin-data').value;
    const descVal = document.getElementById('fin-descricao').value.trim();
    const arquivoInput = document.getElementById('fin-comprovante');

    const valorFloat = parseFloat(valorStr);

    if (isNaN(valorFloat) || valorFloat <= 0) {
        alert("O valor inserido é inválido.");
        return;
    }

    let fotoFinal = null;
    if (arquivoInput && arquivoInput.files && arquivoInput.files.length > 0) {
        try {
            fotoFinal = await convertFileToBase64(arquivoInput.files[0]);
        } catch (err) {
            console.error("Erro ao converter comprovativo:", err);
            alert("Erro ao processar o arquivo.");
            return;
        }
    }

    const lancamento = {
        valor: valorFloat,
        tipo: tipoVal,
        data: dataVal,
        descricao: descVal,
        comprovante: fotoFinal // Certifica-te que o teu backend espera este nome ('comprovante' ou 'fotoFinal')
    };

    try {
        const response = await fetchAutenticado('/financeiro/lancamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lancamento)
        });

        if (response.ok) {
            alert('Lançamento registado com sucesso!');
            document.getElementById('formulario-financeiro').classList.add('hide');
            document.getElementById('form-registro-financeiro').reset();
            carregarFinanceiro(); // Recarrega os dados do backend
        } else {
            alert('Erro ao registar o lançamento.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function apagarLancamento(id) {
    if (!confirm("Tem a certeza que deseja eliminar este registo financeiro? Esta ação não pode ser desfeita.")) return;

    try {

        const response = await fetchAutenticado(`/financeiro/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarFinanceiro();
        } else {
            alert("Erro ao apagar o registo.");
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}



let listaDocumentosGerais = []; // Mudei o nome da variável para não entrar em conflito

async function carregarDocumentosGerais() { // Mudei o nome da função
    try {
        const response = await fetchAutenticado(`/documentos`, { method: 'GET' });

        if (response.ok) {
            listaDocumentosGerais = await response.json();

            // Usar o ID correto que está no teu admin.html
            const container = document.getElementById('container-documentos-gerais');

            // Limpa o contentor antes de carregar
            container.innerHTML = '';

            // Se não houver documentos, mostra uma mensagem
            if (listaDocumentosGerais.length === 0) {
                container.innerHTML = '<p style="color: var(--cor-texto-claro);">Nenhum documento registrado.</p>';
                return;
            }

            // Cria o HTML para cada documento da ONG
            listaDocumentosGerais.forEach((doc, index) => {
                const div = document.createElement('div');
                div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px;';

                // Verifica se é PDF para colocar o ícone correto
                const isPdf = doc.arquivo && doc.arquivo.includes('application/pdf');
                const icon = isPdf ? '<i class="fas fa-file-pdf" style="color: #e74c3c; font-size: 1.5rem;"></i>' : '<i class="fas fa-file-image" style="color: var(--cor-primaria); font-size: 1.5rem;"></i>';

                // Usamos doc.nome (se existir no backend) ou um nome genérico
                const nomeExibicao = doc.nome ? doc.nome : `Documento ${index + 1}`;

                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        ${icon}
                        <span style="color: var(--cor-texto);">${nomeExibicao}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="${doc.arquivo}" download="${nomeExibicao}" style="background: var(--cor-secundaria); color: white; padding: 5px 10px; border-radius: 5px; text-decoration: none; font-size: 0.85rem;"><i class="fas fa-download"></i> Baixar</a>
                        
                        <!-- NOTA: Adicionei um botão de apagar. Precisas criar a função apagarDocumentoGeral(id) depois -->
                        <button onclick="apagarDocumentoGeral(${doc.id})" style="background: #e74c3c; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                container.appendChild(div);
            });

        } else {
            console.error('Erro ao carregar documentos.');
        }
    } catch (error) {
        console.error('Erro na requisição de carregamento:', error);
    }
}

async function carregarEstrelinhas() {
    try {
        const response = await fetch(`${API_URL}/animal/estrelinhas`)

        if (response.ok) {
            const estrelinhas = await response.json();
            const tbody = document.querySelector('#tabela-estrelinhas tbody');
            tbody.innerHTML = '';

            if (estrelinhas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--cor-texto-claro);">Nenhuma estrelinha registrada.</td></tr>';
                return;
            }

            estrelinhas.forEach(estrela => {
                const tr = document.createElement('tr');
                const fotoSrc = estrela.foto && estrela.foto !== 'null' ? estrela.foto : 'assets/imgs/default-placeholder.jpeg';

                tr.innerHTML = `
                    <td><img src="${fotoSrc}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; border: 1px solid var(--glass-border);"></td>
                    <td><strong>${estrela.nome}</strong></td>
                    <td>${estrela.descricao || '-'}</td>
                    <td class="table-actions">
                        <button class="btn-icon delete" onclick="apagarEstrelinha(${estrela.id})" title="Apagar"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error('Erro ao carregar estrelinhas.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}


function abrirModalEstrelinha() {
    document.getElementById('form-estrelinha').reset(); // Limpa o formulário
    document.getElementById('modal-estrelinhas').classList.remove('hide');
    document.querySelector('.admin-content').classList.add('no-scroll');
}

function fecharModalEstrelinha() {
    document.getElementById('modal-estrelinhas').classList.add('hide');
    document.querySelector('.admin-content').classList.remove('no-scroll');
}


const formEstrelinha = document.getElementById('form-estrelinha');
if (formEstrelinha) {
    formEstrelinha.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cargo = localStorage.getItem('cargo');
        if (cargo !== 'ADMIN') {
            alert('Apenas a Diretoria pode registrar estrelinhas.');
            return;
        }

        const nome = document.getElementById('nome-estrelinha').value.trim();
        const descricao = document.getElementById('descricao-estrelinha').value.trim();
        const inputFoto = document.getElementById('foto-estrelinha');

        let fotoBase64 = null;
        if (inputFoto.files && inputFoto.files.length > 0) {
            try {
                fotoBase64 = await convertFileToBase64(inputFoto.files[0]);
            } catch (err) {
                console.error("Erro ao converter foto:", err);
                alert("Erro ao processar a imagem.");
                return;
            }
        }

        const novaEstrelinha = {
            nome: nome,
            descricao: descricao,
            foto: fotoBase64
        };

        try {
            const response = await fetchAutenticado('/animal/estrelinha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaEstrelinha)
            });

            if (response.ok) {
                alert('Homenagem cadastrada com sucesso!');
                fecharModalEstrelinha();
                carregarEstrelinhas();
            } else {
                alert('Erro ao cadastrar a estrelinha no servidor.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao comunicar com o servidor.');
        }
    });
}

// 4. Apagar Estrelinha
async function apagarEstrelinha(id) {
    if (!confirm("Tem a certeza que deseja eliminar este registro do memorial?")) {
        return;
    }

    try {
        const response = await fetchAutenticado(`/animal/estrelinha/${id}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 204) {
            alert("Registro eliminado com sucesso.");
            carregarEstrelinhas(); // Atualiza a tabela
        } else {
            alert("Erro ao tentar eliminar a estrelinha.");
        }
    } catch (error) {
        console.error("Erro na requisição de exclusão:", error);
    }
}


function sairDoSistema() {
    document.querySelector('.btn-sair');
    localStorage.clear();
    window.location.href = 'index.html';
}