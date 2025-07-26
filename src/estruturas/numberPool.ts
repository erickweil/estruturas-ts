/**
 * @fileoverview Implementação de um Object Pool baseado em Array (VecPool) em TypeScript.
 * Inspirado por estruturas de dados como slotmap e slab, comuns em Rust.
 *
 * O objetivo principal é reduzir a pressão sobre o Garbage Collector (GC)
 * em aplicações de alta performance (jogos, simulações) ao reutilizar objetos
 * em vez de alocar e desalocar memória constantemente.
 */

import { Queue } from "../interfaces/queue.js";

/**
 * Object pooling
 * 
 * Para não ser lento procurar os nós vazios, aproveita a própria estrutura como ao mesmo tempo uma pilha (Linked) de valores vazios.
 * - Armazena o índice do último valor vazio (topo da pilha), ou NULL se não tem
 * - Cada valor vazio contém o next do próximo valor vazio, ou NULL
 * - Ao criar novo nó é realizado 'push' nesta pilha ligada, e ao remover é feito 'pop'
 * 
 * Ao converter para javascript, foi inspirado em:
 * - https://en.wikipedia.org/wiki/Asm.js
 * 
 * Adaptado de:
 * - https://github.com/erickweil/aprendendo-rust/blob/main/src/estruturas/vecpool.rs
 * 
 * Referências/Trabalho similar:
 * - Slotmap (https://github.com/orlp/slotmap)
 *   - https://www.reddit.com/r/rust/comments/8zkedd/slotmap_a_new_crate_for_storing_values_with/
 *   - 4 minute version presented as a lightning talk at C++Now: https://www.youtube.com/watch?v=SHaAR7XPtNU
 *   - 30 minute version (includes other containers as well) presented as a CppCon session: https://www.youtube.com/watch?v=-8UZhDjgeZU
 * - Slab (https://github.com/tokio-rs/slab)
 * - https://www.reddit.com/r/rust/comments/gfo1uw/benchmarking_slotmap_slab_stable_vec_etc/
 */
export class NumberPool {
    // A ideia é que tudo é um número aqui dentro. (Fazer assim depois ver se faz sentido structs byte a byte)
    private arr: number[];
    // Quantidade de números por nó
    private stride: number;

    private length: number;

    private freeSlots: number[]; // Pilha de nós vazios

    constructor(capacity: number, stride: number = 1) {
        this.arr = new Array(capacity * stride).fill(0);
        this.stride = stride;
        this.length = 0; // Inicialmente não há números alocados
        this.freeSlots = []; // Inicialmente não há nós vazios
    }

    /**
     * Aloca um novo objeto no pool, reutilizando um espaço vazio se disponível.
     */
    public allocNode(): number {
        if (this.freeSlots.length > 0) {
            // Reutiliza um espaço vazio (faz "pop" da pilha de vazios).
            return this.freeSlots.pop()!;
        } else {
            // Não há nenhum espaço vazio, adiciona um novo no final do array.
            const newNode = this.length / this.stride; // Índice do novo nó
            this.length++;

            return newNode; // Retorna o índice do novo nó
        }
    }

    /**
     * Libera um nó, marcando-o como vazio.
     */
    public freeNode(index: number): void {
        if (index < 0 || index >= this.length) {
            throw new Error("Índice fora dos limites do pool");
        }
        this.freeSlots.push(index);
    }

    /**
     * Define o valor em um índice específico.
     */
    public setValue(index: number, offset: number, value: number): void {
        this.arr[index * this.stride + offset] = value;
    }

    /**
     * Obtém o valor em um índice específico.
     */
    public getValue(index: number, offset: number): number {
        return this.arr[index * this.stride + offset];
    }

    public getValues(index: number, values: number[]) {
        for (let i = 0; i < this.stride; i++) {
            values.push(this.arr[index * this.stride + i]);
        }
        return values;
    }

    /**
     * Retorna o tamanho atual do pool.
     */
    public size(): number {
        return this.length;
    }

    /**
     * Limpa o pool, removendo todos os números e liberando os espaços.
     */
    public clear(): void {
        // usando .length = 0 para limpar o array sem desalocar
        this.length = 0;
        this.freeSlots.length = 0;
    }
}


export class NumberPoolQueue implements Queue<number> {
    pool: NumberPool;
    
    private front: number;
    private rear: number;

    constructor(capacity: number) {
        this.pool = new NumberPool(capacity, 2);
        this.front = -1; // Índice do primeiro elemento
        this.rear = -1; // Índice do último elemento
    }
    
    addLast(valor: number): void {
        const node = this.pool.allocNode();
        this.pool.setValue(node, 0, valor);
        this.pool.setValue(node, 1, -1);
        //this.pool.setValues(node, valor, -1); // O próximo do nó será -1 (nada)

        if (this.rear === -1) {
            // Se a fila está vazia, o primeiro elemento é o front e rear
            this.front = node;
            this.rear = node;
        } else {
            // Caso contrário, adiciona ao final da fila
            this.pool.setValue(this.rear, 1, node); // O próximo do antigo rear será o novo nó
            this.rear = node; // Atualiza o rear para o novo nó
        }
    }

    removeFirst(): number | undefined {
        if (this.front === -1) return undefined; // Fila vazia

        const value = this.pool.getValue(this.front, 0); // Obtém o valor do nó no front
        const next =  this.pool.getValue(this.front, 1); // Obtém o
        this.pool.freeNode(this.front);

        if (next === -1) {
            // Se não há próximo, a fila ficará vazia
            this.front = -1;
            this.rear = -1;
        } else {
            // Move o front para o próximo nó
            this.front = next;
        }
        return value;
    }

    // push(v: any): void {
    //     const [node, index] = this.pool.allocNode();
    //     node.value = v;
    //     node.next = this.top; // O próximo será o antigo topo
        
    //     this.top = index;
    // }
    // pop(): T | undefined {
    //     if (this.top === -1) return undefined;

    //     const node = this.pool.freeNode(this.top)!;
    //     this.top = node.next!;

    //     return node as T;
    // }
    peekFirst(): number | undefined {
        throw new Error("Method not implemented.");
    }
    isEmpty(): boolean {
        throw new Error("Method not implemented.");
    }
    clear(): void {
        this.pool.clear();
        this.front = -1;
        this.rear = -1;
    }
    size(): number {
        return this.pool.size();
    }
    capacity(): number {
        throw new Error("Method not implemented.");
    }

    // for of
    *[Symbol.iterator](): IterableIterator<number> {
        let currentIndex = this.front;
        while (currentIndex !== -1) {
            const node = this.pool.getValue(currentIndex, 0);
            if (node) {
                yield node;
                currentIndex = this.pool.getValue(currentIndex, 1); // Move para o próximo nó
            } else {
                break; // Se não houver mais nós, sai do loop
            }
        }
    }
}
