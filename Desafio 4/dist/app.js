"use strict";
// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
let apiKey;
let requestToken;
let username;
let password;
let sessionId;
let listId;
let nomeLista;
let descricao;
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
let listButton = document.getElementById('create-list-button');
let listContainer = document.getElementById('list-container');
let listButtonCancel = document.getElementById('list-button-cancel');
let listButtonCreate = document.getElementById('list-button-create');
let ShowListButton = document.getElementById('show-list-button');
let ShowListButtonCancel = document.getElementById('show-list-button-cancel');
let ShowListContainer = document.getElementById('show-list');
loginButton.addEventListener('click', async () => {
    await criarRequestToken();
    let verify = await logar();
    await criarSessao();
    if (verify) {
        searchContainer.classList.remove('hidden');
        document.querySelector('.login').classList.add('hidden');
    }
});
searchButton.addEventListener('click', async () => {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let query = document.getElementById('search');
    let listaDeFilmes = await procurarFilme(query.value);
    let ul = document.createElement('ul');
    ul.id = "lista";
    if (listaDeFilmes) {
        for (const item of listaDeFilmes.results) {
            let li = document.createElement('li');
            ul.appendChild(li);
            let div = document.createElement('div');
            div.className = 'layout';
            li.appendChild(div);
            let img = document.createElement('img');
            img.src = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${item.poster_path}`;
            div.appendChild(img);
            let div1 = document.createElement('div');
            div1.className = "descricao";
            div.appendChild(div1);
            let p = document.createElement('p');
            p.innerHTML = `${item.original_title}`;
            div1.appendChild(p);
            let button = document.createElement('button');
            button.innerHTML = 'Adicionar';
            button.id = `${item.id}`;
            button.className = 'butaoId';
            div1.appendChild(button);
            let button2 = document.createElement('button');
            button2.innerHTML = 'Adicionar à lista';
            button2.id = `${item.id}`;
            button2.className = 'butao2Id';
            div1.appendChild(button2);
        }
    }
    searchContainer.appendChild(ul);
    let butaos = document.getElementsByClassName('butaoId');
    for (let butao of butaos) {
        butao.addEventListener('click', async () => {
            const filmeId = butao.getAttribute('id');
            await adicionarFilme(Number(filmeId));
        });
    }
    let butaos2 = document.getElementsByClassName('butao2Id');
    for (let butao of butaos2) {
        butao.addEventListener('click', async () => {
            const filmeId = butao.getAttribute('id');
            await adicionarFilmeNaLista(Number(filmeId), listId);
        });
    }
});
listButton.addEventListener('click', async () => {
    searchContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
});
listButtonCancel.addEventListener('click', async () => {
    searchContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
});
listButtonCreate.addEventListener('click', async () => {
    await criarLista(nomeLista, descricao);
    searchContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
    listButtonCreate.setAttribute('disabled', 'anable');
});
ShowListButton.addEventListener('click', async () => {
    searchContainer.classList.add('hidden');
    ShowListContainer.classList.remove('hidden');
    await pegarLista();
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let listaDeFilmes = await pegarLista();
    let ul = document.createElement('ul');
    ul.id = "lista";
    if (listaDeFilmes) {
        for (const item of listaDeFilmes.items) {
            let li = document.createElement('li');
            ul.appendChild(li);
            let div = document.createElement('div');
            div.className = 'layout';
            li.appendChild(div);
            let img = document.createElement('img');
            img.src = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${item.poster_path}`;
            div.appendChild(img);
            let div1 = document.createElement('div');
            div1.className = "descricao";
            div.appendChild(div1);
            let p = document.createElement('p');
            p.innerHTML = `${item.original_title}`;
            div1.appendChild(p);
        }
    }
    ShowListContainer.appendChild(ul);
});
ShowListButtonCancel.addEventListener('click', async () => {
    searchContainer.classList.remove('hidden');
    ShowListContainer.classList.add('hidden');
});
function preencherSenha() {
    let getPassword = document.getElementById('senha');
    password = getPassword.value;
    validateLoginButton();
}
function preencherLogin() {
    let getusername = document.getElementById('login');
    username = getusername.value;
    validateLoginButton();
}
function preencherApi() {
    let getApiKey = document.getElementById('api-key');
    apiKey = getApiKey.value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.removeAttribute('disabled');
    }
}
function preencherNomeLista() {
    let getNomeLista = document.getElementById('nomeDaLista');
    nomeLista = getNomeLista.value;
    validateListButton();
}
function preencherDescricao() {
    let getDescricao = document.getElementById('descricao');
    descricao = getDescricao.value;
    validateListButton();
}
function validateListButton() {
    if (nomeLista && descricao) {
        listButtonCreate.removeAttribute('disabled');
    }
}
class HttpClient {
    static async get({ url = '', method = '', body = null || JSON.parse('{}') }) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open(method, url, true);
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(JSON.parse(request.responseText));
                }
                else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
            if (body) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                body = JSON.stringify(body);
            }
            request.send(body);
        });
    }
}
async function procurarFilme(query) {
    query = encodeURI(query);
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
        method: "GET"
    });
    return result;
}
async function adicionarFilme(filmeId) {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
        method: "GET"
    });
}
async function criarRequestToken() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
        method: "GET"
    });
    let token = result;
    requestToken = token.request_token;
}
async function logar() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
        method: "POST",
        body: {
            username: `${username}`,
            password: `${password}`,
            request_token: `${requestToken}`
        }
    });
    let resultLogin = result;
    if (resultLogin.success) {
        return true;
    }
    return false;
}
async function criarSessao() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
        method: "GET"
    });
    let sessao = result;
    sessionId = sessao.session_id;
}
async function criarLista(nomeDaLista, descricao) {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br"
        }
    });
    let list = result;
    listId = list.list_id;
}
async function adicionarFilmeNaLista(filmeId, listaId) {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
            media_id: filmeId
        }
    });
}
async function pegarLista() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
        method: "GET"
    });
    if (result) {
        return result;
    }
}
