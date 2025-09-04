import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { bubbleSort } from "../../src/algoritmos/ordenacao/bubbleSort.js";
import { selectionSort } from "../../src/algoritmos/ordenacao/selectionSort.js";
import { binaryInsertionSort, insertionSort } from "../../src/algoritmos/ordenacao/insertionSort.js";

describe("Testes em Ordenação", () => {

    function gerarLista(tamanho: number) {
        const lista = [];
        for(let i = 0; i < tamanho; i ++) {
            lista.push(Math.floor(Math.random() * tamanho));
        }
        return lista;
    }

    function verificaOrdem(lista: number[]) {
        for(let i = 1; i < lista.length; i++) {
            if(lista[i] < lista[i-1]) {
                return false;
            }
        }
        return true;
    }

    function testarAlgoritmoOrdenacao(algoritmo: <T>(lista: T[], compFn?: (a: T, b: T) => number) => T[]) {
        const compFn = (a: number, b: number) => a - b;

        // Testes básicos
        expect(algoritmo([], compFn)).toEqual([]);
        expect(algoritmo([1], compFn)).toEqual([1]);
        expect(algoritmo([1,2,3,4], compFn)).toEqual([1,2,3,4]);
        expect(algoritmo([4,3,2,1], compFn)).toEqual([1,2,3,4]);

        // Irá converter números para strings se não passar a função de comparação
        expect(algoritmo([1,2,3,21,32,43])).toEqual([1,2,21,3,32,43]);
        expect(algoritmo(["D","C","B","A"])).toEqual(["A","B","C","D"]);
        expect(algoritmo(["A",undefined,"C","D"])).toEqual(["A","C","D", undefined]);

        [
            gerarLista(10),
            gerarLista(100),
            gerarLista(1000),
            gerarLista(5000),
        ].forEach(lista => {
            let ordenada = algoritmo(lista, compFn);

            // Verifica se está correto
            expect(ordenada.length).toBe(lista.length);
            expect(verificaOrdem(ordenada)).toBe(true);
        });
    }

    test("BubbleSort", () => {
        testarAlgoritmoOrdenacao(bubbleSort);
    });

    test("SelectionSort", () => {
        testarAlgoritmoOrdenacao(selectionSort);
    });

    test("InsertionSort", () => {
        testarAlgoritmoOrdenacao(insertionSort);
    });

    test("BinaryInsertionSort", () => {
        testarAlgoritmoOrdenacao(binaryInsertionSort);
    });
});