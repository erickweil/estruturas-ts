import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Deque, DequeTest } from "../../src/interfaces/deque.js";
import { testDeque } from "./dequeTest.js";

describe("Testes em Deque", () => {
    test("Deque: Testes deque padrão", async () => {
        testDeque(new DequeTest<string>());
    });
});