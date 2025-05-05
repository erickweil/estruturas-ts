import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Queue } from "../../src/interfaces/queue.js";
import { Deque, DequeTest } from "../../src/interfaces/deque.js";

describe("Testes em Deque", () => {
    function testDeque(deque: Deque<string>) {
        expect(deque.size()).toBe(0);
    }

    test("Deque: Testes deque padrão", async () => {
        testDeque(new DequeTest<string>());
    });
});