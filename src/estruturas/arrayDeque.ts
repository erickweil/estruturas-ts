import { Deque } from "../interfaces/deque.js";
import { Stack } from "../interfaces/stack.js";
import { ArrayQueue } from "./arrayQueue.js";

export class ArrayDeque<T> extends ArrayQueue<T> implements Deque<T>, Stack<T> {
    constructor(capacidade?: number) {
        super(capacidade);
    }

    protected decrementar(cont: number) {
        return (cont - 1 + this.arr.length) % this.arr.length;
    }

    addFirst(valor: T): void {
        if (this.size() >= this.capacity()) {
            this.resize();
        }

        this.inicio = this.decrementar(this.inicio);
        this.arr[this.inicio] = valor;
    }

    removeLast(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        this.fim = this.decrementar(this.fim);
        const temp = this.arr[this.fim];
        this.arr[this.fim] = undefined;
        
        return temp;
    }
    
    peekLast(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        } else {
            return this.arr[this.decrementar(this.fim)];
        }
    }

    // Stack

    push(value: T): void {
        this.addLast(value);   
    }

    pop(): T | undefined {
        return this.removeLast();
    }
}