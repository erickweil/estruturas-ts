/**
 * @fileoverview Implementação de uma Lista Duplamente Encadeada (Safe) em TypeScript.
 * Utiliza um Object Pool para gerenciar a alocação de nós, evitando o uso de ponteiros
 * e reduzindo a pressão sobre o Garbage Collector.
 *
 * Inspirado pela implementação em Rust:
 * https://github.com/erickweil/aprendendo-rust/blob/main/src/estruturas/linked_list.rs
 */

import { Deque } from '../interfaces/deque.js';
import { List } from '../interfaces/list.js';
import { Queue } from '../interfaces/queue.js';
import { Stack } from '../interfaces/stack.js';
import { ObjectPool, PoolNode } from './objectPool.js';

const NULL_INDEX = -1;

interface LinkedNode<T> extends PoolNode {
    value: T;
    next: number;
    prev: number;
}

/**
 * Lista duplamente encadeada sem o uso de ponteiros diretos,
 * utilizando um ObjectPool para alocação de nós.
 * 
 * MAS EM JAVASCRIPT FICA MAIS LENTO KKKKKKKKKKKKKKKKKKKKKK
 * 
 * Adaptado de https://github.com/erickweil/aprendendo-rust/blob/main/src/estruturas/linked_list.rs
 * 
 * Referência da ideia:
 * https://stackoverflow.com/questions/3002764/is-a-linked-list-implementation-without-using-pointers-possible-or-not
 * Q: Is a Linked-List implementation without using pointers possible or not?
 * 
 * https://stackoverflow.com/a/13158115
 * A: Yes you can, it is not necessary to use pointers for a link list. It is possible to link a list without using pointers. You can statically allocate an array for the nodes, and instead of using next and previous pointer, you can just use indexes. You can do that to save some memory, if your link list is not greater than 255 for example, you can use 'unsigned char' as index (referencing C), and save 6 bytes for next and previous indications.
 * You may need this kind of array in embedded programming, since memory limitations can be troublesome sometimes.
 * Also keep in mind that your link list nodes will not necessary be contiguous in the memory.
 * Let's say your link list will have 60000 nodes. Allocating a free node from the array using a linear search should be inefficient. Instead, you can just keep the next free node index everytime:
 * Just initialize your array as each next index shows the current array index + 1, and firstEmptyIndex = 0.
 * When allocating a free node from the array, grab the firstEmptyIndex node, update the firstEmptyIndex as next index of the current array index (do not forget to update the next index as Null or empty or whatever after this).
 * When deallocating, update the next index of the deallocating node as firstEmptyIndex, then do firstEmptyIndex = deallocating node index.
 * In this way you create yourself a shortcut for allocating free nodes from the array.
 */
export class PoolList<T> implements List<T>, Queue<T>, Deque<T>, Stack<T> {
    private arr: ObjectPool<LinkedNode<T>>;
    private first: number;
    private last: number;

    constructor() {
        this.arr = new ObjectPool<LinkedNode<T>>();
        this.first = NULL_INDEX;
        this.last = NULL_INDEX;
    }

    /**
     * Cria uma nova LinkedList a partir de um array de valores.
     */
    public static from<T>(values: T[]): PoolList<T> {
        const list = new PoolList<T>();
        for (const value of values) {
            list.putLast(value);
        }
        return list;
    }

    /**
     * Limpa a lista, reiniciando o pool e os ponteiros.
     */
    public clear(): void {
        this.arr.clear();
        this.first = NULL_INDEX;
        this.last = NULL_INDEX;
    }

    /**
     * Retorna o número de elementos na lista.
     */
    public len(): number {
        return this.arr.size();
    }

    /**
     * Adiciona um valor no início da lista.
     * @returns O índice do nó alocado no pool.
     */
    public putFirst(value: T): number {
        const len = this.arr.size();
        const newNode = this.arr.allocNode();
        const newNodeIndex = newNode._index!;
        newNode.value = value;
        newNode.next = NULL_INDEX;
        newNode.prev = NULL_INDEX;

        if (len === 0) {
            // Agora o início e o fim da lista é ele
            this.first = newNodeIndex;
            this.last = newNodeIndex;
        } else {
            const oldFirstNode = this.arr.get(this.first)!;
            
            // 1. .next do novo nó aponta para o antigo início
            newNode.next = this.first;
            // 2. .prev do antigo início aponta para o novo nó
            oldFirstNode.prev = newNodeIndex;
            // 3. O início da lista agora é o novo nó
            this.first = newNodeIndex;
        }

        return newNodeIndex;
    }

    /**
     * Adiciona um valor no final da lista.
     * @returns O índice do nó alocado no pool.
     */
    public putLast(value: T): number {
        const len = this.arr.size();
        const newNode = this.arr.allocNode();
        const newNodeIndex = newNode._index!;
        newNode.value = value;
        newNode.next = NULL_INDEX;
        newNode.prev = NULL_INDEX;

        if (len === 0) {
            this.first = newNodeIndex;
            this.last = newNodeIndex;
        } else {
            const oldLastNode = this.arr.get(this.last)!;

            // 1. .prev do novo nó aponta para o antigo final
            newNode.prev = this.last;
            // 2. .next do antigo final aponta para o novo nó
            oldLastNode.next = newNodeIndex;
            // 3. O final da lista agora é o novo nó
            this.last = newNodeIndex;
        }
        return newNodeIndex;
    }

    /**
     * Remove o primeiro elemento da lista.
     * @returns O valor do elemento removido ou null se a lista estiver vazia.
     */
    public removeFirst(): T | undefined {
        if (this.first === NULL_INDEX) return undefined;

        const len = this.arr.size();
        const firstNode = this.arr.freeNode(this.first)!;
        if (len === 1) {
            // Se era o último nó, limpa a lista
            this.clear();
        } else {
            const nextIndex = firstNode.next;
            const newFirstNode = this.arr.get(nextIndex)!;
            
            // 1. .prev do próximo nó aponta para NULL
            newFirstNode.prev = NULL_INDEX;
            // 2. first agora é o próximo do antigo primeiro
            this.first = nextIndex;
        }

        return firstNode.value;
    }

    /**
     * Remove o último elemento da lista.
     * @returns O valor do elemento removido ou null se a lista estiver vazia.
     */
    public removeLast(): T | undefined {
        if (this.last === NULL_INDEX) return undefined;

        const len = this.arr.size();
        const lastNode = this.arr.freeNode(this.last)!;
        if (len === 1) {
            // Se era o último nó, limpa a lista
            this.clear();
        } else {
            const prevIndex = lastNode.prev;
            const newLastNode = this.arr.get(prevIndex)!;

            // 1. .next do nó anterior ao último aponta para NULL
            newLastNode.next = NULL_INDEX;
            // 2. last agora é o anterior ao último
            this.last = prevIndex;
        }

        return lastNode.value;
    }

    /**
     * Retorna o índice do primeiro nó no pool.
     */
    public indexFirst(): number {
        return this.first;
    }

    /**
     * Retorna o índice do último nó no pool.
     */
    public indexLast(): number {
        return this.last;
    }

    /**
     * Obtêm o valor de um nó pelo seu índice no pool.
     */
    public getObject(nodeIndex: number): T | undefined {
        const node = this.arr.get(nodeIndex);
        return node ? node.value : undefined;
    }

    public get(index: number): T | undefined {
        throw new Error('Método get não implementado. Use peekFirst ou peekLast.');
    }

    public add(data: T, index: number): void {
        throw new Error('Método add não implementado. Use putFirst ou putLast.');
    }

    public remove(index: number): T | undefined {
        throw new Error('Método remove não implementado. Use removeFirst ou removeLast.');
    }

    public addFirst(value: T): void { this.putFirst(value); }
    public peekFirst(): T | undefined { return this.getObject(this.first); }
    public peekLast(): T | undefined { return this.getObject(this.last); }
    public addLast(value: T): void { this.putLast(value); }

    public push(value: T): void { this.putLast(value); }
    public pop(): T | undefined { return this.removeLast(); }

    public capacity(): number {
        return Infinity;
    }

    public isEmpty(): boolean {
        return this.first === NULL_INDEX && this.last === NULL_INDEX;
    }

    public size(): number {
        return this.arr.size();
    }

    /**
     * Implementação do protocolo de iterador do JavaScript.
     * Permite usar `for...of` na lista.
     */
    public *[Symbol.iterator](): Iterator<T> {
        let currentIndex = this.first;
        while (currentIndex !== NULL_INDEX) {
            const currentNode = this.arr.get(currentIndex);
            if (currentNode) {
                yield currentNode.value;
                currentIndex = currentNode.next;
            } else {
                // Interrompe a iteração se um nó não for encontrado (estado inconsistente)
                return;
            }
        }
    }
}