import { Queue } from "../interfaces/queue.js";

export class ArrayQueue<T> implements Queue<T> {
    private inicio: number;
    private fim: number;
    private arr: (T | null)[];

    constructor(capacidade: number = 15) {
        this.inicio = 0;
        this.fim = 0;
        // Inicializa com null para evitar array com buracos
        this.arr = new Array(capacidade+1).fill(null);
    }

    private resize() {
        // Redimensiona o array para o dobro do tamanho
        // Adiciona null até o novo tamanho (Aproveitando o array que já existe)

        let oldlength = this.arr.length;
        let newLength = this.arr.length * 2;
        for(let i = oldlength; i < newLength; i++) {
            this.arr.push(null);
        }

        if(this.fim < this.inicio) {
            // Se o fim estiver antes do início, significa que a fila está "quebrada"
            // Tem que juntar denovo [2345...1] -> [.......12345...]
            for(let i = 0; i < this.fim; i++) {
                this.arr[oldlength + i] = this.arr[i];
                this.arr[i] = null;
            }
            this.fim = oldlength + this.fim;
        }
    }

    private incrementar(cont: number) {
        return (cont + 1) % this.arr.length;
    }

    addLast(valor: T) {
        if (this.size() >= this.capacity()) {
            // Se a fila estiver cheia, redimensiona
            this.resize();
        }

        this.arr[this.fim] = valor;
        this.fim = this.incrementar(this.fim);
    }

    removeFirst(): T | null {
        if (this.isEmpty()) {
            return null;
        }

        const temp = this.arr[this.inicio];
        this.arr[this.inicio] = null;
        this.inicio = this.incrementar(this.inicio);

        return temp;
    }

    peekFirst(): T | null {
        if (this.isEmpty()) {
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

    isEmpty(): boolean {
        return this.inicio === this.fim;
    }

    size(): number {
        return (this.arr.length - this.inicio + this.fim) % this.arr.length;
    }

    capacity(): number {
        return this.arr.length - 1;
    }
}