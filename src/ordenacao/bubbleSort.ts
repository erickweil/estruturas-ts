export const bubbleSort = (arr: number[]) => {
    while(true) {
        let trocas = 0;
        // 1. Percorrer cada par do array
        for(let i = 0; i < arr.length - 1; i++) {
            let a = arr[i];
            let b = arr[i+1];

            // 2. Não Está em ordem? troca!
            if(a > b) {
                // está errado tem que trocar.
                arr[i] = b;
                arr[i+1] = a;
                trocas++;
            }
        }
        // Aconteceu alguma troca?
        if(trocas == 0) {
            // Se não houve nenhuma, então está em ordem!
            return arr;
        }
    }    
};