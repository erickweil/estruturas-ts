/**
 * @fileoverview Implementação de um Object Pool baseado em Array (VecPool) em TypeScript.
 * Inspirado por estruturas de dados como slotmap e slab, comuns em Rust.
 *
 * O objetivo principal é reduzir a pressão sobre o Garbage Collector (GC)
 * em aplicações de alta performance (jogos, simulações) ao reutilizar objetos
 * em vez de alocar e desalocar memória constantemente.
 */

/**
 * Valor de índice que representa a ausência de um nó vazio na lista ligada.
 */
const NULL_INDEX = -1;

export interface PoolNode {
    _index?: number | undefined; // Negativo indica um nó vazio apontando para o próximo nó vazio. (-1 é null, -2 é 0, -3 é 1, etc.)
};

/**
 * Object pooling
 * 
 * Para não ser lento procurar os nós vazios, aproveita a própria estrutura como ao mesmo tempo uma pilha (Linked) de valores vazios.
 * - Armazena o índice do último valor vazio (topo da pilha), ou NULL se não tem
 * - Cada valor vazio contém o next do próximo valor vazio, ou NULL
 * - Ao criar novo nó é realizado 'push' nesta pilha ligada, e ao remover é feito 'pop'
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
export class ObjectPool<T extends PoolNode> {
    private arr: T[];
    private length: number;

    /**
     * O índice do último slot que foi liberado (o "topo" da pilha de slots vazios).
     * Se for NULL_INDEX, não há slots vazios para reutilizar.
     */
    private lastEmpty: number;

    constructor() {
        this.arr = [];
        this.length = 0;
        this.lastEmpty = NULL_INDEX;
    }

    /**
     * Aloca um novo objeto no pool, reutilizando um espaço vazio se disponível.
     */
    public allocNode(): T {
        if (this.lastEmpty === NULL_INDEX) {
            // Não há nenhum espaço vazio, adiciona um novo no final do array.
            let node = {
                _index: this.arr.length
            } as T;
            this.arr.push(node); // Cria um novo nó vazio
            this.length++;
            return node;
        } else {
            // Reutiliza um espaço vazio (faz "pop" da pilha de vazios).
            const freeNodeIndex = (-this.lastEmpty) - 2;
            const freeNode = this.arr[freeNodeIndex];

            if (freeNode._index! < 0) {
                this.lastEmpty = freeNode._index!;

                // Re-incializar os valores
                freeNode._index = freeNodeIndex; // Marca como preenchido
                // Object.assign(freeNode, value);
                // this.arr[freeNodeIndex] = value; // Substitui o valor do nó vazio pelo novo valor
                this.length++;

                return freeNode;
            } else {
                // Esta condição nunca deveria ser atingida em uma operação normal.
                // Indica um estado inconsistente do pool.
                throw new Error("Estado inconsistente do pool: lastEmpty apontava para um nó preenchido.");
            }
        }
    }

    /**
     * Libera um objeto, tornando seu espaço disponível para reutilização e retorna o valor que estava nele.
     * 
     * Obs: Mas não irá apagar seu conteúdo, apenas marca como vazio.
     */
    public freeNode(node: number): T | null {
        if (node < 0 || node >= this.arr.length) {
            return null; // Índice fora dos limites
        }

        const ret = this.arr[node];
        if (!ret || ret._index! < 0) {
            return null; // O nó não existe ou já está vazio. (double free?)
        }

        // Transforma o nó em um nó vazio.
        // - fazer push() na pilha de valores vazios
        ret._index = this.lastEmpty;
        this.lastEmpty = -(node + 2);
        this.length--;

        return ret;
    }

    /**
     * Retorna um objeto armazenado, poderá alterar o valor do objeto diretamente.
     */
    public get(node: number): T | null {
        const value = this.arr[node];

        // Verifica se o nó é válido e não está vazio
        if (value && value._index! >= 0) {
            return value;
        }
        return null; // Nó vazio ou inválido
    }

    public size(): number {
        return this.length;
    }

    public clear(): void {
        this.arr = [];
        this.length = 0;
        this.lastEmpty = NULL_INDEX;
    }
}