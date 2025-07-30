import { BufferPool } from "../src/estruturas/bufferPool.js";
import { createStructView, StructType } from "../src/utils/structSchema.js";
import { graficoTempoExecucao } from "./grafico.js";

let counter = 1;
function createPayload(i: number) {
    return (counter++) + i;
    //return Math.random() + i + 1;
}
type Payload = ReturnType<typeof createPayload>;

await graficoTempoExecucao(100_000, 30, 2, [
    {
        name: "Array",
        setup: async (N: number, etapas: number) => {
            const arr: number[] = [];

            return (N: number, etapa: number) => {
                for (let i = N * etapa; i < N * (etapa+1); i++) {
                    arr[i * 2 + 0] = createPayload(i);
                    arr[i * 2 + 1] = createPayload(i);

                    if (arr[i * 2 + 0] <= 0 || arr[i * 2 + 1] <= 0 ) throw new Error("Array não preenchido corretamente");
                }
            };
        },
    },
    {
        name: "PoolBuffer",
        setup: async (N: number, etapas: number) => {
            const pool = new BufferPool(8196, {
                a: StructType.float32(),
                b: StructType.float32()
            });

            return (N: number, etapa: number) => {
                for (let i = N * etapa; i < N * (etapa+1); i++) {
                    const node = pool.allocNode();
                    pool.schema.a.set(node, createPayload(i));
                    pool.schema.b.set(node, createPayload(i));

                    const a = pool.schema.a.get(node);
                    const b = pool.schema.b.get(node);
                    if (a <= 0 || b <= 0) throw new Error("PoolBuffer não preenchido corretamente"+a+", "+b);
                }
            };
        },
    },
    {
        name: "PoolBuffer + StructView",
        setup: async (N: number, etapas: number) => {
            // INVESTIGAR: porquê com apenas 1 repetição, StructView é ok, mas com 2 ou mais repetições fica 10x mais lento?
            const pool = new BufferPool(8196, {
                a: StructType.float32(),
                b: StructType.float32()
            });
            const view = createStructView(pool.schema);

            return (N: number, etapa: number) => {
                for (let i = N * etapa; i < N * (etapa+1); i++) {
                    const node = pool.allocNode();
                    view.setOffset(node);
                    view.a = createPayload(i);
                    view.b = createPayload(i);

                    if (view.a <= 0 || view.b <= 0) throw new Error("PoolBuffer + StructView não preenchido corretamente");
                }
            };
        },
    },
    {
        name: "Float32Array",
        setup: async (N: number, etapas: number) => {
            const arr = new Float32Array(N * etapas * 4 * 2); // 4 bytes por int32

            return (N: number, etapa: number) => {
                for (let i = N * etapa; i < N * (etapa+1); i++) {
                    arr[i * 2 + 0] = createPayload(i);
                    arr[i * 2 + 1] = createPayload(i);

                    if (arr[i * 2 + 0] <= 0 || arr[i * 2 + 1] <= 0 ) throw new Error("Float32Array não preenchido corretamente");
                }
            };
        }
    },
    {
        name: "DataView",
        setup: async (N: number, etapas: number) => {
            const arr = new ArrayBuffer(N * etapas * 4 * 2); // 4 bytes por int32
            const view = new DataView(arr);

            return (N: number, etapa: number) => {
                for (let i = N * etapa; i < N * (etapa+1); i++) {
                    view.setFloat32(i * 4 * 2 + 0, createPayload(i) * 1.0, true);
                    view.setFloat32(i * 4 * 2 + 4, createPayload(i) * 1.0, true);

                    const a = view.getFloat32(i * 4 * 2 + 0, true);
                    const b = view.getFloat32(i * 4 * 2 + 4, true);
                    if (a <= 0 || b <= 0 ) throw new Error("DataView não preenchido corretamente "+a+", "+b);
                }
            };
        }
    }
]);