import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { ObjectPool, PoolNode } from "../../src/estruturas/objectPool.js";

interface MyObj extends PoolNode {
    value: string;
}

describe('VecPool', () => {

    test('deve lidar com a lógica de alocação e liberação corretamente', () => {
        const pool = new ObjectPool<MyObj>();
        
        const na = pool.allocNode();
        na.value = "?";
        const a = na._index!;
        expect(pool.size()).toBe(1);

        const obj = pool.get(a)!;
        expect(obj).toMatchObject({ value: "?" });
        
        obj.value = "A";
        expect(pool.get(a)).toMatchObject({ value: "A" });

        // Testa a reutilização de nós em um loop
        for (let i = 0; i < 5; i++) {
            const initialLen = pool.size();

            const nb = pool.allocNode(); nb.value = "B"; const b = nb._index!;
            const nc = pool.allocNode(); nc.value = "C"; const c = nc._index!;
            expect(pool.size()).toBe(initialLen + 2);
            
            expect(pool.get(b)).toMatchObject({ value: "B" });
            expect(pool.get(c)).toMatchObject({ value: "C" });

            expect(pool.freeNode(c)).toMatchObject({ value: "C" });
            expect(pool.freeNode(b)).toMatchObject({ value: "B" });
            
            // O tamanho do pool (elementos ativos) diminui, mas a capacidade do array subjacente não.
            expect(pool.size()).toBe(initialLen);
            
            expect(pool.get(b)).toBeNull();
            expect(pool.get(c)).toBeNull();
        }

        expect(pool.freeNode(a)).toMatchObject({ value: "A" });
        expect(pool.size()).toBe(0);
        expect(pool.get(a)).toBeNull();

        // Tentar liberar um nó já liberado (double free) deve retornar null
        expect(pool.freeNode(a)).toBeNull();
        
        pool.clear();
        expect(pool.size()).toBe(0);
    });
});