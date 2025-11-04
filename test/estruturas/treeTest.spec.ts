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

        t.clear();
        expect(t.isEmpty()).toBe(true);
    });

    test("Árvore: Teste inserção em massa", async () => {
        let t = new LinkedTree<number>((a,b) => a - b);

        for(let i =0; i < 1000; i++) {
            t.add(Math.random());
        }

        // Garante que atravessou em ordem.
        let ultimo: number | null = null;
        t.traverse((v) => {
            if(ultimo !== null) {
                expect(v >= ultimo).toBe(true);
            }
            ultimo = v;
        });
    });
});