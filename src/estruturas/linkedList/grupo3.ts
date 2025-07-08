import { List } from "../../interfaces/list.js";

class Node<T> {
    public data: T;
    public next: Node<T> | null = null;
    public prev: Node<T> | null = null;

    constructor(data: T) {
        this.data = data;
    }
}

export class DoublyLinkedList3<T> implements List<T> {
    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;
    private _size: number = 0;

    capacity(): number {
        return Infinity;
    }

    // Retorna o tamanho da lista
    size(): number {
        return this._size;
    }

    // Verifica se a lista está vazia
    isEmpty(): boolean {
        return this._size === 0;
    }

    // Limpa toda a lista
    clear(): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    // Exibe todos os elementos
    printAll(): void {
        let current = this.head;
        const elements: T[] = [];
        while (current) {
            elements.push(current.data);
            current = current.next;
        }
        console.log(elements.join(" <-> ") || "Lista vazia");
    }

    // insere no início.
    addFirst(data: T): void {
        const newNode = new Node(data);
        if (this.isEmpty()) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head!.prev = newNode;
            this.head = newNode;
        }
        this._size++;
    }

    // insere no final.
    addLast(data: T): void {
        const newNode = new Node(data);
        if (this.isEmpty()) {
            this.head = this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this._size++;
    }

    // insere em posição específica.
    add(data: T, index: number): void {
        if (index < 0 || index > this._size) throw new Error("Índice inválido");
        if (index === 0) return this.addFirst(data);
        if (index === this._size) return this.addLast(data);

        const newNode = new Node(data);
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }

        newNode.next = current;
        newNode.prev = current!.prev;
        current!.prev!.next = newNode;
        current!.prev = newNode;

        this._size++;
    }

    //remove do início
    removeFirst(): T | undefined {
        if (this.isEmpty()) return undefined;
        const data = this.head!.data;
        this.head = this.head!.next;
        if (this.head) this.head.prev = null;
        else this.tail = null;
        this._size--;
        return data;
    }

    //remove do final
    removeLast(): T | undefined {
        if (this.isEmpty()) return undefined;
        const data = this.tail!.data;
        this.tail = this.tail!.prev;
        if (this.tail) this.tail.next = null;
        else this.head = null;
        this._size--;
        return data;
    }

    //remove por índice
    remove(index: number): T | undefined {
        if (index < 0 || index >= this._size) return undefined;
        if (index === 0) return this.removeFirst();
        if (index === this._size - 1) return this.removeLast();

        let current = this.head;
        for (let i = 0; i < index; i++) {
        current = current!.next;
        }

        const data = current!.data;
        current!.prev!.next = current!.next;
        current!.next!.prev = current!.prev;

        this._size--;
        return data;
    }

   // Retorna o primeiro elemento 
    peekFirst(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.head!.data;
    }

    // Retorna o último elemento 
    peekLast(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.tail!.data;
    }

   // Obtém o valor armazenado na posição informada
    get(position: number): T | undefined {
    if (position < 0 || position >= this._size) {
        return undefined;
    }

    let current = this.head;
    for (let i = 0; i < position; i++) {
        current = current!.next;
    }

    return current!.data;
    }

}
