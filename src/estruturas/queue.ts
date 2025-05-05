export class Queue<T> {
    private inicio: number;
    private fim: number;
    private arr: (T | null)[];

    constructor(capacidade: number) {
        this.inicio = 0;
        this.fim = 0;
        // Inicializa com null para evitar array com buracos
        this.arr = new Array(capacidade+1).fill(null);
    }

    private incrementar(cont: number) {
        return (cont + 1) % this.arr.length;
    }

    addLast(valor: T) {
        let fimInc = this.incrementar(this.fim);
        if (this.inicio === fimInc) {
            throw new Error("Queue is full");
        }

        this.arr[this.fim] = valor;
        this.fim = fimInc;
    }

    removeFirst(): T | null {
        if (this.inicio === this.fim) {
            return null;
        }

        const temp = this.arr[this.inicio];
        this.arr[this.inicio] = null;
        this.inicio = this.incrementar(this.inicio);

        return temp;
    }

    peekFirst(): T | null {
        if (this.size() === 0) {
            return null;
        } else {
            return this.arr[this.inicio];
        }
    }

    clear() {
        while(this.inicio !== this.fim) {
            this.arr[this.inicio] = null;
            this.inicio = this.incrementar(this.inicio);
        }
        this.inicio = 0;
        this.fim = 0;
    }

    size(): number {
        return (this.arr.length - this.inicio + this.fim) % this.arr.length;
    }

    capacity(): number {
        return this.arr.length - 1;
    }
}