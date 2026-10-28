import { describe, expect, test } from "vitest";
import { BufferPool } from "../../src/estruturas/bufferPool.js";
import { StructType, StructSchema, createStructView } from "../../src/utils/structSchema.js";

describe('VecPool', () => {

    test('deve lidar com a lógica de alocação e liberação corretamente', () => {
        const pool = new BufferPool(10, {
            value: StructType.float32(),
            n: StructType.int32(),
        });
        const schema = pool.schema;
        
        const a = pool.allocNode();
        schema.value.set(a, 55);
        schema.n.set(a, 33);

        expect(pool.size()).toBe(1);

        expect(schema.value.get(a)).toBe(55);
        expect(schema.n.get(a)).toBe(33);

        schema.value.set(a, 11);
        //schema.value.set(pool, a, 11);
        expect(schema.value.get(a)).toBe(11);

        // Testa a reutilização de nós em um loop
        for (let i = 0; i < 5; i++) {
            const n = pool.allocNode();
            schema.value.set(n, i);
            schema.n.set(n, i);

            expect(schema.value.get(n)).toBe(i);
            expect(schema.n.get(n)).toBe(i);

            expect(pool.size()).toBe(2); // +1 para o nó original
            pool.freeNode(n);
        }

        expect(pool.size()).toBe(1); // Deve voltar a 1 após liberar os nós
        expect(schema.value.get(a)).toBe(11);
        expect(schema.n.get(a)).toBe(33);

        pool.clear();
        expect(pool.size()).toBe(0);

        // Testa redimensionamento do pool
        const nodeIndexes: number[] = [];
        for (let i = 0; i < 50; i++) {
            const n = pool.allocNode();
            schema.value.set(n, 77);
            schema.n.set(n, i);
            nodeIndexes.push(n);

            // Verifica se todos os nós estão alocados corretamente
            for(let [index, node] of nodeIndexes.entries()) {
                expect(schema.value.get(node)).toBe(77);
                expect(schema.n.get(node)).toBe(index);
            }
        }
    });

    test("Experimentando schemas complexos", () => {
        const pool = new BufferPool(10, {
            value: StructType.float32(),
            name: StructType.string(4),
            meta: {
                version: StructType.int32(),
                flags: StructType.int32(),
            },            
        });
        const schema = pool.schema;
        
        const view = createStructView(schema);

        for(let i = 0; i < 5; i++) {
            view.setOffset(pool.allocNode());

            view.value = 55;
            view.meta.version = 1;
            view.meta.flags = 0b00000001;

            const name = `N ${i}`;
            view.name = name;
            
            expect(view.value).toBe(55);
            expect(view.meta.version).toBe(1);
            expect(view.meta.flags).toBe(0b00000001);
            expect(view.name).toBe(name);

            view.name = "AAAA???";
            expect(view.name).toBe("AAAA"); // Deve truncar para 4 caracteres

            view.name = "!@¢ÿ???"; // intervalo ascii
            expect(view.name).toBe("!@¢ÿ");

            view.name = "Яתᨲ곴???"; // intervalo utf-16
            expect(view.name).toBe("Яתᨲ곴");

            view.name = "😁🤣???"; // cada emoji ocupa 2 caracteres utf-16 
            expect(view.name).toBe("😁🤣"); 

            // Não deve permitir sobrescrever o resto
            expect(view.meta.version).toBe(1);
            expect(view.meta.flags).toBe(0b00000001);
        }

        expect(pool.size()).toBe(5);

        pool.clear();
    });

    test("Struct aninhada no meio do schema não deve deixar espaço vazio", () => {
        const pool = new BufferPool(2, {
            a: StructType.int32(),
            b: { c: StructType.int32() },
            d: StructType.int32(),
        });
        expect(pool.stride).toBe(12);
        expect(pool.schema.b.c.fieldOffset).toBe(4);
        expect(pool.schema.d.fieldOffset).toBe(8);
    });

    test("Deve usar toda a capacidade antes de redimensionar", () => {
        const pool = new BufferPool(4, { n: StructType.int32() });
        for(let i = 0; i < 4; i++) {
            pool.allocNode();
        }
        expect(pool.capacity()).toBe(4);
        pool.allocNode();
        expect(pool.capacity()).toBe(8);
    });

    test("Deve funcionar com capacidade inicial 0", () => {
        const pool = new BufferPool(0, { n: StructType.int32() });
        const nodes: number[] = [];
        for(let i = 0; i < 10; i++) {
            const n = pool.allocNode();
            pool.schema.n.set(n, i);
            nodes.push(n);
        }
        for(let i = 0; i < 10; i++) {
            expect(pool.schema.n.get(nodes[i])).toBe(i);
        }
    });
});
