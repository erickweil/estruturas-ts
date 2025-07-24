import { ArrayDeque } from "../src/estruturas/arrayDeque.js";
import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { LinkedList } from "../src/estruturas/linkedList.js";
import { PoolList } from "../src/estruturas/poolList.js";
import { Deque } from "../src/interfaces/deque.js";
import { List } from "../src/interfaces/list.js";
const N = 100_000;

function criarListas(): Deque<unknown>[] {
    return [
        //new DoublyLinkedList1(),
        //new LinkedList2(),
        //new DoublyLinkedList3(),
        //new DoublyLinkedList4(),
        //new DoublyLinkedList5(),
        //new DoublyLinkedList6(),
        //new DoubleLinkedList7(),

        new ArrayDeque(),
        new LinkedList(),
        new PoolList()
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

function medirAdd(list: Deque<any>, medicao: number) {
    for(let iter = 0; iter < N * medicao; iter++) {
        /*list.add(Math.floor(Math.random() * 100), Math.floor(Math.random() * list.size()));
        list.get(Math.floor(Math.random() * list.size()));
        if(iter % 2 === 0)
        list.remove(Math.floor(Math.random() * list.size()));*/

        for(let i = 0; i < 100; i++) {
            list.addFirst(Math.floor(Math.random() * 100));
            list.removeLast();
        }

        list.addLast(Math.floor(Math.random() * 100));
        list.peekFirst();
        if(iter % 2 === 0) {
            list.removeLast();
        }
    }
}

for(let medicoes = 1; medicoes < 10; medicoes++) {    
    let lists = criarListas();
    console.log();
    console.log("Medição Nº",medicoes);
    for(let [n, lista] of lists.entries()) {
        let inicio = iniciarMedicao();
        medirAdd(lista as any, medicoes);
        //printMedicao(inicio,`${medicoes} Nº elementos: ${fila.size()} Tempo:`);
        printMedicao(inicio,`Lista Nº ${n} (${(lista as Object).constructor.name}), Tempo:`);
    }
}

