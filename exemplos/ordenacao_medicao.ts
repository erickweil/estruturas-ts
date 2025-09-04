import { bubbleSort } from "../src/algoritmos/ordenacao/bubbleSort.js";
import { binaryInsertionSort, insertionSort } from "../src/algoritmos/ordenacao/insertionSort.js";
import { selectionSort } from "../src/algoritmos/ordenacao/selectionSort.js";
import { graficoTempoExecucao } from "./grafico.js";

function gerarLista(tamanho: number) {
    const lista = [];
    for(let i = 0; i < tamanho; i ++) {
        lista.push(Math.floor(Math.random() * tamanho));
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

function misturar(arr: number[]) {
  for (var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr;
}

await graficoTempoExecucao(1000, 30, 1, [
    {
        name: "Array.sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                lista.sort((a, b) => a - b);
            };
        },
    },
    /*{
        name: "Bubble sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                bubbleSort(lista, (a, b) => a - b);
            };
        },
    },*/
    {
        name: "Selection sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                selectionSort(lista, (a, b) => a - b);
            };
        },
    },
    {
        name: "Insertion sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                insertionSort(lista, (a, b) => a - b);
            };
        },
    },
    {
        name: "Binary insertion sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                binaryInsertionSort(lista, (a, b) => a - b);
            };
        },
    },
]);