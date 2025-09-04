import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { binarySearch, binarySearchLeftMost } from "../../src/algoritmos/busca/binarySearch.js";

describe("Testes em Busca Binária", () => {
    test("Busca binária", () => {
        const compFn = (a: number, b: number) => a - b;

        // Função para garantir que os resultados da busca binária (nas duas variantes) estão corretos, comparando com indexOf
        const testSearch = <T>(arr: T[], value: T, start?: number, end?: number, compFn?: (a: T,b: T) => number): number => {
            let baseline = arr.slice(0, end ?? arr.length).indexOf(value, start);
            let binary = binarySearch(arr, value, start, end, compFn);
            let leftMost = binarySearchLeftMost(arr, value, start, end, compFn);
            leftMost = leftMost < arr.length && arr[leftMost] === value ? leftMost : -1;

            expect(binary).toBe(leftMost);
            expect(binary).toBe(baseline);

            return binary;
        };

        // Testes básicos
        expect(testSearch([], 1)).toBe(-1);
        expect(testSearch([1], 1)).toBe(0);
        expect(testSearch([1], 2)).toBe(-1);
        expect(testSearch(["A","B","C","D","E"], "C")).toBe(2);
        expect(testSearch(["A","B","C","D","E"], "F")).toBe(-1);
        
        // Deve funcionar com undefined
        expect(testSearch(["A","B","C","D","E"], undefined)).toBe(-1);
        expect(testSearch(["A","B","C","D","E", undefined], undefined)).toBe(5);

        // Não deve funcionar em array não ordenado
        expect(binarySearch(["B","E","D","C","A"], "C")).toBe(-1);

        // Encontrar todos os elementos
        let arr = [0,1,2,3,4,5,6,7,8,9];
        for(let i = 0; i < arr.length; i++) {
            expect(testSearch(arr, i, 0, arr.length, compFn)).toBe(i);

            expect(binarySearch(arr, i + 0.5, 0, arr.length, compFn)).toBe(-1);
            expect(binarySearchLeftMost(arr, i + 0.5, 0, arr.length, compFn)).toBe(i+1);
        }
    });

    test("Busca binária, deve realizar no máximo log²(n) comparações", () => {
        let nComparacoes = 0;
        const compFn = (a: number, b: number) => {
            nComparacoes++;
            return a - b;
        };

        let arr = [];
        for(let i = 0; i < 1000; i++) {
            arr.push(i);
        }

        for(let i = 0; i < arr.length; i++) {
            nComparacoes = 0;
            expect(binarySearch(arr, i, 0, arr.length, compFn)).toBe(i);
            expect(nComparacoes).toBeLessThanOrEqual(Math.ceil(Math.log2(arr.length)));

            nComparacoes = 0;
            expect(binarySearchLeftMost(arr, i, 0, arr.length, compFn)).toBe(i);
            expect(nComparacoes).toBeLessThanOrEqual(Math.ceil(Math.log2(arr.length)) + 1);
        }
    });
});