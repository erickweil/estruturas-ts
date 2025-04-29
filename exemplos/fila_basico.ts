import { Fila } from "../src/estruturas/fila.js";

let fila = new Fila<string>(5);

for(let i = 5; i >= 0; i--) {
    console.log("Inserido A");
    fila.inserir("A");
    console.log("Inserido B");
    fila.inserir("B");
    console.log("Inserido C");
    fila.inserir("C");


    console.log("Removido:", fila.remover());
    console.log("Removido:", fila.remover());
    console.log("Removido:", fila.remover());
}