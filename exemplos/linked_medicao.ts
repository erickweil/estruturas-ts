import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { DoublyLinkedList1 } from "../src/estruturas/linkedList/grupo1.js";
import { LinkedList2 } from "../src/estruturas/linkedList/grupo2.js";
import { DoublyLinkedList3 } from "../src/estruturas/linkedList/grupo3.js";
import { DoublyLinkedList4 } from "../src/estruturas/linkedList/grupo4.js";
import { DoublyLinkedList5 } from "../src/estruturas/linkedList/grupo5.js";
import { DoublyLinkedList6 } from "../src/estruturas/linkedList/grupo6.js";
import { DoubleLinkedList7 } from "../src/estruturas/linkedList/grupo7.js";
import { List } from "../src/interfaces/list.js";
const N = 10_000;

function criarListas(): List<number>[] {
    return [
        new DoublyLinkedList1(),
        new LinkedList2(),
        new DoublyLinkedList3(),
        new DoublyLinkedList4(),
        new DoublyLinkedList5(),
        new DoublyLinkedList6(),
        new DoubleLinkedList7()
    ]
}

function iniciarMedicao(): bigint {
    return process.hrtime.bigint();
}

function printMedicao(inicio: bigint, mensagem: string) {
    let fim = process.hrtime.bigint();
    let ms = (fim - inicio) / BigInt(1000000);
    console.log(`${mensagem}${ms}`);
}

function medirAdd(list: List<number>, medicao: number) {
    for(let iter = 0; iter < N * medicao; iter++) {
        list.addLast(iter);
        list.get(Math.floor(Math.random() * list.size()));
    }
}

for(let medicoes = 1; medicoes < 10; medicoes++) {
    let fila = new ArrayQueue<number>();
    
    let lists = criarListas();
    console.log();
    console.log("Medição Nº",medicoes);
    for(let [n, lista] of lists.entries()) {
        let inicio = iniciarMedicao();
        medirAdd(lista, medicoes);
        //printMedicao(inicio,`${medicoes} Nº elementos: ${fila.size()} Tempo:`);
        printMedicao(inicio,`Lista Nº ${n}, Tempo:`);
    }
}

