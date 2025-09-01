import { lexicograficallyCompare } from "../utils/lexicograficallyCompare.js";

export const bubbleSort = <T>(arr: T[], compFn: (a: T,b: T) => number = lexicograficallyCompare) => {
    for(let k = 0; k < arr.length; k++) {
        let houveTroca = false;
        // 1. Percorrer cada par do array (Exceto os últimos k que já estão ordenados)
        for(let i = 0; i < arr.length - 1 - k; i++) {
            let a = arr[i];
            let b = arr[i+1];

            // 2. Não Está em ordem? troca!
            if(compFn(a,b) > 0) {
                arr[i] = b;
                arr[i+1] = a;
                houveTroca = true;
            }
        }

        if(!houveTroca) {
            // Se não houve nenhuma, então está em ordem!
            return arr;
        }
    }
    return arr;
};