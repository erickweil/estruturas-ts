import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { bubbleSort } from "../../src/ordenacao/bubbleSort.js";
import { selectionSort } from "../../src/ordenacao/selectionSort.js";

describe("Testes em Ordenação", () => {

    function gerarLista(tamanho: number) {
        const lista = [];
        for(let i = 0; i < tamanho; i ++) {
            lista.push(Math.floor(Math.random() * tamanho));
        }
        return lista;
    }

    function verificaOrdem(lista: number[]) {
        let anterior = lista[0];
        for(let elemento of lista) {
            expect(elemento >= anterior).toBe(true);
            anterior = elemento;
        }
    }

    test("BubbleSort", () => {
        let listas = [
            [9,8,7,6,5,4,3,2,1,0],
            [0,1,2,3,4,5,6,7,8,9],
            [7,4,8,2,8,0,1,7,8,9],
            gerarLista(10),
            gerarLista(100),
            gerarLista(1000)
        ]
        for(let lista of listas) {
            lista = bubbleSort(lista);
            verificaOrdem(lista);
        }
    });



    test("SelectionSort", () => {
        let listas = [
            [9,8,7,6,5,4,3,2,1,0],
            [0,1,2,3,4,5,6,7,8,9],
            [7,4,8,2,8,0,1,7,8,9],
            gerarLista(10),
            gerarLista(100),
            gerarLista(1000)
        ]
        for(let lista of listas) {
            lista = selectionSort(lista);
            verificaOrdem(lista);
        }
    });
});