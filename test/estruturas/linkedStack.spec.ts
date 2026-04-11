import { describe, expect, test } from "vitest";
import { LinkedStack } from "../../src/estruturas/linkedStack.js";

describe("Testes em LinkedStack", () => {

    function popAll(lista: LinkedStack<string>, expected: string[]) {
        let valores: string[] = [];
        while(!lista.isEmpty()) {
            valores.push(lista.pop()!);
        }
        expect(lista.isEmpty()).toBe(true);
        expect(valores).toStrictEqual(expected);
    }

    test("Testes método clone()", () => {
        const master = new LinkedStack<string>();
        master.push("A");
        master.push("B");
        master.push("C");

        const clone1 = master.clone();
        clone1.push("A'");
        clone1.push("B'");

        master.push("D");
        master.push("E");

        const clone2 = master.clone();
        clone2.push("A''");
        clone2.push("B''");

        popAll(master,["E","D","C","B","A"]);
        popAll(clone1,["B'","A'","C","B","A"]);
        popAll(clone2,["B''","A''","E","D","C","B","A"]);
    });

    test("Testes do protocolo iterável", () => {
        const lista = new LinkedStack<string>();
        lista.push("A");
        lista.push("B");
        lista.push("C");

        let valores: string[] = [];
        for(let valor of lista) {
            valores.push(valor);
        }
        expect(valores).toStrictEqual(["C","B","A"]);

        // Modificando a pilha durante a iteração
        valores = [];
        for(let valor of lista) {
            valores.push(valor);
            if(valor === "B") {
                lista.pop(); // Remove "C"
            }
            if(valor === "A") {
                lista.push("D"); // Adiciona "D" no topo
            }
        }
        expect(valores).toStrictEqual(["C","B","A"]);
    });
});