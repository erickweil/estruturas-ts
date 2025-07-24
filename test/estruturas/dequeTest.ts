import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Deque } from "../../src/interfaces/deque.js";

export function testDeque(deque: Deque<string>) {
    expect(deque.size()).toBe(0);
    expect(deque.isEmpty()).toBe(true);
    expect(deque.removeFirst()).toBe(undefined);
    expect(deque.removeLast()).toBe(undefined);
    expect(deque.peekFirst()).toBe(undefined);
    expect(deque.peekLast()).toBe(undefined);

    deque.addFirst("A");
    deque.addLast("C");
    deque.addFirst("B");
    deque.addLast("D");

    expect(deque.size()).toBe(4);
    expect(deque.isEmpty()).toBe(false);
    expect(deque.peekFirst()).toBe("B");
    expect(deque.peekLast()).toBe("D");

    expect(deque.removeFirst()).toBe("B");
    expect(deque.removeFirst()).toBe("A");
    expect(deque.removeFirst()).toBe("C");
    expect(deque.removeFirst()).toBe("D");

    expect(deque.size()).toBe(0);
    expect(deque.isEmpty()).toBe(true);
    expect(deque.peekFirst()).toBe(undefined);
    expect(deque.peekLast()).toBe(undefined);

    for (let i = 0; i < 10; i++) {
        deque.addFirst(i + "");
        deque.addFirst((i + 1) + "");
        deque.addFirst((i + 2) + "");
        deque.addFirst((i + 3) + "");
        deque.addFirst((i + 4) + "");

        expect(deque.peekFirst()).toBe((i + 4) + "");
    }
}