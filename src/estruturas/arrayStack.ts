import { Stack } from "../interfaces/stack.js";

export class ArrayStack<T> implements Stack<T> {
    private arr: T[];

    constructor() {
        this.arr = [];    
    }

    push(value: T): void {
        this.arr.push(value);
    }
    pop(): T | undefined {
        return this.arr.pop();
    }
    isEmpty(): boolean {
        return this.arr.length <= 0;
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

    // Implementação do protocolo iterável para permitir for...of
    public *[Symbol.iterator](): Iterator<T> {
        for(let i = this.arr.length - 1; i >= 0; i--) {
            yield this.arr[i];
        }
    }
}