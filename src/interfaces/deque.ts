import { Queue } from "./queue.js";
import { Stack } from "./stack.js";

export interface Deque<T> {
    addFirst(value: T): void;
    addLast(value: T): void;
    removeFirst(): T | undefined;
    removeLast(): T | undefined;
    peekFirst(): T | undefined;
    peekLast(): T | undefined;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    capacity(): number;
}

// APENAS PARA TESTES - Depois será feita a implementação real com performance O(1)
export class DequeTest<T> implements Deque<T>, Queue<T>, Stack<T> {
    private arr: T[] = [];
    constructor() {
        this.arr = [];
    }

    addFirst(value: T): void {
        this.arr.unshift(value);
    }
    addLast(value: T): void {
        this.arr.push(value);
    }
    push(value: T) {
        this.addLast(value);
    }

    removeFirst(): T | undefined {
        return this.arr.shift();
    }
    removeLast(): T | undefined {
        return this.arr.pop();
    }
    pop(): T | undefined {
        return this.removeLast();
    }

    peekFirst(): T | undefined {
        return this.arr[0];
    }
    peekLast(): T | undefined {
        return this.arr[this.arr.length - 1];
    }

    isEmpty(): boolean {
        return this.arr.length === 0;
    }
    clear(): void {
        this.arr = [];
    }
    size(): number {
        return this.arr.length;
    }
    capacity(): number {
        return Infinity;
    }
}