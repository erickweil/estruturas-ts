import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";

function iniciarMedicao(): bigint {
    return process.hrtime.bigint();
}

function printMedicao(inicio: bigint, mensagem: string) {
    let fim = process.hrtime.bigint();
    let ms = (fim - inicio) / BigInt(1000000);
    console.log(`${mensagem}${ms} ms`);
}

const N = 500_000;
let fila = new DualStackQueue<string>();

for(let medicoes = 0; medicoes < 100; medicoes++) {
    let inicio = iniciarMedicao();
    for(let iter = 0; iter < N*2; iter++) {
        fila.addLast(""+Math.random());
    }
    for(let iter = 0; iter < N; iter++) {
        fila.removeFirst();
    }
    printMedicao(inicio,`${medicoes} Nº elementos: ${fila.size()} Tempo:`);
}

