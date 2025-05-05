import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Queue } from "../../src/estruturas/queue.js";

describe("Testes em Fila", () => {

    test("Teste inserir e remover", async () => {
        let fila = new Queue<string>(5);

        for(let i = 5; i >= 0; i--) {
            expect(fila.size()).toBe(0);
            fila.addLast("A");
            fila.addLast("B");
            fila.addLast("C");
    
            expect(fila.size()).toBe(3);
            expect(fila.peekFirst()).toBe("A");
            expect(fila.removeFirst()).toBe("A");
            expect(fila.removeFirst()).toBe("B");
            expect(fila.removeFirst()).toBe("C");
            expect(fila.removeFirst()).toBe(null);
        }

        expect(fila.peekFirst()).toBe(null);
        expect(fila.size()).toBe(0);
        expect(fila.capacity()).toBe(5);
    });

    test("Teste Erro adicionar fila cheia", async () => {
        let fila = new Queue<string>(5);

        expect(fila.size()).toBe(0);
        expect(fila.peekFirst()).toBe(null);
        expect(fila.removeFirst()).toBe(null);

        fila.addLast("A");
        fila.addLast("B");
        fila.addLast("C");
        fila.addLast("D");
        fila.addLast("E");

        expect(() => {
            fila.addLast("F");
        }).toThrow();

        expect(fila.size()).toBe(5);
        expect(fila.removeFirst()).toBe("A");

        fila.clear();

        expect(fila.size()).toBe(0);
        expect(fila.removeFirst()).toBe(null);
    });
});
