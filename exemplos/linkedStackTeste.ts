import { Elem, LinkedStack } from "../src/estruturas/linkedStack.js";

let lista = new LinkedStack<string>();

lista.push("C");
lista.push("B");
lista.push("A");

console.log(lista);

console.log("Size:", lista.size());
console.log("Empty?: ", lista.isEmpty());

console.log("POP:",lista.pop());
console.log("POP:",lista.pop());
console.log("POP:",lista.pop());
console.log("POP:",lista.pop());


console.log(lista);
console.log("Size:", lista.size());
console.log("Empty?: ", lista.isEmpty());
