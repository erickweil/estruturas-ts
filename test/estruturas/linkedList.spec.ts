import { describe, expect, test } from "vitest";
import { List } from "../../src/interfaces/list.js";
import { testQueue } from "./filaTest.js";
import { testDeque } from "./dequeTest.js";
import { LinkedList } from "../../src/estruturas/linkedList.js";
import { testList } from "./listTest.js";


describe("Teste Linked List", () => {
    test("Teste métodos linked list", () => {
        testList(new LinkedList());
    });

    test("Teste médotodos fila", () => {
        testQueue(new LinkedList());
    });

    test("Teste métodos deque", () => {
        testDeque(new LinkedList());
    });
});