
enum Trabalho {
    Tecnico,
    Jogador
}

type Humano = {
    nome: string,
    idade: number,
    profissao: Trabalho
}

let pessoa1: Humano = {
    nome: 'Ronaldo Fenômeno',
    idade: 45,
    profissao: Trabalho.Tecnico
};

let pessoa2: Humano = {
    nome: 'Zico',
    idade: 69,
    profissao: Trabalho.Tecnico
};

let pessoa3: Humano = {
    nome: 'Gabi',
    idade: 25,
    profissao: Trabalho.Jogador
};

let pessoa4: Humano = {
    nome: "Roberto Carlos",
    idade: 49,
    profissao: Trabalho.Jogador
}