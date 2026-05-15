import { ArrayDeque } from "./arrayDeque.js";

export type AnyTypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;

export class ArrayBufferDeque<T extends AnyTypedArray> extends ArrayDeque<number> {
    newFn: (length: number) => T;
    constructor(
        length: number = 15, 
        newFn: (length: number) => T
    ) {
        super(length, newFn as unknown as (length: number) => (number | undefined)[]);
        this.newFn = newFn;
    }

    resize() {
        // Redimensiona o array para o dobro do tamanho
        const arr = this.arr as unknown as T;
        let oldlength = arr.length;
        let newLength = arr.length * 2;

        let newArr = this.newFn(newLength);
        newArr.set(arr);
        this.arr = newArr as unknown as (number | undefined)[];

        if(this.fim < this.inicio) {
            // Se o fim estiver antes do início, significa que a fila está "quebrada"
            // Tem que juntar denovo [2345...1] -> [.......12345...]
            for(let i = 0; i < this.fim; i++) {
                this.arr[oldlength + i] = this.arr[i];
                this.arr[i] = undefined;
            }
            this.fim = oldlength + this.fim;
        }
    }

    clear(): void {
        this.inicio = 0;
        this.fim = 0;
    }

    getBuffer(): T {
        return this.arr as unknown as T;
    }
}