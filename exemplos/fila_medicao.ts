import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";

function iniciarMedicao(): bigint {
    return process.hrtime.bigint();
}

function printMedicao(inicio: bigint, mensagem: string) {
    let fim = process.hrtime.bigint();
    let ms = (fim - inicio) / BigInt(1000000);
    console.log(`${mensagem}${ms}`);
}

const N = 50_000;
for(let medicoes = 1; medicoes < 100; medicoes++) {
    let fila = new ArrayQueue<number>();
    for(let iter = 0; iter < N*2*medicoes; iter++) {
        fila.addLast(Math.random());
    }

    let inicio = iniciarMedicao();
    fila.resize();
    //printMedicao(inicio,`${medicoes} Nº elementos: ${fila.size()} Tempo:`);
    printMedicao(inicio,"");
}

