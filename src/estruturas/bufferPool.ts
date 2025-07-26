/**
 * @fileoverview Implementação de um Object Pool baseado em Array (VecPool) em TypeScript.
 * Inspirado por estruturas de dados como slotmap e slab, comuns em Rust.
 *
 * O objetivo principal é reduzir a pressão sobre o Garbage Collector (GC)
 * em aplicações de alta performance (jogos, simulações) ao reutilizar objetos
 * em vez de alocar e desalocar memória constantemente.
 */

import { Queue } from "../interfaces/queue.js";

// // Define os tipos primitivos que vamos suportar e seus tamanhos em bytes
// const typeSizes = {
//     'int8': Int8Array.BYTES_PER_ELEMENT,
//     'uint8': Uint8Array.BYTES_PER_ELEMENT,
//     'int16': Int16Array.BYTES_PER_ELEMENT,
//     'uint16': Uint16Array.BYTES_PER_ELEMENT,
//     'int32': Int32Array.BYTES_PER_ELEMENT,
//     'uint32': Uint32Array.BYTES_PER_ELEMENT,
//     'float32': Float32Array.BYTES_PER_ELEMENT,
//     'float64': Float64Array.BYTES_PER_ELEMENT
// };

// export type PrimitiveType = keyof typeof typeSizes;

export abstract class BinaryType<T> {
    abstract size(): number;
    abstract get(pool: BufferPool<any>, fieldOffset: number): (index: number) => T;
    abstract set(pool: BufferPool<any>, fieldOffset: number): (index: number, value: T) => void;
}

// O schema é um array de tipos que define a estrutura do nosso objeto
//export type StructSchema = { [key: string]: PrimitiveType | StructSchema };
export type StructSchema = {
    [key: string]: BinaryType<any> | StructSchema | Record<string, BinaryType<any>>;
}

/**
 * Cria um tipo de objeto de 'getter' recursivamente a partir de um StructSchema.
 * Para cada propriedade no schema T:
 * - Se for um PrimitiveType, a propriedade se torna uma função (index: number) => number.
 * - Se for um StructSchema aninhado, a propriedade se torna um objeto do mesmo tipo RecursiveGetters.
 */
export type RecursiveGetters<T extends StructSchema> = {
    [K in keyof T]: T[K] extends BinaryType<infer U>
        ? (index: number) => U
        : T[K] extends StructSchema
            ? RecursiveGetters<T[K]>
            : never;
};

/**
 * Cria um tipo de objeto de 'setter' recursivamente a partir de um StructSchema.
 * Para cada propriedade no schema T:
 * - Se for um PrimitiveType, a propriedade se torna uma função (index: number, value: number) => void.
 * - Se for um StructSchema aninhado, a propriedade se torna um objeto do mesmo tipo RecursiveSetters.
 */
export type RecursiveSetters<T extends StructSchema> = {
    [K in keyof T]: T[K] extends BinaryType<infer U>
        ? (index: number, value: U) => void
        : T[K] extends StructSchema
            ? RecursiveSetters<T[K]>
            : never;
};

// https://stackoverflow.com/questions/52489261/can-i-define-an-n-length-tuple-type
//type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;
//type SizedObject<N extends number, T> = Omit<Tuple<T, N>, keyof []>;

class Int8 extends BinaryType<number> {
    size() { return Int8Array.BYTES_PER_ELEMENT }
    //get(view: DataView, offset: number) { return view.getInt8(offset) }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getInt8(index * pool.stride + fieldOffset) 
    }
    set(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number, value: number) => pool.view.setInt8(index * pool.stride + fieldOffset, value)
    }
}

class UInt8 extends BinaryType<number> {
    size() { return Uint8Array.BYTES_PER_ELEMENT }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getUint8(index * pool.stride + fieldOffset) 
    }
    set(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number, value: number) => pool.view.setUint8(index * pool.stride + fieldOffset, value)
    }
}

class bBoolean extends BinaryType<boolean> {
    size() { return Uint8Array.BYTES_PER_ELEMENT }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getUint8(index * pool.stride + fieldOffset) !== 0; 
    }
    set(pool: BufferPool<any>, fieldOffset: number) {
        return (index: number, value: boolean) => pool.view.setUint8(index * pool.stride + fieldOffset, value ? 1 : 0);
    }
}

class Int32 extends BinaryType<number> {
    size() { return Int32Array.BYTES_PER_ELEMENT }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getInt32(index * pool.stride + fieldOffset, true) 
    }
    set(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number, value: number) => pool.view.setInt32(index * pool.stride + fieldOffset, value, true);
    }
}

class UInt32 extends BinaryType<number> {
    size() { return Uint32Array.BYTES_PER_ELEMENT }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getUint32(index * pool.stride + fieldOffset, true) 
    }
    set(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number, value: number) => pool.view.setUint32(index * pool.stride + fieldOffset, value, true);
    }
}

class Float32 extends BinaryType<number> {
    size() { return Float32Array.BYTES_PER_ELEMENT }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getFloat32(index * pool.stride + fieldOffset, true) 
    }
    set(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number, value: number) => pool.view.setFloat32(index * pool.stride + fieldOffset, value, true);
    }
}

class Float64 extends BinaryType<number> {
    size() { return Float64Array.BYTES_PER_ELEMENT }
    get(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number) => pool.view.getFloat64(index * pool.stride + fieldOffset, true) 
    }
    set(pool: BufferPool<any>, fieldOffset: number) { 
        return (index: number, value: number) => pool.view.setFloat64(index * pool.stride + fieldOffset, value, true);
    }
}

class bString extends BinaryType<string> {
    constructor(private readonly length: number) {
        super();
    }
    size() { return this.length * Uint8Array.BYTES_PER_ELEMENT; }
    get(pool: BufferPool<any>, fieldOffset: number) {
        return (index: number) => {
            // https://josephmate.github.io/2020-07-27-javascript-does-not-need-stringbuilder/
            let str = "";
            for (let i = 0; i < this.length; i++) {
                let b = pool.view.getUint8(index * pool.stride + fieldOffset + i);
                if (b === 0) break; // Para se encontrar um byte nulo
                str += String.fromCharCode(b);
            }
            
            return str;
        };
    }
    set(pool: BufferPool<any>, fieldOffset: number) {
        return (index: number, value: string) => {
            let i = 0;
            let end = Math.min(this.length, value.length);
            for (; i < end; i++) {
                pool.view.setUint8(index * pool.stride + fieldOffset + i, value.charCodeAt(i));
            }
            if (i < this.length) {
                pool.view.setUint8(index * pool.stride + fieldOffset + i, 0); // Preenche o próximo byte com 0 (nulo) para terminar a string
            }
            
        };
    }
}

export const bType = {
    uint8: () => new UInt8(),
    int8: () => new Int8(),
    uint32: () => new UInt32(),
    int32: () => new Int32(),
    float32: () => new Float32(),
    float64: () => new Float64(),
    boolean: () => new bBoolean(),
    array: <T extends (StructSchema | BinaryType<any>)>(length: number, schema: T) => {
        const build: Record<number, T> = {};
        for(let i = 0; i < length; i++) {
            build[i] = schema;
        }
        return build;
    },
    string: (length: number) => new bString(length)
};

/*const example = PoolType.array(5, {
    nome: PoolType.array(10, "uint8")
});*/

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
    readonly arr: ArrayBuffer;
    readonly view: DataView;
    readonly bufferView: Buffer;

    // Quantidade de bytes por nó
    readonly stride: number;

    // Quantidade de nós alocados atualmente
    private length: number;

    // Índice do último nó livre (topo da pilha de vazios)
    // -1 se não houver nenhum nó livre
    private lastFree: number;

    // Acesso recursivo aos getters e setters de cada propriedade do schema
    public readonly get: RecursiveGetters<T>;
    public readonly set: RecursiveSetters<T>;

    constructor(capacity: number, schema: T) {
        this.length = 0; // Inicialmente não há números alocados
        this.lastFree = -1;

        this.get = {} as any;
        this.set = {} as any;
        this.stride = this.proccessSchema(schema, 0, this.get, this.set); // Processa o schema para gerar os métodos de acesso
        if(this.stride < Int32Array.BYTES_PER_ELEMENT) {
            this.stride = Int32Array.BYTES_PER_ELEMENT; // Garante que o stride é pelo menos 4 bytes (tamanho de um int32)
        }
        this.arr = new ArrayBuffer(capacity * this.stride);
        this.view = new DataView(this.arr);
        this.bufferView = Buffer.from(this.arr);
    }

    proccessSchema(schema: StructSchema, offset: number, get: any, set: any) {
        /*for (const key in schema) {
            const type = schema[key];
            if (typeof type !== "string") {
                // Se for um objeto, é uma struct aninhada
                offset += this.proccessSchema(type, offset, get[key] = {}, set[key] = {});
            } else {
                const byteSize = typeSizes[type];
                
                get[key] = typeFns[type].get(this, offset);
                set[key] = typeFns[type].set(this, offset);

                offset += byteSize;
            }
        }

        return offset; // Atualiza o stride com o tamanho total da struct*/

        for (const key in schema) {
            const type = schema[key];
            if (type instanceof BinaryType) {
                // Se for um tipo primitivo (BinaryType)
                get[key] = type.get(this, offset);
                set[key] = type.set(this, offset);

                offset += type.size();
            } else {
                // Se for um objeto, é uma struct aninhada
                offset += this.proccessSchema(type as StructSchema, offset, get[key] = {}, set[key] = {});
            }
        }

        return offset;
    }

    /**
     * Aloca um novo objeto no pool, reutilizando um espaço vazio se disponível.
     */
    public allocNode(clear: boolean = true): number {
        if (this.lastFree !== -1) {
            // Reutiliza um espaço vazio (faz "pop" da pilha de vazios).

            // Pega o índice do último espaço livre
            const freeNode = this.lastFree;

            // Atualiza o índice do último espaço livre para o próximo na pilha
            this.lastFree = this.view.getInt32(this.lastFree * this.stride + 0, true);
            this.length++;

            // Limpa os valores do nó alocado, se necessário
            if (clear) {
                this.bufferView.fill(0, freeNode * this.stride, (freeNode + 1) * this.stride);
            }

            return freeNode;
        } else {
            // Não há nenhum espaço vazio, adiciona um novo no final do array.
            const newNode = this.length; // Índice do novo nó
            if ((newNode + 1) * this.stride > this.arr.byteLength) {
                throw new Error("Pool está cheio. Aumente a capacidade.");
            }
            this.length++;

            return newNode; // Retorna o índice do novo nó
        }
    }

    /**
     * Libera um nó, marcando-o como vazio.
     */
    public freeNode(index: number): void {
        //this.freeSlots.push(index);
        
        // Fazer push na pilha de vazios
        this.view.setInt32(index * this.stride + 0, this.lastFree, true);
        // Limpa os valores para 0
        // this.bufferView.fill(0, freeNode * this.stride, (freeNode + 1) * this.stride);
        this.lastFree = index;
        this.length--;
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
        this.bufferView.fill(0); // Limpa todos os valores para 0
        this.length = 0;
        this.lastFree = -1;
    }
}

export class BufferPoolQueue<T, SCHEMA extends (StructSchema | BinaryType<any>) = Int32> implements Queue<T> {
    pool: BufferPool<{
        value: SCHEMA,
        next: Int32,
    }>;
    
    private front: number;
    private rear: number;

    get: (pool: typeof this.pool, index: number) => T
    set: (pool: typeof this.pool, index: number, value: T) => void

    constructor(capacity: number, schema: SCHEMA = bType.int32() as SCHEMA, 
        get: typeof this.get,
        set: typeof this.set
    ) {
        this.pool = new BufferPool(capacity, {
            value: schema,
            next: bType.int32(),
        });
        this.get = get;
        this.set = set;
        this.front = -1; // Índice do primeiro elemento
        this.rear = -1; // Índice do último elemento
    }
    
    addLast(valor: T): void {
        const node = this.pool.allocNode(false);
        //this.pool.set.value(node, valor);
        this.set(this.pool, node, valor);
        this.pool.set.next(node, -1);
        //this.pool.setValues(node, valor, -1); // O próximo do nó será -1 (nada)

        if (this.rear === -1) {
            // Se a fila está vazia, o primeiro elemento é o front e rear
            this.front = node;
            this.rear = node;
        } else {
            // Caso contrário, adiciona ao final da fila
            this.pool.set.next(this.rear, node); // O próximo do antigo rear será o novo nó
            this.rear = node; // Atualiza o rear para o novo nó
        }
    }

    removeFirst(): T | undefined {
        if (this.front === -1) return undefined; // Fila vazia

        //const value = this.pool.get.value(this.front); // Obtém o valor do nó no front
        const value = this.get(this.pool, this.front); // Obtém o valor do nó no front
        const next =  this.pool.get.next(this.front); // Obtém o
        this.pool.freeNode(this.front);

        if (next === -1) {
            // Se não há próximo, a fila ficará vazia
            this.front = -1;
            this.rear = -1;
        } else {
            // Move o front para o próximo nó
            this.front = next;
        }
        return value as T;
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
    peekFirst(): T | undefined {
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
    *[Symbol.iterator](): IterableIterator<T> {
        let currentIndex = this.front;
        while (currentIndex !== -1) {
            //const node = this.pool.get.value(currentIndex);
            const node = this.get(this.pool, currentIndex);
            if (node) {
                yield node;
                currentIndex = this.pool.get.next(currentIndex); // Move para o próximo nó
            } else {
                break; // Se não houver mais nós, sai do loop
            }
        }
    }
}
