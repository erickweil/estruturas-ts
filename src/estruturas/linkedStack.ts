import { Stack } from "../interfaces/stack.js";

export class Elem<T> {
    public valor: T;
    public proximo: Elem<T> | null

    constructor(valor: T, proximo: Elem<T> | null) {
        this.valor = valor;
        this.proximo = proximo;
    }
}

export class LinkedStack<T> implements Stack<T> {
    public inicio: Elem<T> | null;
    public tamanho: number;
    constructor() {
        this.inicio = null;
        this.tamanho = 0;
    }

    push(value: T): void {
        this.inicio = new Elem(value, this.inicio);
        this.tamanho++;
    }

    pop(): T | undefined {
        if(!this.inicio) {
            return undefined;
        }
        let valor = this.inicio.valor;
        this.inicio = this.inicio.proximo;
        this.tamanho--;
        return valor;
    }

    isEmpty(): boolean {
        return !this.inicio;
    }

    clear(): void {
        this.inicio = null;
        this.tamanho = 0;
    }

    size(): number {
        return this.tamanho;
    }

    capacity(): number {
        return Infinity;
    }

    clone(): LinkedStack<T> {
        let ret = new LinkedStack<T>();
        ret.inicio = this.inicio;

        return ret;
    }
}