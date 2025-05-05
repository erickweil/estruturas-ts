import { Queue } from "../src/estruturas/queue.js";

let fila = new Queue<string>(5);

for(let i = 5; i >= 0; i--) {
    console.log("Inserido A");
    fila.addLast("A");
    console.log("Inserido B");
    fila.addLast("B");
    console.log("Inserido C");
    fila.addLast("C");


    console.log("Removido:", fila.removeFirst());
    console.log("Removido:", fila.removeFirst());
    console.log("Removido:", fila.removeFirst());
}