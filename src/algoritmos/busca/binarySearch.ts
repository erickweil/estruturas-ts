import { lexicograficallyCompare } from "../../utils/lexicograficallyCompare.js";

/**
 * Busca binária, retorna o índice do elemento encontrado ou -1 se não encontrado.
 * @param start Índice inicial (inclusivo)
 * @param end Índice final (exclusivo)
 */
export const binarySearch = <T>(arr: T[], value: T, start?: number, end?: number, compFn: (a: T,b: T) => number = lexicograficallyCompare): number => {
    end = end === undefined ? arr.length-1 : end-1;
    let left = start === undefined ? 0 : start;
    let right = end;

    while(left <= right) {
        // Posição do meio
        const mid = left + Math.floor((right - left) / 2);
        const cmp = compFn(arr[mid], value);
        if(cmp < 0) {
            left = mid + 1;
        } else if(cmp > 0) {
            right = mid - 1;
        } else {
            // Achou!
            return mid;
        }
    }

    // Não achou
    return -1;
}

/*
Implementação recursiva, para referência.
export const binarySearchAula = <T>(arr: T[], value: T, start?: number, endEx?: number, compFn: (a: T,b: T) => number = lexicograficallyCompare): number => {
    const end = endEx === undefined ? arr.length-1 : endEx-1;
    start = start === undefined ? 0 : start;

    if(start > end) return -1;

    const mid = Math.floor((start + end) / 2);
    const current = arr[mid];

    const comparacao = compFn(current, value);
    if(comparacao > 0) {
        return binarySearchAula(arr, value, start, mid, compFn);
    } else if(comparacao < 0) {
        return binarySearchAula(arr, value, mid+1, end+1, compFn);
    } else { // igual
        return mid;
    }
}
*/

/**
 * Busca binária, retorna o índice do primeiro elemento que é maior ou igual ao valor buscado.
 * @param start Índice inicial (inclusivo)
 * @param end Índice final (exclusivo)
 */
export const binarySearchLeftMost = <T>(arr: T[], value: T, start?: number, end?: number, compFn: (a: T,b: T) => number = lexicograficallyCompare): number => {
    end = end === undefined ? arr.length : end;
    let left = start === undefined ? 0 : start;
    let right = end;

    while(left < right) {
        // Posição do meio
        const mid = left + Math.floor((right - left) / 2);
        const cmp = compFn(arr[mid], value);
        if(cmp < 0) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}