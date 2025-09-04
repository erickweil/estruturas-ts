import { describe, expect, test } from "vitest";
import { Deque } from "../../src/interfaces/deque.js";
import { testDeque } from "./dequeTest.js";
import { ArrayDeque } from "../../src/estruturas/arrayDeque.js";

describe("Testes em Deque", () => {
    test("Deque: Testes deque padrão", async () => {
        testDeque(new ArrayDeque<number>());
    });
});