/**

Conforme Atravessar cada elemento:
    Seleciona qual é o menor a partir da posição atual
    E o coloca na posição atual (caso não esteja)
*/
export const selectionSort = (arr: number[]) => {
    for(let i = 0; i < arr.length - 1; i++) {
        let menor = arr[i];
        let qual = i;
        for(let k = i+1; k < arr.length ; k++) {
            let valor = arr[k];
            if(valor < menor) {
                menor = valor;
                qual = k; 
            }
        }

        if(qual != i) {
            arr[qual] = arr[i];
            arr[i] = menor;
        }
    }
    return arr;
};