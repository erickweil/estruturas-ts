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
import { BinaryType, StructType, Int32, StructSchema } from '../utils/structSchema.js';
import { BufferPool } from './bufferPool.js';

const NULL_INDEX = -1;

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
export class PoolList<T, SCHEMA extends (StructSchema | BinaryType<any>)> implements List<T>, Queue<T>, Deque<T>, Stack<T> {
    private schema: {
        value: SCHEMA,
        next: Int32,
        prev: Int32
    };
    private pool: BufferPool<typeof this.schema>;
    private first: number;
    private last: number;
    private length: number;

    getT: (schema: SCHEMA, index: number) => T
    setT: (schema: SCHEMA, index: number, value: T) => void

    constructor(capacity: number | BufferPool<typeof this.schema>, schema: SCHEMA, 
        get: typeof this.getT,
        set: typeof this.setT) {
        this.schema = {
            value: schema,
            next: StructType.int32(),
            prev: StructType.int32(),
        };
        if(typeof capacity === 'object') {
            this.pool = capacity;
        } else {
            this.pool = new BufferPool(capacity, this.schema);
        }
        this.getT = get;
        this.setT = set;
        this.first = NULL_INDEX;
        this.last = NULL_INDEX;
        this.length = 0;
    }

    static createNumberList(capacity: number): PoolList<number, Int32> {
        return new PoolList(capacity, 
            StructType.int32(), 
            (schema, index) => { return schema.get(index) },
            (schema, index, value) => { schema.set(index, value); }
        )
    }

    /**
     * Limpa a lista, reiniciando o pool e os ponteiros.
     */
    public clear(): void {
        this.pool.clear();
        this.first = NULL_INDEX;
        this.last = NULL_INDEX;
        this.length = 0;
    }

    /**
     * Adiciona um valor no início da lista.
     * @returns O índice do nó alocado no pool.
     */
    public putFirst(value: T): number {
        const newNode = this.pool.allocNode(false);
        this.setT(this.schema.value, newNode, value);
        this.schema.next.set(newNode, NULL_INDEX);
        this.schema.prev.set(newNode, NULL_INDEX);
        this.length++;

        if (this.first === NULL_INDEX) {
            // Agora o início e o fim da lista é ele
            this.first = newNode;
            this.last = newNode;
        } else {
            // 1. .next do novo nó aponta para o antigo início
            this.schema.next.set(newNode, this.first);

            // 2. .prev do antigo início aponta para o novo nó
            this.schema.prev.set(this.first, newNode);

            // 3. O início da lista agora é o novo nó
            this.first = newNode;
        }

        return newNode;
    }

    /**
     * Adiciona um valor no final da lista.
     * @returns O índice do nó alocado no pool.
     */
    public putLast(value: T): number {
        const newNode = this.pool.allocNode(false);
        this.setT(this.schema.value, newNode, value);
        this.schema.next.set(newNode, NULL_INDEX);
        this.schema.prev.set(newNode, NULL_INDEX);
        this.length++;

        if (this.last === NULL_INDEX) {
            this.first = newNode;
            this.last = newNode;
        } else {
            // 1. .prev do novo nó aponta para o antigo final
            this.schema.prev.set(newNode, this.last);

            // 2. .next do antigo final aponta para o novo nó
            this.schema.next.set(this.last, newNode);

            // 3. O final da lista agora é o novo nó
            this.last = newNode;
        }
        return newNode;
    }

    /**
     * Remove o primeiro elemento da lista.
     * @returns O valor do elemento removido ou null se a lista estiver vazia.
     */
    public removeFirst(): T | undefined {
        if (this.first === NULL_INDEX) return undefined;

        const _next = this.schema.next.get(this.first);
        const _value = this.getT(this.schema.value, this.first);
        this.pool.freeNode(this.first);
        this.length--;

        if (_next === NULL_INDEX) {
            // Se era o último nó, limpa a lista
            this.first = NULL_INDEX;
            this.last = NULL_INDEX;
        } else {            
            // 1. .prev do próximo nó aponta para NULL
            this.schema.prev.set(_next, NULL_INDEX);

            // 2. first agora é o próximo do antigo primeiro
            this.first = _next;
        }

        return _value;
    }

    /**
     * Remove o último elemento da lista.
     * @returns O valor do elemento removido ou null se a lista estiver vazia.
     */
    public removeLast(): T | undefined {
        if (this.last === NULL_INDEX) return undefined;

        const _prev = this.schema.prev.get(this.last);
        const _value = this.getT(this.schema.value, this.last);
        this.pool.freeNode(this.last);
        this.length--;

        if (_prev === NULL_INDEX) {
            // Se era o último nó, limpa a lista
            this.first = NULL_INDEX;
            this.last = NULL_INDEX;
        } else {
            // 1. .next do nó anterior ao último aponta para NULL
            this.schema.next.set(_prev, NULL_INDEX);

            // 2. last agora é o anterior ao último
            this.last = _prev;
        }

        return _value;
    }

    private _get(index: number): number {
        if (index < 0 || index >= this.length) {
            return NULL_INDEX;
        }

        let atual: number;

        // Otimização: começar do início ou fim dependendo da posição
        let i: number;
        if (index <= this.length / 2) {
            atual = this.first;
            for (i = 0; i < index; i++) {
                atual = this.schema.next.get(atual);
            }
        } else {
            atual = this.last;
            for (i = this.length - 1; i > index; i--) {
                atual = this.schema.prev.get(atual);
            }
        }

        return atual;
    }

    public get(index: number): T | undefined {      
        const nodeIndex = this._get(index);
        if (nodeIndex === NULL_INDEX) return undefined;

        return this.getT(this.schema.value, nodeIndex);
    }

    public add(value: T, index: number): void {
        if(index === 0) return this.addFirst(value);
        if(index === this.length) return this.addLast(value);
        
        const antigo = this._get(index);
        if(antigo === NULL_INDEX) throw new Error("Índice fora do intervalo da lista");

        const anterior = this.schema.prev.get(antigo); // É garantido que anterior existe
        
        const newNode = this.pool.allocNode(false);
        this.setT(this.schema.value, newNode, value);
        this.schema.next.set(newNode, antigo);
        this.schema.prev.set(newNode, anterior);
        this.length++;

        this.schema.next.set(anterior, newNode);
        this.schema.prev.set(antigo, newNode);
    }

    public remove(index: number): T | undefined {
        if(index === 0) return this.removeFirst();
        if(index === this.length - 1) return this.removeLast();

        const no = this._get(index);
        if(no === NULL_INDEX) return undefined;

        const no_anterior = this.schema.prev.get(no);
        const no_proximo = this.schema.next.get(no);
        
        const value = this.getT(this.schema.value, no);
        this.pool.freeNode(no);
        this.length--;

        this.schema.next.set(no_anterior, no_proximo);
        this.schema.prev.set(no_proximo, no_anterior);

        return value;
    }

    public addFirst(value: T): void { this.putFirst(value); }
    public peekFirst(): T | undefined {
        if (this.first === NULL_INDEX) return undefined;
        return this.getT(this.schema.value, this.first);
    }
    public peekLast(): T | undefined { 
        if (this.last === NULL_INDEX) return undefined;
        return this.getT(this.schema.value, this.last);
    }
    public addLast(value: T): void { this.putLast(value); }

    public push(value: T): void { this.putLast(value); }
    public pop(): T | undefined { return this.removeLast(); }

    public capacity(): number {
        return this.pool.capacity();
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public size(): number {
        return this.length;
    }

    /**
     * Implementação do protocolo de iterador do JavaScript.
     * Permite usar `for...of` na lista.
     */
    public *[Symbol.iterator](): Iterator<T> {
        let atual = this.first;
        while (atual !== NULL_INDEX) {
            yield this.getT(this.schema.value, atual);
            atual = this.schema.next.get(atual);
        }
    }
}