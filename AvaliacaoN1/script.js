// Variável para verificar se o administrador está logado
var isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

// Função para atualizar a barra de navegação
function updateNavbar() {
    // Encontrar o botão de login/logout na barra de navegação
    var loginButton = document.querySelector('nav button');
    // Atualizar o texto do botão com base no status de login do administrador
    if (isAdminLoggedIn) {
        loginButton.textContent = 'Logout';
    } else {
        loginButton.textContent = 'Login';
    }
}

// Função para atualizar a lista de contatos
function updateContactList() {
    // Obter a lista de contatos do armazenamento local ou criar uma lista vazia se não existir
    var contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    // Encontrar o contêiner da lista de contatos na página
    var listContainer = document.getElementById('contactList');

    // Verificar se o contêiner existe na página
    if (!listContainer) {
        console.error("Elemento 'contactList' não encontrado.");
        return;
    }

    // Limpar o conteúdo atual do contêiner
    listContainer.innerHTML = '';

    // Iterar sobre a lista de contatos e criar elementos HTML para cada contato
    contactList.forEach(function(contact, index) {
        // Criar um item de lista para cada contato
        var listItem = document.createElement('li');
        listItem.classList.add('contact-box');

        // Criar um contêiner para as informações do contato
        var contactInfo = document.createElement('div');
        contactInfo.classList.add('contact-info');

        // Criar elementos para exibir informações específicas do contato (nome, email, telefone, mensagem)
        var nameElement = document.createElement('p');
        nameElement.textContent = 'Nome: ' + contact.name;

        var emailElement = document.createElement('p');
        emailElement.textContent = 'Email: ' + contact.email;

        var phoneElement = document.createElement('p');
        phoneElement.textContent = 'Telefone: ' + contact.phone;

        var messageElement = document.createElement('p');
        messageElement.classList.add('message');
        messageElement.textContent = 'Mensagem: ' + contact.message;

        // Adicionar elementos de informações do contato ao contêiner de informações do contato
        contactInfo.appendChild(nameElement);
        contactInfo.appendChild(emailElement);
        contactInfo.appendChild(phoneElement);
        contactInfo.appendChild(messageElement);

        // Criar um contêiner para botões de edição/exclusão se o administrador estiver logado
        var editDeleteButtons = document.createElement('div');
        editDeleteButtons.classList.add('edit-delete-buttons');

        // Verificar se o administrador está logado antes de adicionar botões de edição/exclusão
        if (isAdminLoggedIn) {
            // Criar botão de edição
            var editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = function() {
                // Chamar a função de edição ao clicar no botão de edição
                editContact(index);
            };

            // Criar botão de exclusão
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Apagar';
            deleteButton.onclick = function() {
                // Chamar a função de exclusão ao clicar no botão de exclusão
                deleteContact(index);
            };

            // Adicionar botões de edição/exclusão ao contêiner
            editDeleteButtons.appendChild(editButton);
            editDeleteButtons.appendChild(deleteButton);
        }

        // Adicionar contêiner de informações do contato e contêiner de botões ao item de lista
        listItem.appendChild(contactInfo);
        listItem.appendChild(editDeleteButtons);

        // Adicionar item de lista ao contêiner da lista de contatos
        listContainer.appendChild(listItem);
    });
}

// Função para enviar o formulário
function submitForm() {
    // Capturar valores dos campos do formulário
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    // Verificar se o formulário está no modo de edição com base nos parâmetros da URL
    var urlParams = new URLSearchParams(window.location.search);
    var isEditMode = urlParams.get('edit') === 'true';

    // Executar a ação apropriada com base no modo de edição
    if (isEditMode) {
        // Chamar a função para editar um contato existente
        editExistingContact(name, email, phone, message);

        // Limpar o índice de edição no armazenamento local
        localStorage.removeItem('editContactIndex');
    } else {
        // Adicionar um novo contato
        addNewContact(name, email, phone, message);
    }

    // Limpar o formulário
    document.getElementById('myForm').reset();

    // Exibir mensagem no console e redirecionar após um pequeno intervalo
    console.log("Submissão do formulário e redirecionamento.");
    setTimeout(function() {
        // Redirecionar para contatos.html
        window.location.href = 'contatos.html';
    }, 100);

    // Evitar o envio padrão do formulário
    return false;
}

// Função para adicionar um novo contato
function addNewContact(name, email, phone, message) {
    // Criar objeto de contato
    var contact = {
        name: name,
        email: email,
        phone: phone,
        message: message
    };

    // Obter a lista de contatos do armazenamento local ou criar uma lista vazia se não existir
    var contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    // Adicionar novo contato à lista de contatos
    contactList.push(contact);
    // Atualizar a lista de contatos no armazenamento local
    localStorage.setItem('contacts', JSON.stringify(contactList));

    // Atualizar a lista de contatos na página
    updateContactList();
}

// Função para editar um contato existente
function editExistingContact(name, email, phone, message) {
    // Obter o índice do contato em edição
    var editIndex = parseInt(localStorage.getItem('editContactIndex'), 10);

    // Obter a lista de contatos do armazenamento local ou criar uma lista vazia se não existir
    var contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    // Criar objeto com dados editados
    var editedContact = {
        name: name,
        email: email,
        phone: phone,
        message: message
    };

    // Atualizar os dados do contato existente na lista de contatos
    contactList[editIndex] = editedContact;
    // Atualizar a lista de contatos no armazenamento local
    localStorage.setItem('contacts', JSON.stringify(contactList));

    // Limpar o índice de edição no armazenamento local
    localStorage.removeItem('editContactIndex');

    // Atualizar a lista de contatos na página
    updateContactList();
}

// Função para preencher automaticamente os campos na página de formulário durante a edição
function fillFormFieldsOnEdit() {
    // Obter o índice do contato em edição
    var editIndex = localStorage.getItem('editContactIndex');
    // Obter a lista de contatos do armazenamento local ou criar uma lista vazia se não existir
    var contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    // Obter dados do contato em edição
    var editContactData = contactList[editIndex];

    // Preencher automaticamente os campos do formulário com os dados do contato em edição
    if (editContactData) {
        document.getElementById('name').value = editContactData.name || '';
        document.getElementById('email').value = editContactData.email || '';
        document.getElementById('phone').value = editContactData.phone || '';
        document.getElementById('message').value = editContactData.message || '';
    }
}

// Chamar a função fillFormFieldsOnEdit quando a página é carregada
document.addEventListener('DOMContentLoaded', fillFormFieldsOnEdit);

// Inicializar a lista de contatos e a barra de navegação quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar a lista de contatos na página
    updateContactList();

    // Verificar se o administrador está logado e, se sim, atualizar a barra de navegação
    var isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
        updateNavbar();
    }

    // Preencher automaticamente os campos do formulário se estiver em modo de edição
    var urlParams = new URLSearchParams(window.location.search);
    var isEditMode = urlParams.get('edit') === 'true';

    if (isEditMode) {
        fillFormFieldsOnEdit();
    }
});

// Função para editar um contato
function editContact(index) {
    // Obter o índice do contato a ser editado
    var editIndex = parseInt(index, 10);

    // Armazenar o índice de edição no armazenamento local
    localStorage.setItem('editContactIndex', editIndex);

    // Redirecionar para formulario.html com o modo de edição ativado
    window.location.href = 'formulario.html?edit=true';
}

// Função para excluir um contato
function deleteContact(index) {
    // Obter a lista de contatos do armazenamento local ou criar uma lista vazia se não existir
    var contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    // Remover o contato da lista com base no índice fornecido
    contactList.splice(index, 1);
    // Atualizar a lista de contatos no armazenamento local
    localStorage.setItem('contacts', JSON.stringify(contactList));

    // Atualizar a lista de contatos na página
    updateContactList();
}

// Função para visualizar os contatos
function viewContacts() {
    // Redirecionar para a página de contatos
    window.location.href = 'contatos.html';
}

// Função para ir para a página de novo contato
function goToNewContact() {
    // Redirecionar para a página de formulário
    window.location.href = 'formulario.html';
}

// Função para alternar entre login e logout
function toggleLoginLogout() {
    // Alternar entre status de login e logout do administrador
    if (isAdminLoggedIn) {
        isAdminLoggedIn = false;
        localStorage.setItem('isAdminLoggedIn', 'false');
        // Atualizar a barra de navegação após a alteração de status
        updateNavbar();
    } else {
        // Executar o processo de login (solicitar nome de usuário e senha)
        performLogin();
    }

    // Atualizar a lista de contatos na página
    updateContactList();
}

// Função para realizar o login
function performLogin() {
    // Solicitar nome de usuário e senha ao usuário
    var username = prompt('Digite o nome de usuário:');
    var password = prompt('Digite a senha:');

    // Verificar se as credenciais são válidas
    if (username === 'admin' && password === 'senhaadmin') {
        // Definir status de login do administrador como verdadeiro
        isAdminLoggedIn = true;
        // Atualizar o status de login no armazenamento local
        localStorage.setItem('isAdminLoggedIn', 'true');
        // Atualizar a barra de navegação após o login bem-sucedido
        updateNavbar();
    } else {
        // Exibir alerta se as credenciais forem inválidas
        alert('Credenciais inválidas. Tente novamente.');
    }
}

// Função para pesquisar contatos
function searchContacts() {
    // Obter a palavra-chave de pesquisa do campo de entrada
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Obter a lista de contatos do armazenamento local ou criar uma lista vazia se não existir
    var contactList = JSON.parse(localStorage.getItem('contacts')) || [];
    // Encontrar o contêiner da lista de contatos na página
    var listContainer = document.getElementById('contactList');
    // Limpar o conteúdo atual do contêiner
    listContainer.innerHTML = '';

    // Iterar sobre a lista de contatos e criar elementos HTML para contatos que correspondem à pesquisa
    contactList.forEach(function(contact, index) {
        // Criar um item de lista para cada contato
        var listItem = document.createElement('li');
        listItem.classList.add('contact-box');

        // Criar um contêiner para as informações do contato
        var contactInfo = document.createElement('div');
        contactInfo.classList.add('contact-info');

        // Criar elementos para exibir informações específicas do contato (nome, email, telefone, mensagem)
        var nameElement = document.createElement('p');
        nameElement.textContent = 'Nome: ' + contact.name;

        var emailElement = document.createElement('p');
        emailElement.textContent = 'Email: ' + contact.email;

        var phoneElement = document.createElement('p');
        phoneElement.textContent = 'Telefone: ' + contact.phone;

        var messageElement = document.createElement('p');
        messageElement.classList.add('message');
        messageElement.textContent = 'Mensagem: ' + contact.message;

        // Adicionar elementos de informações do contato ao contêiner de informações do contato
        contactInfo.appendChild(nameElement);
        contactInfo.appendChild(emailElement);
        contactInfo.appendChild(phoneElement);
        contactInfo.appendChild(messageElement);

        // Criar um contêiner para botões de edição/exclusão se o administrador estiver logado
        var editDeleteButtons = document.createElement('div');
        editDeleteButtons.classList.add('edit-delete-buttons');

        // Verificar se o administrador está logado antes de adicionar botões de edição/exclusão
        if (isAdminLoggedIn) {
            // Criar botão de edição
            var editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = function() {
                // Chamar a função de edição ao clicar no botão de edição
                editContact(index);
            };

            // Criar botão de exclusão
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Apagar';
            deleteButton.onclick = function() {
                // Chamar a função de exclusão ao clicar no botão de exclusão
                deleteContact(index);
            };

            // Adicionar botões de edição/exclusão ao contêiner
            editDeleteButtons.appendChild(editButton);
            editDeleteButtons.appendChild(deleteButton);
        }

        // Adicionar contêiner de informações do contato e contêiner de botões ao item de lista
        listItem.appendChild(contactInfo);
        listItem.appendChild(editDeleteButtons);

        // Verificar se a palavra-chave está presente em qualquer campo do contato (ignorando maiúsculas e minúsculas)
        var containsKeyword = Object.values(contact).some(function (value) {
            return value.toLowerCase().includes(searchTerm);
        });

        // Se a palavra-chave estiver presente, adicionar o item de lista ao contêiner da lista de contatos
        if (containsKeyword) {
            listContainer.appendChild(listItem);
        }
    });
}