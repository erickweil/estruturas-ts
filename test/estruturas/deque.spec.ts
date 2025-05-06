import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Deque, DequeTest } from "../../src/interfaces/deque.js";

describe("Testes em Deque", () => {
    function testDeque(deque: Deque<string>) {
        expect(deque.size()).toBe(0);
        expect(deque.isEmpty()).toBe(true);
        expect(deque.removeFirst()).toBe(undefined);
        expect(deque.removeLast()).toBe(undefined);
        expect(deque.peekFirst()).toBe(undefined);
        expect(deque.peekLast()).toBe(undefined);

        deque.addFirst("A");
        deque.addFirst("B");
        deque.addLast("C");
        deque.addLast("D");

        expect(deque.removeFirst()).toBe("B");
        expect(deque.removeFirst()).toBe("A");
        expect(deque.removeFirst()).toBe("C");
        expect(deque.removeFirst()).toBe("D");

        
    }

    test("Deque: Testes deque padrão", async () => {
        testDeque(new DequeTest<string>());
    });
});