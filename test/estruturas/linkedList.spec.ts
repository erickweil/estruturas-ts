import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { List } from "../../src/interfaces/list.js";
import { testQueue } from "./filaTest.js";
import { testDeque } from "./dequeTest.js";
import { LinkedList } from "../../src/estruturas/linkedList.js";

function expectList(list: List<string>, values: string[]) {
    expect(list.size()).toBe(values.length);
    expect(list.isEmpty()).toBe(values.length === 0);

    expect(list.peekFirst()).toBe(values[0]);
    expect(list.peekLast()).toBe(values[values.length - 1]);

    for (let i = 0; i < values.length; i++) {
        expect(list.get(i)).toBe(values[i]);
    }
    expect(list.get(100000)).toBe(undefined);
    expect(list.get(values.length)).toBe(undefined);
    expect(list.get(-1)).toBe(undefined);
}

function testList(list: List<string>) {
    expect(list.remove(0)).toBe(undefined);
    expect(list.get(0)).toBe(undefined);

    list.add("A", 0);
    expect(list.size()).toBe(1);

    list.clear();
    list.addLast("B");
    list.addLast("C");
    list.addLast("D");
    list.addLast("E");
    list.addLast("F");

    expectList(list, ["B", "C", "D", "E", "F"]);

    // Add
    list.addFirst("A");
    expectList(list, ["A", "B", "C", "D", "E", "F"]);

    list.addLast("H");
    expectList(list, ["A", "B", "C", "D", "E", "F", "H"]);

    list.add("G", 6);
    expectList(list, ["A", "B", "C", "D", "E", "F", "G", "H"]);

    list.add("Z", 0);
    expectList(list, ["Z", "A", "B", "C", "D", "E", "F", "G", "H"]);

    list.add("I", 9);
    expectList(list, ["Z", "A", "B", "C", "D", "E", "F", "G", "H", "I"]);
    
    // Remove
    expect(list.removeFirst()).toBe("Z");
    expectList(list, ["A", "B", "C", "D", "E", "F", "G", "H", "I"]);

    expect(list.removeLast()).toBe("I");
    expectList(list, ["A", "B", "C", "D", "E", "F", "G", "H"]);

    expect(list.remove(0)).toBe("A");
    expectList(list, ["B", "C", "D", "E", "F", "G", "H"]);

    expect(list.remove(3)).toBe("E");
    expectList(list, ["B", "C", "D", "F", "G", "H"]);

    expect(list.remove(5)).toBe("H");
    expectList(list, ["B", "C", "D", "F", "G"]);

    expect(list.remove(5)).toBe(undefined);
    expectList(list, ["B", "C", "D", "F", "G"]);

    while (!list.isEmpty()) {
        expect(list.removeLast()).toBeTruthy();
    }

    expectList(list, []);
    expect(list.removeFirst()).toBe(undefined);
    expect(list.removeLast()).toBe(undefined);
    expect(list.get(0)).toBe(undefined);

    // Teste add throws
    expect(() => list.add("X", -1)).toThrowError();
    expect(() => list.add("X", 100)).toThrowError();
}

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