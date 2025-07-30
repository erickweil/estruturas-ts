import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Deque } from "../../src/interfaces/deque.js";

export function testDeque(deque: Deque<number>) {
    expect(deque.size()).toBe(0);
    expect(deque.isEmpty()).toBe(true);
    expect(deque.removeFirst()).toBe(undefined);
    expect(deque.removeLast()).toBe(undefined);
    expect(deque.peekFirst()).toBe(undefined);
    expect(deque.peekLast()).toBe(undefined);

    deque.addFirst(1);
    deque.addLast(3);
    deque.addFirst(2);
    deque.addLast(4);

    expect(deque.size()).toBe(4);
    expect(deque.isEmpty()).toBe(false);
    expect(deque.peekFirst()).toBe(2);
    expect(deque.peekLast()).toBe(4);

    expect(deque.removeFirst()).toBe(2);
    expect(deque.removeFirst()).toBe(1);
    expect(deque.removeFirst()).toBe(3);
    expect(deque.removeFirst()).toBe(4);

    expect(deque.size()).toBe(0);
    expect(deque.isEmpty()).toBe(true);
    expect(deque.peekFirst()).toBe(undefined);
    expect(deque.peekLast()).toBe(undefined);

    for (let i = 0; i < 10; i++) {
        deque.addFirst(i);
        deque.addFirst(i + 1);
        deque.addFirst(i + 2);
        deque.addFirst(i + 3);
        deque.addFirst(i + 4);

        expect(deque.peekFirst()).toBe(i + 4);
    }
}