import { Stack } from "../interfaces/stack.js";

// Nó imutável
class Elem<T> {
    readonly valor: T;
    readonly proximo: Elem<T> | null

    constructor(valor: T, proximo: Elem<T> | null) {
        this.valor = valor;
        this.proximo = proximo;
    }
}

/**
 * Pilha encadeada imutável
 * > Obs: Se você armazenar objetos na pilha e modificar esses objetos, as pilhas clonadas que compartilham os mesmos nós verão as mudanças
 *  
 * Cada push() cria novos nós cujos valores não podem ser alterados.
 * Cada pop() retorna o valor do nó do topo e avança o início para o próximo nó
 * 
 * A operação clone() cria uma nova pilha que compartilha os mesmos nós da pilha original O(1)
 * A imutabilidade se refere ao fato que cada pilha pode crescer ou diminuir sem afetar as outras pilhas que compartilham os mesmos nós.
 */
export class LinkedStack<T> implements Stack<T> {
    private inicio: Elem<T> | null;
    private tamanho: number;
    constructor() {
        this.inicio = null;
        this.tamanho = 0;
    }

    push(value: T): void {
        this.inicio = new Elem(value, this.inicio);
        this.tamanho++;
    }

    pop(): T | undefined {
        const inicio = this.inicio;
        if(!inicio) {
            return undefined;
        }
        this.inicio = inicio.proximo;
        this.tamanho--;
        return inicio.valor;
    }

    peekLast(): T | undefined {
        return this.inicio ? this.inicio.valor : undefined;
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
        const ret = new LinkedStack<T>();
        ret.inicio = this.inicio;
        ret.tamanho = this.tamanho;

        return ret;
    }

    /** 
     * Implementação do protocolo iterável para permitir for...of 
     * 
     * O iterador percorre os nós da pilha do topo para a base, retornando os valores dos nós
     * Se você modificar a pilha durante a iteração, a iteração não é afetada, ela continuará a iterar sobre os nós que existiam no momento em que o iterador foi criado, mesmo que a pilha seja modificada posteriormente.
     */
    public [Symbol.iterator](): IterableIterator<T> {
        return new LinkedStackIterator(this.inicio);
    }
}

class LinkedStackIterator<T> implements IterableIterator<T> {
    private atual: Elem<T> | null;
    constructor(inicio: Elem<T> | null) {
        this.atual = inicio;
    }

    next(): IteratorResult<T> {
        if (this.atual) {
            const valor = this.atual.valor;
            this.atual = this.atual.proximo;
            return { 
                value: valor, 
                done: false 
            };
        } else {
            return { 
                value: undefined, 
                done: true 
            };
        }
    }

    [Symbol.iterator](): IterableIterator<T> {
        return this;
    }
}