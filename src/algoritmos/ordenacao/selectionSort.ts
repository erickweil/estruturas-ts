import { lexicograficallyCompare } from "../../utils/lexicograficallyCompare.js";

/**
   Conforme Atravessar cada elemento:
   Seleciona qual é o menor a partir da posição atual
   E o coloca na posição atual (caso não esteja)
*/
export const selectionSort = <T>(arr: T[], compFn: (a: T,b: T) => number = lexicograficallyCompare): T[] => {
    for(let i = 0; i < arr.length - 1; i++) {
        // 1. Seleciona o menor a partir de i
        let menor = arr[i];
        let qual = i;
        for(let k = i+1; k < arr.length ; k++) {
            let valor = arr[k];
            if(compFn(valor, menor) < 0) {
                menor = valor;
                qual = k; 
            }
        }

        // 2. Coloca o menor na posição i (se já não estiver)
        if(qual != i) {
            arr[qual] = arr[i];
            arr[i] = menor;
        }
    }
    return arr;
};