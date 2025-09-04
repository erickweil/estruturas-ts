import { describe, expect, test } from "vitest";
import { ArrayQueue } from "../../src/estruturas/arrayQueue.js";
import { Queue } from "../../src/interfaces/queue.js";
import { DualStackQueue } from "../../src/estruturas/dualStackQueue.js";
import { testQueue } from "./filaTest.js";
import { ArrayDeque } from "../../src/estruturas/arrayDeque.js";

describe("Testes em Fila", () => {
    test("ArrayQueue: Testes Fila padrão", async () => {
        testQueue(new ArrayQueue<string>());
    });

    test("DualStackQueue: Testes Fila padrão", async () => {
        testQueue(new DualStackQueue<string>());
    });

    test("DequeTest: Testes Fila padrão", async () => {
        testQueue(new ArrayDeque<string>());
    });

    test("Teste redimensionar fila cheia", async () => {
        let fila = new ArrayQueue<string>(5);

        expect(fila.size()).toBe(0);
        expect(fila.capacity()).toBe(5);
        expect(fila.removeFirst()).toBe(undefined);

        fila.addLast("A");
        fila.addLast("B");
        fila.addLast("C");
        fila.addLast("D");
        fila.addLast("E");
        fila.addLast("F");

        expect(fila.size()).toBe(6);
        expect(fila.capacity()).toBeGreaterThan(6);
        expect(fila.removeFirst()).toBe("A");

        fila.clear();

        expect(fila.size()).toBe(0);
        expect(fila.removeFirst()).toBe(undefined);
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
        expect(fila.removeFirst()).toBe(undefined);
    });
});
