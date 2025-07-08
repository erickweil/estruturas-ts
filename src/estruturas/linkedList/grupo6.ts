import { List } from "../../interfaces/list.js";

/**
 * Classe que representa um nó da lista duplamente ligada
 * @template T - Tipo dos dados armazenados no nó
 */
export class No<T> {
    public valor: T;
    public proximo: No<T> | null;
    public anterior: No<T> | null;

    constructor(valor: T) {
        this.valor = valor;
        this.proximo = null;
        this.anterior = null;
    }
}

/**
 * Implementação de Lista Duplamente Ligada
 * Cada nó possui referências para o próximo e anterior nó
 * @template T - Tipo dos dados armazenados na lista
 */
export class DoublyLinkedList6<T> implements List<T> {
    public inicio: No<T> | null;
    public fim: No<T> | null;
    public tamanho: number;

    constructor() {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }

    /**
     * Insere um valor no início da lista - O(1)
     * @param data - Valor a ser inserido
     */
    addFirst(data: T): void {
        const novoNo = new No(data);
        
        if (this.inicio === null) {
            this.inicio = novoNo;
            this.fim = novoNo;
        } else {
            novoNo.proximo = this.inicio;
            this.inicio.anterior = novoNo;
            this.inicio = novoNo;
        }
        
        this.tamanho++;
    }

    /**
     * Insere um valor no fim da lista - O(1)
     * @param data - Valor a ser inserido
     */
    addLast(data: T): void {
        const novoNo = new No(data);
        
        if (this.fim === null) {
            this.inicio = novoNo;
            this.fim = novoNo;
        } else {
            novoNo.anterior = this.fim;
            this.fim.proximo = novoNo;
            this.fim = novoNo;
        }
        
        this.tamanho++;
    }

    /**
     * Insere um valor na posição especificada - O(n)
     * @param data - Valor a ser inserido
     * @param index - Posição onde inserir o valor
     */
    add(data: T, index: number): void {
        if (index < 0 || index > this.tamanho) {
            throw new Error("Índice fora dos limites");
        }
        
        if (index === 0) {
            this.addFirst(data);
            return;
        }
        
        if (index === this.tamanho) {
            this.addLast(data);
            return;
        }
        
        const novoNo = new No(data);
        let atual = this.inicio;
        
        for (let i = 0; i < index; i++) {
            atual = atual!.proximo;
        }
        
        novoNo.proximo = atual;
        novoNo.anterior = atual!.anterior;
        atual!.anterior!.proximo = novoNo;
        atual!.anterior = novoNo;
        
        this.tamanho++;
    }

    /**
     * Remove um nó do início da lista e retorna seu valor - O(1)
     * @returns O valor do nó removido
     * @throws Error se a lista estiver vazia
     */
    removeFirst(): T | undefined {
        if (this.inicio === null) {
            return undefined;
        }
        
        const valor = this.inicio.valor;
        
        if (this.inicio === this.fim) {
            this.inicio = null;
            this.fim = null;
        } else {
            this.inicio = this.inicio.proximo;
            this.inicio!.anterior = null;
        }
        
        this.tamanho--;
        return valor;
    }

    /**
     * Remove um nó do fim da lista e retorna seu valor - O(1)
     * @returns O valor do nó removido
     * @throws Error se a lista estiver vazia
     */
    removeLast(): T | undefined {
        if (this.fim === null) {
            return undefined;
        }
        
        const valor = this.fim.valor;
        
        if (this.inicio === this.fim) {
            this.inicio = null;
            this.fim = null;
        } else {
            this.fim = this.fim.anterior;
            this.fim!.proximo = null;
        }
        
        this.tamanho--;
        return valor;
    }

    /**
     * Remove um nó da posição especificada da lista e retorna seu valor - O(n)
     * @param index - Índice do nó a ser removido
     * @returns O valor do nó removido
     * @throws Error se o índice estiver fora dos limites
     */
    remove(index: number): T | undefined {
        if (index < 0 || index >= this.tamanho) {
            return undefined;
        }
        
        if (index === 0) {
            return this.removeFirst();
        }
        
        if (index === this.tamanho - 1) {
            return this.removeLast();
        }
        
        let atual = this.inicio;
        for (let i = 0; i < index; i++) {
            atual = atual!.proximo;
        }
        
        const valor = atual!.valor;
        atual!.anterior!.proximo = atual!.proximo;
        atual!.proximo!.anterior = atual!.anterior;
        
        this.tamanho--;
        return valor;
    }

    /**
     * Obtém um valor no início da lista - O(1)
     * @returns O valor do primeiro nó
     * @throws Error se a lista estiver vazia
     */
    peekFirst(): T | undefined {
        if (this.inicio === null) {
            return undefined;
        }
        return this.inicio.valor;
    }

    /**
     * Obtém um valor no fim da lista - O(1)
     * @returns O valor do último nó
     * @throws Error se a lista estiver vazia
     */
    peekLast(): T | undefined {
        if (this.fim === null) {
            return undefined;
        }
        return this.fim.valor;
    }

    /**
     * Retorna o valor do nó na posição especificada - O(n)
     * @param position - Posição do nó desejado
     * @returns O valor do nó na posição especificada
     * @throws Error se a posição estiver fora dos limites
     */
    get(position: number): T | undefined {
        if (position < 0 || position >= this.tamanho) {
            return undefined;
        }
        
        let atual = this.inicio;
        for (let i = 0; i < position; i++) {
            atual = atual!.proximo;
        }
        
        return atual!.valor;
    }

    /**
     * Retorna o tamanho da lista - O(1)
     * @returns O número de elementos na lista
     */
    size(): number {
        return this.tamanho;
    }

    /**
     * Verifica se a lista está vazia - O(1)
     * @returns true se a lista estiver vazia, false caso contrário
     */
    isEmpty(): boolean {
        return this.tamanho === 0;
    }

    /**
     * Limpa todos os nós da lista - O(1)
     */
    clear(): void {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }

    /**
     * Exibe todos os elementos da lista para debug - O(n)
     */
    printAll(): void {
        if (this.isEmpty()) {
            console.log("Lista vazia");
            return;
        }
        
        const elementos: T[] = [];
        let atual = this.inicio;
        
        while (atual !== null) {
            elementos.push(atual.valor);
            atual = atual.proximo;
        }
        
        console.log(`Lista, (${this.tamanho} elementos): [${elementos.join(", ")}]`);
    }

    capacity(): number {
        return Infinity;
    }
}
