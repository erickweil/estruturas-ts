import { describe, expect, test } from "vitest";
import { Queue } from "../../src/interfaces/queue.js";

export function testQueue(fila: Queue<string>) {
    fila.addLast("A");
    expect(fila.peekFirst()).toBe("A");
    expect(fila.size()).toBe(1);
    expect(fila.isEmpty()).toBe(false);

    fila.clear();
    expect(fila.peekFirst()).toBe(undefined);
    expect(fila.size()).toBe(0);
    expect(fila.isEmpty()).toBe(true);
    expect(fila.capacity()).toBeGreaterThan(0);

    for(let i = 5; i >= 0; i--) {
        expect(fila.size()).toBe(0);
        expect(fila.isEmpty()).toBe(true);
        fila.addLast("A");
        fila.addLast("B");
        fila.addLast("C");

        expect(fila.size()).toBe(3);
        expect(fila.isEmpty()).toBe(false);
        expect(fila.peekFirst()).toBe("A");
        expect(fila.removeFirst()).toBe("A");
        expect(fila.peekFirst()).toBe("B");
        expect(fila.removeFirst()).toBe("B");
        expect(fila.peekFirst()).toBe("C");
        expect(fila.removeFirst()).toBe("C");
        expect(fila.peekFirst()).toBe(undefined);
        expect(fila.removeFirst()).toBe(undefined);
    }

    expect(fila.peekFirst()).toBe(undefined);
    expect(fila.size()).toBe(0);
    expect(fila.isEmpty()).toBe(true);
}