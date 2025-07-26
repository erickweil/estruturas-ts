import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { ObjectPool } from "../../src/estruturas/objectPool.js";
import { BufferPool, bType, StructSchema } from "../../src/estruturas/bufferPool.js";

describe('VecPool', () => {

    test('deve lidar com a lógica de alocação e liberação corretamente', () => {
        const testPoolSchema = {
            value: bType.float32(),
            n: bType.int32(),
        } satisfies StructSchema;

        const pool = new BufferPool(10, testPoolSchema);
        
        const a = pool.allocNode();
        pool.set.value(a, 55);
        pool.set.n(a, 33);

        expect(pool.size()).toBe(1);

        expect(pool.get.value(a)).toBe(55);
        expect(pool.get.n(a)).toBe(33);

        pool.set.value(a, 11);
        expect(pool.get.value(a)).toBe(11);

        // Testa a reutilização de nós em um loop
        for (let i = 0; i < 5; i++) {
            const n = pool.allocNode();
            pool.set.value(n, i);
            pool.set.n(n, i);

            expect(pool.get.value(n)).toBe(i);
            expect(pool.get.n(n)).toBe(i);

            expect(pool.size()).toBe(2); // +1 para o nó original
            pool.freeNode(n);
        }

        expect(pool.size()).toBe(1); // Deve voltar a 1 após liberar os nós
        expect(pool.get.value(a)).toBe(11);
        expect(pool.get.n(a)).toBe(33);

        pool.clear();
        expect(pool.size()).toBe(0);
    });

    test("Experimentando schemas complexos", () => {
        const testPoolSchema = {
            value: bType.float32(),
            name: bType.string(4),
            meta: {
                version: bType.int32(),
                flags: bType.int8(),
            },            
        } satisfies StructSchema;

        const pool = new BufferPool(10, testPoolSchema);

        for(let i = 0; i < 5; i++) {
            const a = pool.allocNode();
            pool.set.value(a, 55);
            pool.set.meta.version(a, 1);
            pool.set.meta.flags(a, 0b00000001);

            const name = `N ${i}`;
            pool.set.name(a, name);
            
            expect(pool.get.value(a)).toBe(55);
            expect(pool.get.meta.version(a)).toBe(1);
            expect(pool.get.meta.flags(a)).toBe(0b00000001);

            expect(pool.get.name(a)).toBe(name);

            pool.set.name(a, `AAAAAAAAAAAAAAA`);
            expect(pool.get.name(a)).toBe("AAAA"); // Deve truncar para 4 caracteres

            // Não deve permitir sobrescrever o resto
            expect(pool.get.meta.version(a)).toBe(1);
            expect(pool.get.meta.flags(a)).toBe(0b00000001);
        }

        expect(pool.size()).toBe(5);

        pool.clear();
    });
});