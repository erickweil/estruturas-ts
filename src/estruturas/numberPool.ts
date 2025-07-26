/**
 * @fileoverview Implementação de um Object Pool baseado em Array (VecPool) em TypeScript.
 * Inspirado por estruturas de dados como slotmap e slab, comuns em Rust.
 *
 * O objetivo principal é reduzir a pressão sobre o Garbage Collector (GC)
 * em aplicações de alta performance (jogos, simulações) ao reutilizar objetos
 * em vez de alocar e desalocar memória constantemente.
 */

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