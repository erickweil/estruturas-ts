import { lexicograficallyCompare } from "../utils/lexicograficallyCompare.js";

export const insertionSort = <T>(arr: T[], compFn: (a: T,b: T) => number = lexicograficallyCompare) => {
    // Para cada posição, começando no segundo:
    for(let i = 1; i < arr.length; i++) {
        // Valor a ser inserido
        let currentValue = arr[i];
        let insertIndex = i;
        // Ao contrário, para cada posição anterior:
        for(let k = i - 1; k >= 0; k--) {
            // O valor é maior que o que será inserido?
            if(compFn(arr[k], currentValue) > 0) {
                // Sim: desloca valor
                arr[k+1] = arr[k];
                insertIndex = k;
            } else {
                // Não: parar a repetição ao contrário
                break;
            }
        }
        // Por último, insere o valor na posição correta após os deslocamentos
        arr[insertIndex] = currentValue;
    }
    return arr;
};