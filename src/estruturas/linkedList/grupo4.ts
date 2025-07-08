import { List } from "../../interfaces/list.js";

export class Val<T> {
    public value: T;
    public next: Val<T> | null;
    public previous: Val<T> | null;

    constructor(valor: T) {
        this.value = valor;
        this.next = null;
        this.previous = null;
    }
}

export class DoublyLinkedList4<T> implements List<T> {
    public first: Val<T> | null;
    public last: Val<T> | null;
    public length: number;

    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
    }

    capacity(): number {
        return Infinity;
    }

    addFirst(data: T): void {
        if (this.first === null) {
            this.first = new Val(data);
            this.last = this.first;
            this.length++;
        } else {
            const newVal = new Val(data);
            newVal.next = this.first;
            this.first.previous = newVal;
            this.first = newVal;
            this.length++;
        }
    }

    addLast(data: T): void {
        if (this.last === null) {
            this.last = new Val(data);
            this.first = this.last;
            this.length++;
        } else {
            const newVal = new Val(data);
            newVal.previous = this.last;
            this.last.next = newVal;
            this.last = newVal;
            this.length++;
        }
    }

    add(data: T, index: number): void {
        if (index < 0 || index > this.length) {
            throw new Error("Index fora dos limites");
        }
        if (index === 0) {
            this.addFirst(data);
        } else if (index === this.length) {
            this.addLast(data);
        } else {
            const newVal = new Val(data);
            let current = this.first;

            for (let i = 0; i < index; i++) {
                current = current!.next;
            }

            newVal.next = current;
            newVal.previous = current!.previous;
            current!.previous!.next = newVal;
            current!.previous = newVal;
            this.length++;
        }
    }

    /*-----------------------------------------------------------*/

    removeFirst(): T | undefined {
        if (this.first === null) {
            return undefined;
        }

        const removedValue = this.first.value;

        if (this.length === 1) {
            this.first = null;
            this.last = null;
        } else {
            this.first = this.first.next;
            this.first!.previous = null;
        }

        this.length--;
        return removedValue;
    }

    removeLast(): T | undefined {
        if (this.last === null) {
            return undefined;
        }

        const removedValue = this.last.value;

        if (this.length === 1) {
            this.first = null;
            this.last = null;
        } else {
            this.last = this.last.previous;
            this.last!.next = null;
        }

        this.length--;
        return removedValue;
    }

    remove(index: number): T | undefined {
        if (index < 0 || index >= this.length) {
            return undefined;
        }
        if (index === 0) {
            return this.removeFirst();
        } else if (index === this.length - 1) {
            return this.removeLast();
        } else {
            let current = this.first;

            for (let i = 0; i < index; i++) {
                current = current!.next;
            }

            const removedValue = current!.value;
            current!.previous!.next = current!.next;
            current!.next!.previous = current!.previous;
            this.length--;

            return removedValue;
        }
    }

    /*-----------------------------------------------------------*/

    peekFirst(): T | undefined {
        if (this.first === null) {
            return undefined;
        }
        return this.first.value;
    }

    peekLast(): T | undefined {
        if (this.last === null) {
            return undefined;
        }
        return this.last.value;
    }

    get(index: number): T | undefined {
        if (index < 0 || index >= this.length) {
            return undefined;
        }

        let current = this.first;

        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current!.value;
    }

    /*-----------------------------------------------------------*/

    size(): number {
        return this.length;
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    clear(): void {
        this.first = null;
        this.last = null;
        this.length = 0;
    }

    printAll(): void {
        let current = this.first;
        let output = '';
        
        while (current !== null) {
            output += current.value;
            if (current.next !== null) {
                output += ' -> ';
            }
            current = current.next;
        }
        
        console.log(output);
    }
}
