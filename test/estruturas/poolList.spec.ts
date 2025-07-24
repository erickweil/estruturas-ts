import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { testQueue } from "./filaTest.js";
import { testDeque } from "./dequeTest.js";
import { PoolList } from "../../src/estruturas/poolList.js";
import { testStack } from "./stackTest.js";

describe("Testes Pool List", () => {
    test("Teste médotodos fila", () => {
        testQueue(new PoolList());
    });

    test("Teste métodos deque", () => {
        testDeque(new PoolList());
    });

    test("Teste métodos pilha", () => {
        testStack(new PoolList());
    });
});