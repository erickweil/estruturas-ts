import { List } from "../interfaces/list.js";

class No<T> {
    valor: T;
    proximo: No<T> | null;
    anterior: No<T> | null;

    constructor(valor: T) {
        this.valor = valor;
        this.proximo = null;
        this.anterior = null;
    }
}

export class LinkedList<T> implements List<T> {
    protected inicio: No<T> | null;
    protected fim: No<T> | null;
    protected tamanho: number;

    constructor() {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }

    private _get(index: number): No<T> | null {
        if (index < 0 || index >= this.tamanho) {
            return null;
        }

        let atual: No<T>;

        // Otimização: começar do início ou fim dependendo da posição
        let i: number;
        if (index <= this.tamanho / 2) {
            atual = this.inicio!;
            for (i = 0; i < index; i++) {
                atual = atual.proximo!;
            }
        } else {
            atual = this.fim!;
            for (i = this.tamanho - 1; i > index; i--) {
                atual = atual.anterior!;
            }
        }

        return atual;
    }

    addFirst(value: T): void {
        const novo = new No(value);
        if(!this.inicio) {
            this.fim = this.inicio = novo;
        } else {
            novo.proximo = this.inicio;
            this.inicio.anterior = novo;
            this.inicio = novo;
        }
        this.tamanho++;
    }
    addLast(value: T): void {
        const novo = new No(value);
        if(!this.fim) {
            this.fim = this.inicio = novo;
        } else {
            novo.anterior = this.fim;
            this.fim.proximo = novo;
            this.fim = novo;
        }
        this.tamanho++;
    }
    add(data: T, index: number): void {
        if(index === 0) return this.addFirst(data);
        if(index === this.tamanho) return this.addLast(data);
        
        const antigo = this._get(index);
        if(!antigo) throw new Error("Índice fora do intervalo da lista");
        const anterior = antigo?.anterior!; // É garantido que anterior existe
        
        const novo = new No(data);
        novo.anterior = anterior;
        novo.proximo = antigo;

        anterior.proximo = novo;
        antigo.anterior = novo;

        this.tamanho++;
    }

    removeFirst(): T | undefined {
        if(!this.inicio) return undefined;

        const valor = this.inicio.valor;
        if(!this.inicio.proximo) { // Se for o único nó
            this.clear();
        } else {
            this.inicio = this.inicio.proximo;
            this.inicio.anterior = null;
            this.tamanho--;
        }
        return valor;
    }
    removeLast(): T | undefined {
        if(!this.fim) return undefined;

        const valor = this.fim.valor;
        if(!this.fim.anterior) { // Se for o único nó
            this.clear();
        } else {
            this.fim = this.fim.anterior;
            this.fim.proximo = null;
            this.tamanho--;
        }
        return valor;
    }
    remove(index: number): T | undefined {
        if(index === 0) return this.removeFirst();
        if(index === this.tamanho - 1) return this.removeLast();

        const no = this._get(index);
        if(!no) return undefined;

        // Garantido que no.anterior e no.proximo existem
        no.anterior!.proximo = no.proximo;
        no.proximo!.anterior = no.anterior;
        this.tamanho--;

        return no.valor;
    }

    peekFirst(): T | undefined {
        return this.inicio?.valor;
    }
    peekLast(): T | undefined {
        return this.fim?.valor;
    }
    get(index: number): T | undefined {
        const no = this._get(index);
        return no?.valor;
    }

    isEmpty(): boolean {
        return this.tamanho === 0;
    }
    clear(): void {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }
    size(): number {
        return this.tamanho;
    }
    capacity(): number {
        return Infinity;
    }

    // Implementação do protocolo iterável para permitir for...of
    public *[Symbol.iterator](): Iterator<T> {
        let atual = this.inicio;
        while (atual) {
            yield atual.valor;
            atual = atual.proximo;
        }
    }
}