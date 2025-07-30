
export abstract class BinaryType<T> {
    fieldOffset: number = -1; // Offset do campo no buffer

    abstract size(): number;
    abstract bind(view: DataView, buffer: Buffer): void;
    abstract get(index: number): T;
    abstract set(index: number, value: T): void;
}

// O schema é um array de tipos que define a estrutura do nosso objeto
//export type StructSchema = { [key: string]: PrimitiveType | StructSchema };
export type StructSchema = {
    [key: string]: BinaryType<any> | StructSchema | Record<string, BinaryType<any>>;
}

function _getStructSchema(schema: StructSchema, offset: number) {
    for (const key in schema) {
        const type = schema[key];
        if (type instanceof BinaryType) {
            // Se for um tipo primitivo (BinaryType)
            if(type.fieldOffset !== -1) {
                throw new Error(`O campo ${key} (${type}) já foi definido com um offset de ${type.fieldOffset}. Deve utilizar cada instância de tipo uma única vez.`);
            }
            type.fieldOffset = offset;
            offset += type.size();
            // Align 4-byte boundary?
            // offset = Math.ceil(offset / 4) * 4;
        } else {
            // Se for um objeto, é uma struct aninhada
            offset += _getStructSchema(type as StructSchema, offset);
        }
    }

    return offset;
}

export const initStructSchema = <T extends StructSchema>(schema: T): number => {
    return _getStructSchema(schema, 0);
};

// https://stackoverflow.com/questions/52489261/can-i-define-an-n-length-tuple-type
//type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;
//type SizedObject<N extends number, T> = Omit<Tuple<T, N>, keyof []>;

class FixedString extends BinaryType<string> {
    view!: DataView;
    constructor(private readonly length: number) {
        super();
    }
    size() { return this.length * Uint16Array.BYTES_PER_ELEMENT; }

    bind(view: DataView, buffer: Buffer): void {
        this.view = view;
    }

    get(offset: number) {
        // https://josephmate.github.io/2020-07-27-javascript-does-not-need-stringbuilder/
        let str = "";
        for (let i = 0; i < this.length; i++) {
            let b = this.view.getUint16(offset + this.fieldOffset + i * 2);
            if (b === 0) break; // Para se encontrar um byte nulo
            str += String.fromCharCode(b);
        }
        return str;
    }

    set(offset: number, value: string) {
        let i = 0;
        let end = Math.min(this.length, value.length);
        for (; i < end; i++) {
            this.view.setUint16(offset + this.fieldOffset + i * 2, value.charCodeAt(i));
        }
        if (i < this.length) {
            this.view.setUint16(offset + this.fieldOffset + i * 2, 0); // Preenche o próximo byte com 0 (nulo) para terminar a string
        }
        
    }
}

export class Uint8 extends BinaryType<number> {
    view!: DataView;
    size() { return Uint8Array.BYTES_PER_ELEMENT }

    bind(view: DataView, buffer: Buffer): void {
        this.view = view;
    }

    get(offset: number): number {
        return this.view.getUint8(offset + this.fieldOffset);
    }

    set(offset: number, value: number): void {
        this.view.setUint8(offset + this.fieldOffset, value);
    }
}

export class Int32 extends BinaryType<number> {
    view!: DataView;
    size() { return Int32Array.BYTES_PER_ELEMENT }
    bind(view: DataView, buffer: Buffer): void {
        this.view = view;
    }

    get(offset: number): number {
        return this.view.getInt32(offset + this.fieldOffset, true);
    }
    set(offset: number, value: number): void {
        this.view.setInt32(offset + this.fieldOffset, value, true);
    }
}

export class UInt32 extends BinaryType<number> {
    view!: DataView;
    size() { return Uint32Array.BYTES_PER_ELEMENT }
    bind(view: DataView, buffer: Buffer): void {
        this.view = view;
    }

    get(offset: number): number {
        return this.view.getUint32(offset + this.fieldOffset, true);
    }
    set(offset: number, value: number): void {
        this.view.setUint32(offset + this.fieldOffset, value, true);
    }
}

export class Float32 extends BinaryType<number> {
    view!: DataView;
    size() { return Float32Array.BYTES_PER_ELEMENT }

    bind(view: DataView, buffer: Buffer): void {
        this.view = view;
    }

    get(offset: number): number {
        return this.view.getFloat32(offset + this.fieldOffset, true);
    }

    set(offset: number, value: number): void {
        this.view.setFloat32(offset + this.fieldOffset, value, true);
    }
}

export class Float64 extends BinaryType<number> {
    view!: DataView;
    size() { return Float64Array.BYTES_PER_ELEMENT }

    bind(view: DataView, buffer: Buffer): void {
        this.view = view;
    }

    get(offset: number): number {
        return this.view.getFloat64(offset + this.fieldOffset, true);
    }

    set(offset: number, value: number): void {
        this.view.setFloat64(offset + this.fieldOffset, value, true);
    }
}

export const StructType = {
    uint8: () => new Uint8(),
    uint32: () => new UInt32(),
    int32: () => new Int32(),
    float32: () => new Float32(),
    float64: () => new Float64(),
    string: (length: number) => new FixedString(length),

    array: <T extends (StructSchema | BinaryType<any>)>(length: number, schema: () => T) => {
        const build: Record<number, T> = {};
        for(let i = 0; i < length; i++) {
            build[i] = schema();
        }
        return build;
    }
};

/**
 * Este tipo mágico mapeia um Schema para um objeto de acesso real.
 * Ex: { name: bString } se torna { name: string }
 * Ex: { pos: { x: Float32 } } se torna { pos: { x: number } }
 */
export type StructView<T extends StructSchema> = {
    -readonly [K in keyof T]: T[K] extends BinaryType<infer V>
        ? V
        : T[K] extends StructSchema
            ? StructView<T[K]>
            : never;
};


/**
 * ATENÇÃO
 * O uso abaixo não é performático, porém pode auxiliar a utilização em alguns casos
 * O mais engraçado é que a performance é 8 ou 80, dependendo de como se mede o tempo de execução
 * utilizar com StructView fica entre ser a mesma velocidade que acessar o schema diretamente ou então 5x ~ 10x mais lento.
*/
export function createStructView<T extends StructSchema>(
    schema: T,
    _ref?: { offset: number }
): StructView<T> & { setOffset: (offset: number) => void } {
    const struct = {} as StructView<T> & { setOffset: (offset: number) => void };

    if(!_ref) {
        _ref = { offset: 0 };
        struct.setOffset = (offset: number) => {
            _ref!.offset = offset;
        }
    }

    for (const key in schema) {
        const typeOrSchema = schema[key];

        if (typeOrSchema instanceof BinaryType) {
            Object.defineProperty(struct, key, {
                enumerable: true,
                get: () => typeOrSchema.get(_ref.offset),
                set: (value) => typeOrSchema.set(_ref.offset, value),
            });
        } else if (typeof typeOrSchema === 'object') {
            const result = createStructView(typeOrSchema as StructSchema, _ref);
            Object.defineProperty(struct, key, {
                enumerable: true,
                value: result,
                writable: false, // O objeto aninhado é fixo
            });
        }
    }

    return struct;
}