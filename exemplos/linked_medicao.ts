import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { LinkedList } from "../src/estruturas/linkedList.js";
import { List } from "../src/interfaces/list.js";
const N = 10_000;

function criarListas(): List<number>[] {
    return [
        //new DoublyLinkedList1(),
        //new LinkedList2(),
        //new DoublyLinkedList3(),
        //new DoublyLinkedList4(),
        //new DoublyLinkedList5(),
        //new DoublyLinkedList6(),
        //new DoubleLinkedList7(),
        new LinkedList()
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
        list.add(Math.floor(Math.random() * 100), Math.floor(Math.random() * list.size()));
        list.get(Math.floor(Math.random() * list.size()));
        if(iter % 2 === 0)
        list.remove(Math.floor(Math.random() * list.size()));
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

