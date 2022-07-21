"use strict";
var Trabalho;
(function (Trabalho) {
    Trabalho[Trabalho["Tecnico"] = 0] = "Tecnico";
    Trabalho[Trabalho["Jogador"] = 1] = "Jogador";
})(Trabalho || (Trabalho = {}));
var pessoa1 = {
    nome: 'Ronaldo Fenômeno',
    idade: 45,
    profissao: Trabalho.Tecnico
};
var pessoa2 = {
    nome: 'Zico',
    idade: 69,
    profissao: Trabalho.Tecnico
};
var pessoa3 = {
    nome: 'Gabi',
    idade: 25,
    profissao: Trabalho.Jogador
};
var pessoa4 = {
    nome: "Roberto Carlos",
    idade: 49,
    profissao: Trabalho.Jogador
};
