import { describe, expect, test } from "vitest";
import { testQueue } from "./filaTest.js";
import { testDeque } from "./dequeTest.js";
import { PoolList } from "../../src/estruturas/poolList.js";
import { testStack } from "./stackTest.js";
import { testList } from "./listTest.js";
import { StructType } from "../../src/utils/structSchema.js";
import { BufferPool } from "../../src/estruturas/bufferPool.js";

function createStrPoolList(capacity: number) {
    return new PoolList(capacity, 
        StructType.string(10),
        (schema, index) => { return schema.get(index); },
        (schema, index, value) => { schema.set(index, value); }
    )
}

describe("Testes Pool List", () => {
    test("Teste métodos pilha", () => {
        testStack(createStrPoolList(100));
    });
    
    test("Teste médotodos fila", () => {
        testQueue(createStrPoolList(100));
    });

    test("Teste métodos deque", () => {
        testDeque(PoolList.createNumberList(100));
    });

    test("Teste métodos linked list", () => {
        testList(createStrPoolList(100));
    });

    test("Duas listas compartilhando o mesmo BufferPool", () => {
        const pool = new BufferPool(4, {
            value: StructType.int32(),
            next: StructType.int32(),
            prev: StructType.int32(),
        });
        const getT = (schema: ReturnType<typeof StructType.int32>, index: number) => schema.get(index);
        const setT = (schema: ReturnType<typeof StructType.int32>, index: number, value: number) => schema.set(index, value);
        const a = new PoolList(pool, StructType.int32(), getT, setT);
        const b = new PoolList(pool, StructType.int32(), getT, setT);

        for(let i = 0; i < 10; i++) {
            a.addLast(i);
            b.addFirst(i * 10);
        }
        b.removeLast();
        a.removeFirst();

        expect(pool.size()).toBe(18);
        expect([...a]).toEqual([1,2,3,4,5,6,7,8,9]);
        expect([...b]).toEqual([90,80,70,60,50,40,30,20,10]);
    });
});
