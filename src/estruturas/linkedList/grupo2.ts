import { List } from "../../interfaces/list.js";

export class Node<T> {
    public dado: T;
    public proximo: Node<T> | null = null;
    public anterior: Node<T> | null = null;

    constructor(dado: T) {
        this.dado = dado;
    }
}

export class LinkedList2<T> implements List<T> {
    private inicio: Node<T> | null = null;
    private fim: Node<T> | null = null;
    private tamanho: number = 0;

    capacity(): number {
        return Infinity;
    }

    // Insere um elemento no início da lista
    addFirst(dado: T): void {
        const novoNo = new Node(dado);
        if (!this.inicio) {
            this.inicio = this.fim = novoNo;
        } else {
            novoNo.proximo = this.inicio;
            this.inicio.anterior = novoNo;
            this.inicio = novoNo;
        }
        this.tamanho++;
    }

    // Insere um elemento no final da lista
    addLast(dado: T): void {
        const novoNo = new Node(dado);
        if (!this.fim) {
            this.inicio = this.fim = novoNo;
        } else {
            this.fim.proximo = novoNo;
            novoNo.anterior = this.fim;
            this.fim = novoNo;
        }
        this.tamanho++;
    }

    // Insere um elemento em uma posição específica
    add(dado: T, index: number): void {
        if (index < 0 || index > this.tamanho) {
            throw new Error("Índice fora do intervalo válido");
        }

        if (index === 0) {
            this.addFirst(dado);
            return;
        }

        if (index === this.tamanho) {
            this.addLast(dado);
            return;
        }

        const novoNo = new Node(dado);
        let atual = this.inicio;

        for (let i = 0; i < index; i++) {
            atual = atual!.proximo;
        }

        const anterior = atual!.anterior;

        novoNo.anterior = anterior;
        novoNo.proximo = atual;

        if (anterior) anterior.proximo = novoNo;
        if (atual) atual.anterior = novoNo;

        this.tamanho++;
    }

    // Remove o primeiro elemento da lista e o retorna
    removeFirst(): T | undefined {
        if (!this.inicio) return undefined;

        const valor = this.inicio.dado;
        this.inicio = this.inicio.proximo;
        if (this.inicio) {
            this.inicio.anterior = null;
        } else {
            this.fim = null;
        }
        this.tamanho--;
        return valor;
    }

    // Remove o último elemento da lista e o retorna
    removeLast(): T | undefined {
        if (!this.fim) return undefined;
        const valor = this.fim.dado;
        this.fim = this.fim.anterior;
        if (this.fim) {
            this.fim.proximo = null;
        } else {
            this.inicio = null;
        }
        this.tamanho--;
        return valor;
    }

    // Remove o elemento em uma posição específica e o retorna
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

        let atual: Node<T> | null;
        let i: number;

        // Escolhe percorrer do início ou do fim dependendo do índice
        if (index < this.tamanho / 2) {
            atual = this.inicio;
            i = 0;
            while (i < index && atual) {
                atual = atual.proximo;
                i++;
            }
        } else {
            atual = this.fim;
            i = this.tamanho - 1;
            while (i > index && atual) {
                atual = atual.anterior;
                i--;
            }
        }

        const anterior = atual!.anterior;
        const proximo = atual!.proximo;

        if (anterior) {
            anterior.proximo = proximo;
        }
        if (proximo) {
            proximo.anterior = anterior;
        }
        this.tamanho--;

        return atual!.dado;
    }

    // Retorna o elemento em uma posição específica sem removê-lo
    get(position: number): T | undefined {
        if (position < 0 || position >= this.tamanho) {
            return undefined;
        }

        let atual = this.inicio;

        for (let i = 0; i < position; i++) {
            atual = atual!.proximo;
        }

        return atual!.dado;
    }

    // Retorna o número de elementos na lista
    size(): number {
        return this.tamanho;
    }

    // Verifica se a lista está vazia
    isEmpty(): boolean {
        return this.tamanho === 0;
    }

    // Retorna o primeiro elemento sem removê-lo
    peekFirst(): T | undefined {
        if (!this.inicio) return undefined;
        return this.inicio.dado;
    }

    // Retorna o último elemento sem removê-lo
    peekLast(): T | undefined{
        if (!this.fim) return undefined;
        return this.fim.dado;
    }

    // Remove todos os elementos da lista
    clear(): void {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }

    // Imprime todos os elementos da lista no console
    printAll(): void {
        let atual = this.inicio;
        let resultado = "";

        while (atual) {
            resultado += `${atual.dado} `;
            atual = atual.proximo;
        }

        console.log(resultado.trim());
    }
}
