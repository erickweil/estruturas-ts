import { List } from "../../interfaces/list.js";

// Classe de lista duplamente ligada genérica
export class DoubleLinkedList7<T> implements List<T> {
    private inicio: Node<T> | null = null; // Referência para o primeiro nó da lista
    private fim: Node<T> | null = null;    // Referência para o último nó da lista
    private length: number = 0;            // Tamanho atual da lista

    capacity(): number {
        return Infinity;
    }

    // Insere um novo elemento no início da lista
    addFirst(data: T): void {
        const newNode = new Node(data);
        if (this.inicio === null) { // Lista vazia
            this.inicio = this.fim = newNode;
        } else {
            newNode.prox = this.inicio;
            this.inicio.anterior = newNode;
            this.inicio = newNode;
        }
        this.length++;
    }

    // Insere um novo elemento no final da lista
    addLast(data: T): void {
        const newNode = new Node(data);
        if (this.fim === null) { // Lista vazia
            this.inicio = this.fim = newNode;
        } else {
            newNode.anterior = this.fim;
            this.fim.prox = newNode;
            this.fim = newNode;
        }
        this.length++;
    }

    // Insere um novo elemento em uma posição específica
    add(data: T, index: number): void {
        if (index < 0 || index > this.length) {
            throw new Error("Index fora dos limites");
        }

        if (index === 0) {
            this.addFirst(data);
            return;
        }

        if (index === this.length) {
            this.addLast(data);
            return;
        }

        const newNode = new Node(data);
        let atual = this.inicio;

        // Navega até a posição desejada
        for (let i = 0; i < index; i++) {
            atual = atual!.prox;
        }

        const prevNode = atual!.anterior;
        newNode.prox = atual;
        newNode.anterior = prevNode;

        if (prevNode) prevNode.prox = newNode;
        if (atual) atual.anterior = newNode;

        this.length++;
    }

    // Remove o primeiro elemento da lista
    removeFirst(): T | undefined {
        if (this.inicio === null) return undefined;

        const value = this.inicio.data;
        this.inicio = this.inicio.prox;

        if (this.inicio !== null) {
            this.inicio.anterior = null;
        } else {
            this.fim = null; // Lista ficou vazia
        }

        this.length--;
        return value;
    }

    // Remove o último elemento da lista
    removeLast(): T | undefined {
        if (this.fim === null) return undefined;

        const value = this.fim.data;
        this.fim = this.fim.anterior;

        if (this.fim !== null) {
            this.fim.prox = null;
        } else {
            this.inicio = null; // Lista ficou vazia
        }

        this.length--;
        return value;
    }

    // Remove um elemento em uma posição específica
    remove(index: number): T | undefined {
        if (index < 0 || index >= this.length) {
            return undefined;
        }

        if (index === 0) return this.removeFirst();
        if (index === this.length - 1) return this.removeLast();

        let atual = this.inicio;
        for (let i = 0; i < index; i++) {
            atual = atual!.prox;
        }

        const prevNode = atual!.anterior;
        const nextNode = atual!.prox;

        if (prevNode) prevNode.prox = nextNode;
        if (nextNode) nextNode.anterior = prevNode;

        this.length--;
        return atual!.data;
    }

    // Remove todos os elementos da lista
    clear(): void {
        this.inicio = null;
        this.fim = null;
        this.length = 0;
    }

    // Retorna o valor do primeiro elemento (sem remover)
    peekFirst(): T | undefined {
        return this.inicio ? this.inicio.data : undefined;
    }

    // Retorna o valor do último elemento (sem remover)
    peekLast(): T | undefined {
        return this.fim ? this.fim.data : undefined;
    }

    // Retorna o valor de um elemento em uma posição específica
    get(position: number): T | undefined {
        if (position < 0 || position >= this.length) {
            return undefined;
        }

        let atual: Node<T> | null;

        // Otimização: escolhe o lado mais próximo para começar
        if (position < this.length / 2) {
            atual = this.inicio;
            for (let i = 0; i < position; i++) {
                atual = atual!.prox;
            }
        } else {
            atual = this.fim;
            for (let i = this.length - 1; i > position; i--) {
                atual = atual!.anterior;
            }
        }

        return atual ? atual.data : undefined;
    }

    // Retorna o número de elementos na lista
    size(): number {
        return this.length;
    }

    // Verifica se a lista está vazia
    isEmpty(): boolean {
        return this.length === 0;
    }

    // Exibe todos os elementos da lista, do início ao fim
    printAll(): void {
        let atual = this.inicio;
        let output = "Lista: ";
        while (atual) {
            output += `${atual.data} -> `;
            atual = atual.prox;
        }
        console.log(output + "null");
    }
}

// Classe interna Node usada na lista
class Node<T> {
    public data: T;
    public prox: Node<T> | null = null;      // Referência para o próximo nó
    public anterior: Node<T> | null = null;  // Referência para o nó anterior

    constructor(data: T) {
        this.data = data;
    }
}