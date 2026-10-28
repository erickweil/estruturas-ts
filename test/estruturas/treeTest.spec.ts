import { describe, expect, test } from "vitest";
import { LinkedTree } from "../../src/estruturas/linkedTree.js";

describe("Testes em Árvore", () => {
    test("Árvore: Testes padrão", async () => {
        let t = new LinkedTree<string>((a,b) => a.localeCompare(b));
        expect(t.isEmpty()).toBe(true);

        // vazia não deve atravessar nada
        let quantos = 0;
        t.traverseDFS((v) => quantos++);
        expect(quantos).toBe(0);

        // t.traverseBFS((v) => quantos++);
        // expect(quantos).toBe(0);

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

        expect(t.get("A")).toBe("A");
        expect(t.get("B")).toBe("B");
        expect(t.get("C")).toBe("C");
        expect(t.get("D")).toBe("D");
        expect(t.get("E")).toBe("E");
        expect(t.get("F")).toBe(undefined);

        // raiz deve ser C (o primeiro que adicionou)
        expect(t.isEmpty()).toBe(false);
        expect((t as any).root?.value).toBe("C");

        // travessia em ordem
        let ordem: string[] = [];
        t.traverseDFS((v) => ordem.push(v));
        expect(ordem.join()).toBe("A,B,C,D,E");

        // ordem = [];
        // t.traverseBFS((v) => ordem.push(v));
        // expect(ordem.join()).toBe("C,B,D,A,E");

        t.clear();
        expect(t.isEmpty()).toBe(true);
    });

    test("Árvore: Teste inserção em massa", async () => {
        type TestNo = { valor: number, visitado: number };
        let t = new LinkedTree<TestNo>((a,b) => a.valor - b.valor);

        for(let i =0; i < 1000; i++) {
            const valor = Math.random();
            t.add({ valor: valor, visitado: 0 });
            const lido = t.get({ valor: valor, visitado: 0 });

            expect(lido?.valor).toBe(valor);
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

        // t.traverseBFS((v) => {
        //     expect(v.visitado).toBe(1);
        //     v.visitado++;
        //     quantos++;
        // });
        // expect(quantos).toBe(2000);
    });
});