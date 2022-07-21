declare enum Trabalho {
    Tecnico = 0,
    Jogador = 1
}
declare type Humano = {
    nome: string;
    idade: number;
    profissao: Trabalho;
};
declare let pessoa1: Humano;
declare let pessoa2: Humano;
declare let pessoa3: Humano;
declare let pessoa4: Humano;
