import { ArrayDeque } from "../src/estruturas/arrayDeque.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { LinkedList } from "../src/estruturas/linkedList.js";
import { Queue } from "../src/interfaces/queue.js";
import { graficoTempoExecucao } from './grafico.js';
import { PoolList } from '../src/estruturas/poolList.js';

function createPayload(i: number) {
    return i;
    //return [i+1, i+2, i+3];

    /*return {
        value: Math.random() * 100,
        arr: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
        name: `N ${i}`,
    };*/
}
type Payload = ReturnType<typeof createPayload>;

function medirAdd(list: Queue<Payload>, N: number, etapa: number) {
    //list.clear();
    
    // 1. Aquecimento: Preenche a pilha com um número inicial de objetos
    for (let i = 0; i < N; i++) {
        list.addLast(createPayload(i+1));
    }

    // 2. Inverte a ordem dos objetos na lista
    for(let i = 0; i < list.size(); i++) {
       list.addLast(list.removeFirst()!);
    }

    // 3. Atravessa a lista para garantir que os objetos estão acessíveis
    /*for(let elem of (list as any)) {
        if(!elem) {
            throw new Error("Elemento inválido na lista");
        }
    }*/
}

await graficoTempoExecucao(50_000, 30, 2, [
    {
        name: "ArrayDeque",
        setup: async (N: number, etapas: number) => {
            const list = new ArrayDeque<Payload>(N * (etapas + 1));

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        },
    },
    {
        name: "DualStackQueue",
        setup: async (N: number, etapas: number) => {
            console.log("Criando DualStackQueue...");
            const list = new DualStackQueue<Payload>();

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        }
    },
    {
        name: "LinkedPoolList",
        setup: async (N: number, etapas: number) => {
            const list = PoolList.createNumberList(N * (etapas + 1));

            /*let ret = new Array(sz).fill(0);
            const list = new PoolList(N * etapas, bType.array(sz, () => bType.int32()),
                (schema, index) => {
                    //return pool.get(index, pool.schema.value.n);
                    for(let i = 0; i < sz; i++) {
                        ret[i] = schema[i].get(index);
                    }
                    return ret;
                },
                (schema, index, value) => {
                    //pool.set(index, pool.schema.value.n, value);
                    for(let i = 0; i < sz; i++) {
                        schema[i].set(index, value[i]);
                    }
            });*/

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        },
    },
    {
        name: "LinkedList",
        setup: async (N: number, etapas: number) => {
            console.log("Criando LinkedList...");
            const list = new LinkedList<Payload>();

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        },
    },
]);