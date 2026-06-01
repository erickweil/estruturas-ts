import { FilaCircular } from "../src/estruturas/filaCircular.js";

let fila = new FilaCircular(4);

console.log("Adicionando elementos...");
fila.enfileirar(10);
fila.enfileirar(20);
fila.enfileirar(30);
fila.enfileirar(40);

console.log("Tentando adicionar com a fila cheia:");
fila.enfileirar(50); 

console.log("Removendo 2 elementos...");
fila.desenfileirar();
fila.desenfileirar();

console.log("Adicionando novos elementos no espaço que abriu:");
fila.enfileirar(60); 
fila.enfileirar(70);

console.log("Estado final do array interno:");
console.log(fila.array);