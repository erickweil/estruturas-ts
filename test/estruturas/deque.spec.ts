import { describe, expect, test } from "vitest";
import { Deque } from "../../src/interfaces/deque.js";
import { testDeque } from "./dequeTest.js";
import { ArrayDeque } from "../../src/estruturas/arrayDeque.js";
import { ArrayBufferDeque } from "../../src/estruturas/arrayBufferDeque.js";

describe("Testes em Deque", () => {
    test("Deque: Testes deque padrão", async () => {
        testDeque(new ArrayDeque<number>());
    });

    test("Deque: Array Buffer", async () => {
        const deque = new ArrayBufferDeque(15, (length) => new Int32Array(length));
        expect(deque.size()).toBe(0);
        expect(deque.isEmpty()).toBe(true);
        expect(deque.getBuffer()).toBeInstanceOf(Int32Array);
        expect(deque.getBuffer().length).toBe(16);

        testDeque(deque);

        expect(deque.getBuffer()).toBeInstanceOf(Int32Array);
        // Deve ter chegado no tamanho de 64, pois o resize dobra o tamanho do array
        expect(deque.getBuffer().length).toBe(64);
    });
});