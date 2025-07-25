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
    _index?: number | undefined; // se tiver o valor, é o próximo nó vazio, se for undefined, é um nó válido
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
    private lastEmpty: number; // Índice do último nó vazio
    private factory: () => T;
    constructor(factory: () => T) {
        this.arr = [];
        this.length = 0;
        this.lastEmpty = NULL_INDEX; // Inicialmente não há nós vazios
        this.factory = factory; // Fallback para criar um nó vazio
    }

    /**
     * Aloca um novo objeto no pool, reutilizando um espaço vazio se disponível.
     */
    public allocNode(): T {
        if (this.lastEmpty === NULL_INDEX) {
            // Não há nenhum espaço vazio, adiciona um novo no final do array.
            const newNode = this.factory(); // Cria um novo nó vazio
            newNode._index = this.arr.length;
            this.arr.push(newNode); // Cria um novo nó vazio
            this.length++;

            return newNode; // Retorna o índice do novo nó
        } else {
            // Reutiliza um espaço vazio (faz "pop" da pilha de vazios).
            //const freeNodeIndex = this.freeSlots.pop()!;
            const freeNodeIndex = this.lastEmpty;
            const node = this.arr[freeNodeIndex]
            this.lastEmpty = node._index!;
            node._index = freeNodeIndex;

            this.length++;
            
            // Re-incializar os valores
            return node;
        }
    }

    /**
     * Libera um objeto, tornando seu espaço disponível para reutilização e retorna o valor que estava nele.
     * 
     * Obs: Mas não irá apagar seu conteúdo, apenas marca como vazio.
     */
    public freeNode(node: number): T | null {
        const value = this.arr[node];
        //if(!value || value._index !== undefined) {
            //return null;
        //}

        // Transforma o nó em um nó vazio.
        // - fazer push() na pilha de valores vazios
        //this.freeSlots.push(node);
        value._index = this.lastEmpty; // O próximo nó vazio será o antigo topo da pilha
        this.lastEmpty = node; // Atualiza o topo da pilha de vazios

        this.length--;

        return value;
    }

    /**
     * Retorna um objeto armazenado, poderá alterar o valor do objeto diretamente.
     */
    public get(node: number): T | null {
        return this.arr[node] || null; // Retorna null se o índice for inválido
    }

    public size(): number {
        return this.length;
    }

    public clear(): void {
        this.arr = [];
        this.length = 0;
        this.lastEmpty = NULL_INDEX; // Reseta o topo da pilha de vazios
    }
}