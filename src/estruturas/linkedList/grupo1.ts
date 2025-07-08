/**
 * Lista Duplamente Ligada
 * Implementação de uma lista onde cada nó aponta para o próximo e o anterior
 * Permite inserção e remoção eficiente em ambas as extremidades
 */

import { List } from "../../interfaces/list.js";



/**
 * Nó da lista duplamente ligada
 * Cada nó contém dados e referências para o próximo e anterior
 */
class DoublyNode<T> {
    data: T;
    next: DoublyNode<T> | null;
    prev: DoublyNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

/**
 * Lista Duplamente Ligada
 * Estrutura de dados que permite inserção e remoção eficiente em ambas as extremidades
 */
export class DoublyLinkedList1<T> implements List<T> {
    private head: DoublyNode<T> | null;
    private tail: DoublyNode<T> | null;
    private count: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    capacity(): number {
        return Infinity;
    }

    /**
     * Retorna o tamanho da lista
     * Complexidade: O(1)
     */
    size(): number {
        return this.count;
    }

    /**
     * Verifica se a lista está vazia
     * Complexidade: O(1)
     */
    isEmpty(): boolean {
        return this.count === 0;
    }

    /**
     * Limpa todos os nós da lista
     * Complexidade: O(1)
     */
    clear(): void {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    /**
     * Insere um valor no início da lista
     * Complexidade: O(1)
     */
    addFirst(data: T): void {
        const newNode = new DoublyNode(data);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head!.prev = newNode;
            this.head = newNode;
        }

        this.count++;
    }

    /**
     * Insere um valor no fim da lista
     * Complexidade: O(1)
     */
    addLast(data: T): void {
        const newNode = new DoublyNode(data);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }

        this.count++;
    }


    /**
     * Insere um valor na posição especificada
     * Complexidade: O(n)
     */
    add(data: T, index: number): void {
        if (index < 0 || index > this.count) {
            throw new Error("Índice inválido");
        }

        if (index === 0) {
            this.addFirst(data);
            return;
        }

        if (index === this.count) {
            this.addLast(data);
            return;
        }

        const newNode = new DoublyNode(data);
        let current = this.getNodeAt(index);

        newNode.next = current;
        newNode.prev = current.prev;
        current.prev!.next = newNode;
        current.prev = newNode;

        this.count++;
    }

    /**
     * Remove um nó do início da lista e retorna seu valor
     * Complexidade: O(1)
     */
    removeFirst(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const data = this.head!.data;

        if (this.count === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head!.next;
            this.head!.prev = null;
        }

        this.count--;
        return data;
    }

    /**
     * Remove um nó do fim da lista e retorna seu valor
     * Complexidade: O(1)
     */
    removeLast(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const data = this.tail!.data;

        if (this.count === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail!.prev;
            this.tail!.next = null;
        }

        this.count--;
        return data;
    }

    /**
     * Remove um nó da posição especificada da lista e retorna seu valor
     * Complexidade: O(n)
     */
    remove(index: number): T | undefined {
        if (index < 0 || index >= this.count) {
            return undefined;
        }

        if (index === 0) {
            return this.removeFirst();
        }

        if (index === this.count - 1) {
            return this.removeLast();
        }

        const nodeToRemove = this.getNodeAt(index);
        const data = nodeToRemove.data;

        nodeToRemove.prev!.next = nodeToRemove.next;
        nodeToRemove.next!.prev = nodeToRemove.prev;

        this.count--;
        return data;
    }

    /**
     * Obtém um valor no início da lista
     * Complexidade: O(1)
     */
    peekFirst(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.head!.data;
    }


    /**
     * Obtém um valor no fim da lista
     * Complexidade: O(1)
     */
    peekLast(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.tail!.data;
    }

    /**
     * Retorna o valor do nó na posição especificada
     * Complexidade: O(n)
     */
    get(position: number): T | undefined {
        if (position < 0 || position >= this.count) {
            return undefined;
        }

        return this.getNodeAt(position).data;
    }

    /**
     * Método auxiliar para obter o nó em uma posição específica
     * Otimizado para começar do início ou fim dependendo da posição
     */
    private getNodeAt(index: number): DoublyNode<T> {
        let current: DoublyNode<T>;

        // Otimização: começar do início ou fim dependendo da posição
        if (index < this.count / 2) {
            current = this.head!;
            for (let i = 0; i < index; i++) {
                current = current.next!;
            }
        } else {
            current = this.tail!;
            for (let i = this.count - 1; i > index; i--) {
                current = current.prev!;
            }
        }

        return current;
    }

    /**
     * Exibe todos os elementos da lista, do início ao fim, para debug
     * Complexidade: O(n)
     */
    printAll(): void {
        if (this.isEmpty()) {
            console.log("Lista vazia");
            return;
        }

        const elements: T[] = [];
        let current = this.head;

        while (current !== null) {
            elements.push(current.data);
            current = current.next;
        }

        console.log("Lista:", elements.join(" -> "));
    }
}
