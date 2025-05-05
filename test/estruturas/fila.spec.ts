import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { ArrayQueue } from "../../src/estruturas/arrayQueue.js";
import { Queue } from "../../src/interfaces/queue.js";
import { DualStackQueue } from "../../src/estruturas/dualStackQueue.js";

describe("Testes em Fila", () => {

    function testQueue(fila: Queue<string>) {
        fila.addLast("A");
        expect(fila.peekFirst()).toBe("A");
        expect(fila.size()).toBe(1);

        fila.clear();
        expect(fila.peekFirst()).toBe(null);
        expect(fila.size()).toBe(0);

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
    }

    test("ArrayQueue: Testes padrão", async () => {
        testQueue(new ArrayQueue<string>());
    });

    test("DualStackQueue: Testes padrão", async () => {
        testQueue(new DualStackQueue<string>());
    });

    test("Teste redimensionar fila cheia", async () => {
        let fila = new ArrayQueue<string>(5);

        expect(fila.size()).toBe(0);
        expect(fila.capacity()).toBe(5);
        expect(fila.removeFirst()).toBe(null);

        fila.addLast("A");
        fila.addLast("B");
        fila.addLast("C");
        fila.addLast("D");
        fila.addLast("E");
        fila.addLast("F");

        expect(fila.size()).toBe(6);
        expect(fila.capacity()).toBeGreaterThan(5);
        expect(fila.removeFirst()).toBe("A");

        fila.clear();

        expect(fila.size()).toBe(0);
        expect(fila.removeFirst()).toBe(null);
        expect(fila.capacity()).toBeGreaterThan(5);
    });

    test("Teste redimensionar fila cheia quebrada", async () => {
        let fila = new ArrayQueue<string>(5);

        expect(fila.size()).toBe(0);
        expect(fila.capacity()).toBe(5);

        fila.addLast("A");
        fila.addLast("B");
        fila.addLast("C");
        fila.removeFirst();
        fila.removeFirst();
        fila.removeFirst();

        fila.addLast("D");
        fila.addLast("E");
        fila.addLast("F");
        fila.addLast("G");
        fila.addLast("H");
        fila.addLast("I");

        expect(fila.size()).toBe(6);
        expect(fila.capacity()).toBeGreaterThan(5);
        
        expect(fila.removeFirst()).toBe("D");
        expect(fila.removeFirst()).toBe("E");
        expect(fila.removeFirst()).toBe("F");
        expect(fila.removeFirst()).toBe("G");
        expect(fila.removeFirst()).toBe("H");
        expect(fila.removeFirst()).toBe("I");
        expect(fila.removeFirst()).toBe(null);
    });
});
