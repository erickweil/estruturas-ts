/**
 * @fileoverview Implementação de um Object Pool baseado em Array (VecPool) em TypeScript.
 * Inspirado por estruturas de dados como slotmap e slab, comuns em Rust.
 *
 * O objetivo principal é reduzir a pressão sobre o Garbage Collector (GC)
 * em aplicações de alta performance (jogos, simulações) ao reutilizar objetos
 * em vez de alocar e desalocar memória constantemente.
 */

import { BinaryType, initStructSchema, StructSchema } from "../utils/structSchema.js";

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
export class BufferPool<T extends StructSchema> {
    // A ideia é que tudo é um número aqui dentro. (Fazer assim depois ver se faz sentido structs byte a byte)
    //readonly arr: ArrayBufferLike;
    view: DataView;
    buffer: Buffer;

    // Quantidade de bytes por nó
    readonly stride: number;

    // Quantidade de nós sendo usados atualmente
    private allocatedCount: number;

    // Offset em bytes após a última alocação que já ocorreu no array, utilizado para alocar novos nós
    private maxOffset: number;

    // Índice do último nó livre (topo da pilha de vazios)
    // -1 se não houver nenhum nó livre
    private lastFree: number;

    public schema: T;

    constructor(capacity: number, schema: T) {
        this.allocatedCount = 0; // Inicialmente não há números alocados
        this.maxOffset = 0;
        this.lastFree = -1;

        this.schema = schema;
        this.stride = initStructSchema(schema);

        if(this.stride < Int32Array.BYTES_PER_ELEMENT) {
            this.stride = Int32Array.BYTES_PER_ELEMENT; // Garante que o stride é pelo menos 4 bytes (tamanho de um int32)
        }

        this.buffer = Buffer.alloc(capacity * this.stride);
        this.view = new DataView(this.buffer.buffer);

        this._bindStructSchema(schema);

        //console.log(`BufferPool criado com capacidade de ${capacity} nós (${this.arr.byteLength} bytes) e stride de ${this.stride} bytes.`);
    }

    private _bindStructSchema(schema: StructSchema) {
        for (const key in schema) {
            const type = schema[key];
            if (type instanceof BinaryType) {
                // Se for um tipo primitivo (BinaryType)
                type.bind(this.view, this.buffer);
            } else {
                // Se for um objeto, é uma struct aninhada
                this._bindStructSchema(type as StructSchema);
            }
        }
    }

    /**
     * Aloca um novo objeto no pool, reutilizando um espaço vazio se disponível.
     */
    public allocNode(clear: boolean = true): number {
        let isFull = (this.maxOffset + this.stride) >= this.buffer.byteLength;
        if (this.lastFree !== -1 && isFull) {
            // Reutiliza um espaço vazio (faz "pop" da pilha de vazios).

            // Pega o índice do último espaço livre
            const freeNode = this.lastFree;

            // Atualiza o índice do último espaço livre para o próximo na pilha
            this.lastFree = this.view.getInt32(this.lastFree, true);
            this.allocatedCount++;

            // Limpa os valores do nó alocado, se necessário
            if (clear) {
                this.buffer.fill(0, freeNode, (freeNode + this.stride));
            }

            return freeNode;
        } else {
            if (isFull) {
                //throw new Error("Pool está cheio. Aumente a capacidade.");
                // Resizing by doubling the capacity
                this._resizeBuffer();                
            }
            // Não há nenhum espaço vazio, adiciona um novo no final do array.
            const newNode = this.maxOffset; // Índice do novo nó
            this.maxOffset += this.stride;
            this.allocatedCount++;

            // Não precisa limpar, pois é um novo nó
            return newNode; // Retorna o índice do novo nó
        }
    }

    private _resizeBuffer() {
        const newCapacity = this.buffer.byteLength * 2; // Dobra a capacidade
        const newBuffer = Buffer.alloc(newCapacity);
        this.buffer.copy(newBuffer, 0, 0, this.buffer.byteLength);
        this.buffer = newBuffer;
        this.view = new DataView(this.buffer.buffer);

        // Atualiza o binding do schema
        this._bindStructSchema(this.schema);
    }

    /**
     * Libera um nó, marcando-o como vazio.
     */
    public freeNode(offset: number): void {        
        // Fazer push na pilha de vazios
        this.view.setInt32(offset, this.lastFree, true);
        this.lastFree = offset;
        this.allocatedCount--;
    }

    /**
     * Retorna o número de nós alocados no pool.
     */
    public size(): number {
        return this.allocatedCount;
    }

    /**
     * Retorna a capacidade total do pool.
     * A capacidade é o número de nós que o pool pode armazenar.
     */
    public capacity(): number {
        return Math.floor(this.buffer.byteLength / this.stride);
    }

    /**
     * Limpa o pool, removendo todos os números e liberando os espaços.
     */
    public clear(): void {
        this.buffer.fill(0); // Limpa todos os valores para 0
        this.allocatedCount = 0;
        this.maxOffset = 0;
        this.lastFree = -1;
    }
}