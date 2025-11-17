import { describe, expect, test } from "vitest";
import { LinkedTree } from "../../src/estruturas/likedTree.js";

describe("Testes em Árvore", () => {
    test("Árvore: Testes padrão", async () => {
        let t = new LinkedTree<string>();
        expect(t.isEmpty()).toBe(true);

        // vazia não deve atravessar nada
        let quantos = 0;
        t.traverseDFS((v) => quantos++);
        expect(quantos).toBe(0);

        t.traverseBFS((v) => quantos++);
        expect(quantos).toBe(0);

        /*
                    C
                B       D
            A               E
        */
        // adicionar
        t.add("C");
        t.add("B");
        t.add("D");
        t.add("A");
        t.add("E");

        // raiz deve ser C (o primeiro que adicionou)
        expect(t.isEmpty()).toBe(false);
        expect(t.raiz?.valor).toBe("C");

        // travessia em ordem
        let ordem: string[] = [];
        t.traverseDFS((v) => ordem.push(v));
        expect(ordem.join()).toBe("A,B,C,D,E");

        ordem = [];
        t.traverseBFS((v) => ordem.push(v));
        expect(ordem.join()).toBe("C,B,D,A,E");

        t.clear();
        expect(t.isEmpty()).toBe(true);
    });

    test("Árvore: Teste inserção em massa", async () => {
        type TestNo = { valor: number, visitado: number };
        let t = new LinkedTree<TestNo>((a,b) => a.valor - b.valor);

        for(let i =0; i < 1000; i++) {
            t.add({ valor: Math.random(), visitado: 0 });
        }

        // Garante que atravessou em ordem.
        let ultimo: number | null = null;
        let quantos = 0;
        t.traverseDFS((v) => {
            expect(v.visitado).toBe(0);
            v.visitado++;
            quantos++;
            if(ultimo !== null) {
                expect(v.valor >= ultimo).toBe(true);
            }
            ultimo = v.valor;
        });
        expect(quantos).toBe(1000);

        t.traverseBFS((v) => {
            expect(v.visitado).toBe(1);
            v.visitado++;
            quantos++;
        });
        expect(quantos).toBe(2000);


    });
});