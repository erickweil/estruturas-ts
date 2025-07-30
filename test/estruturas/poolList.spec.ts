import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { testQueue } from "./filaTest.js";
import { testDeque } from "./dequeTest.js";
import { PoolList } from "../../src/estruturas/poolList.js";
import { testStack } from "./stackTest.js";
import { testList } from "./listTest.js";
import { StructType } from "../../src/utils/structSchema.js";

function createStrPoolList(capacity: number) {
    return new PoolList(capacity, 
        StructType.string(10),
        (schema, index) => { return schema.get(index); },
        (schema, index, value) => { schema.set(index, value); }
    )
}

describe("Testes Pool List", () => {
    test("Teste métodos pilha", () => {
        testStack(createStrPoolList(100));
    });
    
    test("Teste médotodos fila", () => {
        testQueue(createStrPoolList(100));
    });

    test("Teste métodos deque", () => {
        testDeque(PoolList.createNumberList(100));
    });

    test("Teste métodos linked list", () => {
        testList(createStrPoolList(100));
    });
});