import { Queue } from "../interfaces/queue.js";

const DEFAULT_CAPACITY = 15;

export class ArrayQueue<T> implements Queue<T> {
    protected inicio: number;
    protected fim: number;
    protected arr: (T | undefined)[];

    constructor(capacidade: number = DEFAULT_CAPACITY) {
        this.inicio = 0;
        this.fim = 0;
        // Inicializa com undefined para evitar array com buracos
        this.arr = new Array(capacidade+1).fill(undefined);
    }

    protected incrementar(cont: number) {
        return (cont + 1) % this.arr.length;
    }

    resize() {
        // Redimensiona o array para o dobro do tamanho
        // Adiciona undefined até o novo tamanho (Aproveitando o array que já existe)

        let oldlength = this.arr.length;
        let newLength = this.arr.length * 2;
        for(let i = oldlength; i < newLength; i++) {
            this.arr.push(undefined);
        }

        if(this.fim < this.inicio) {
            // Se o fim estiver antes do início, significa que a fila está "quebrada"
            // Tem que juntar denovo [2345...1] -> [.......12345...]
            for(let i = 0; i < this.fim; i++) {
                this.arr[oldlength + i] = this.arr[i];
                this.arr[i] = undefined;
            }
            this.fim = oldlength + this.fim;
        }
    }

    addLast(valor: T) {
        if (this.size() >= this.capacity()) {
            // Se a fila estiver cheia, redimensiona
            this.resize();
        }

        this.arr[this.fim] = valor;
        this.fim = this.incrementar(this.fim);
    }

    removeFirst(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const temp = this.arr[this.inicio];
        this.arr[this.inicio] = undefined;
        this.inicio = this.incrementar(this.inicio);

        return temp;
    }

    peekFirst(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        } else {
            return this.arr[this.inicio];
        }
    }

    clear() {
        /*while(this.inicio !== this.fim) {
            this.arr[this.inicio] = undefined;
            this.inicio = this.incrementar(this.inicio);
        }*/
        this.inicio = 0;
        this.fim = 0;

        this.arr = new Array(DEFAULT_CAPACITY+1).fill(undefined);
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

    // Implementação do protocolo iterável para permitir for...of
    public *[Symbol.iterator](): Iterator<T> {
        let index = this.inicio;
        while(index !== this.fim) {
            yield this.arr[index]!;
            index = this.incrementar(index);
        }
    }
}