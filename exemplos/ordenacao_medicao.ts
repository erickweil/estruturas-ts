import { BufferPool } from "../src/estruturas/bufferPool.js";
import { bubbleSort } from "../src/ordenacao/bubbleSort.js";
import { selectionSort } from "../src/ordenacao/selectionSort.js";
import { createStructView, StructType } from "../src/utils/structSchema.js";
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

await graficoTempoExecucao(2_000, 30, 2, [
    {
        name: "Array.sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                lista.sort();
            };
        },
    },
    {
        name: "Bubble sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                bubbleSort(lista);
            };
        },
    },
    {
        name: "Selection sort",
        setup: async (N: number, etapas: number) => {
            let listas = gerarListas(N, etapas);
            return (N: number, etapa: number) => {
                let lista = listas[etapa];
                selectionSort(lista);
            };
        },
    },
]);