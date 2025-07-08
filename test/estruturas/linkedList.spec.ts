import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { List } from "../../src/interfaces/list.js";
import { DoublyLinkedList6 } from "../../src/estruturas/linkedList/grupo6.js";
import { testQueue } from "./filaTest.js";
import { testDeque } from "./dequeTest.js";
import { DoublyLinkedList1 } from "../../src/estruturas/linkedList/grupo1.js";
import { DoubleLinkedList7 } from "../../src/estruturas/linkedList/grupo7.js";
import { LinkedList2 } from "../../src/estruturas/linkedList/grupo2.js";
import { DoublyLinkedList3 } from "../../src/estruturas/linkedList/grupo3.js";
import { DoublyLinkedList5 } from "../../src/estruturas/linkedList/grupo5.js";
import { DoublyLinkedList4 } from "../../src/estruturas/linkedList/grupo4.js";

function testList(list: List<string>) {

    expect(list.remove(0)).toBe(undefined);
    expect(list.get(0)).toBe(undefined);

    list.add("A", 0);
    expect(list.size()).toBe(1);

    list.clear();
    list.addLast("E");
    list.addLast("F");
    list.add("C", 0);
    list.add("A", 0);
    
    list.add("B", 1);
    list.add("D", 3);

    expect(list.size()).toBe(6);
    expect(list.peekFirst()).toBe("A");
    expect(list.peekLast()).toBe("F");

    expect(list.remove(0)).toBe("A");

    expect(list.size()).toBe(5);
    expect(list.peekFirst()).toBe("B");
    expect(list.peekLast()).toBe("F");

    expect(list.get(0)).toBe("B");
    expect(list.get(1)).toBe("C");
    expect(list.get(2)).toBe("D");
    expect(list.get(3)).toBe("E");
    expect(list.get(4)).toBe("F");

    expect(list.remove(2)).toBe("D");

    expect(list.size()).toBe(4);
    expect(list.get(0)).toBe("B");
    expect(list.get(1)).toBe("C");
    expect(list.get(2)).toBe("E");
    expect(list.get(3)).toBe("F");

    expect(list.remove(3)).toBe("F");
}

describe("Teste Grupo 6", () => {
    test("Teste Grupo 6: LinkeList", () => {
        testList(new DoublyLinkedList6());
    });

    test("Teste Grupo 6: Queue", () => {
        testQueue(new DoublyLinkedList6());
    });

    test("Teste Grupo 6: Deque", () => {
        testDeque(new DoublyLinkedList6());
    });
});

describe("Teste Grupo 1", () => {
    test("Teste Grupo 1: LinkeList", () => {
        testList(new DoublyLinkedList1());
    });

    test("Teste Grupo 1: Queue", () => {
        testQueue(new DoublyLinkedList1());
    });

    test("Teste Grupo 1: Deque", () => {
        testDeque(new DoublyLinkedList1());
    });
});


describe("Teste Grupo 7", () => {
    test("Teste Grupo 7: LinkeList", () => {
        testList(new DoubleLinkedList7());
    });

    test("Teste Grupo 7: Queue", () => {
        testQueue(new DoubleLinkedList7());
    });

    test("Teste Grupo 7: Deque", () => {
        testDeque(new DoubleLinkedList7());
    });
});


describe("Teste Grupo 2", () => {
    test("Teste Grupo 2: LinkeList", () => {
        testList(new LinkedList2());
    });

    test("Teste Grupo 2: Queue", () => {
        testQueue(new LinkedList2());
    });

    test("Teste Grupo 2: Deque", () => {
        testDeque(new LinkedList2());
    });
});


describe("Teste Grupo 3", () => {
    test("Teste Grupo 3: LinkeList", () => {
        testList(new DoublyLinkedList3());
    });

    test("Teste Grupo 3: Queue", () => {
        testQueue(new DoublyLinkedList3());
    });

    test("Teste Grupo 3: Deque", () => {
        testDeque(new DoublyLinkedList3());
    });
});


describe("Teste Grupo 5", () => {
    test("Teste Grupo 5: LinkeList", () => {
        testList(new DoublyLinkedList5());
    });

    test("Teste Grupo 5: Queue", () => {
        testQueue(new DoublyLinkedList5());
    });

    test("Teste Grupo 5: Deque", () => {
        testDeque(new DoublyLinkedList5());
    });
});


describe("Teste Grupo 4", () => {
    test("Teste Grupo 4: LinkeList", () => {
        testList(new DoublyLinkedList4());
    });

    test("Teste Grupo 4: Queue", () => {
        testQueue(new DoublyLinkedList4());
    });

    test("Teste Grupo 4: Deque", () => {
        testDeque(new DoublyLinkedList4());
    });
});