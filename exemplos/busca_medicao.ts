import { binarySearch } from "../src/algoritmos/busca/binarySearch.js";
import { graficoTempoExecucao } from "./grafico.js";

function gerarLista(tamanho: number) {
    const lista = [];
    for(let i = 0; i < tamanho; i ++) {
        lista.push(i);
    }
    return lista;
}

function gerarListas(N: number, etapas: number) {
    let listas = [];
    for(let quantas = 0; quantas < etapas; quantas++) {
        listas.push(gerarLista(N * quantas));
    }
    return listas;
}

await graficoTempoExecucao(100000, 40, 2, [
    {
        name: "Array.indexOf",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                
                const posicao = lista.indexOf(Math.floor(Math.random() * lista.length));
            };
        },
    },
    {
        name: "binarySearch",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                
                for(let i = 0; i < 1000; i++) {
                    const valor = Math.floor(Math.random() * lista.length);
                    const posicao = binarySearch(lista, valor, 0, lista.length, (a,b) => a - b);
                }
            };
        },
    }
]);