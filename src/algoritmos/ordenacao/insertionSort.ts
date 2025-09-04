import { lexicograficallyCompare } from "../../utils/lexicograficallyCompare.js";
import { binarySearch, binarySearchLeftMost } from "../busca/binarySearch.js";

export const insertionSort = <T>(arr: T[], compFn: (a: T,b: T) => number = lexicograficallyCompare): T[] => {
    // Para cada posição, começando no segundo:
    for(let i = 1; i < arr.length; i++) {
        // Valor a ser inserido
        const currentValue = arr[i];

        // Ao contrário, para cada posição anterior:
        // Deslocar os elementos da parte ordenada até encontrar a posição correta
        let k = i - 1;
        // Ao contrário, para cada posição anterior:
        for(;k >= 0; k--) {
            // O valor é maior que o que será inserido?
            let value = arr[k];
            if(compFn(value, currentValue) > 0) {
                // Sim: desloca valor
                arr[k+1] = value;
            } else {
                // Não: parar a repetição ao contrário
                break;
            }
        }

        // Por último, insere o valor na posição correta após os deslocamentos
        arr[k + 1] = currentValue;
    }
    return arr;
};

// Variante, usando busca binária para encontrar a posição correta ao invés de varrer
// Vantagem: menos comparações, usado quando compFn é caro de ser executado (Objetos, strings longas, etc...)
export const binaryInsertionSort = <T>(arr: T[], compFn: (a: T,b: T) => number = lexicograficallyCompare): T[] => {
    // Para cada posição, começando no segundo:
    for(let i = 1; i < arr.length; i++) {
        // Valor a ser inserido
        const currentValue = arr[i];

        // Encontra a posição correta para inserção usando busca binária na parte ordenada (0 até i-1)
        const insertionPoint = binarySearchLeftMost(arr, currentValue, 0, i, compFn);

        // Desloca os elementos de 'insertionPoint' até 'i-1' uma posição para a direita
        for (let j = i; j > insertionPoint; j--) {
            arr[j] = arr[j - 1];
        }

        // Insere o valor na posição correta
        arr[insertionPoint] = currentValue;
    }
    return arr;
}