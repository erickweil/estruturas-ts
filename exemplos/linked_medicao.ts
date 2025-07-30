import { LinkedList } from "../src/estruturas/linkedList.js";
import { PoolList } from "../src/estruturas/poolList.js";
import { List } from "../src/interfaces/list.js";
import { graficoTempoExecucao } from "./grafico.js";
const N = 2_000;

function createPayload(i: number) {
    //return [i+1, i+2, i+3];
    return i;

    /*return {
        value: Math.random() * 100,
        arr: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
        name: `N ${i}`,
    };*/
}
type Payload = ReturnType<typeof createPayload>;

function medirAdd(list: List<Payload>, N: number, medicao: number) {
    //list.clear();
    for(let iter = 0; iter < N; iter++) {
        const value = createPayload(iter);
        list.add(value, Math.floor(Math.random() * list.size()));
        
        if(iter % 2 === 0)
        list.remove(Math.floor(Math.random() * list.size()));

        for(let i = 0; i < 5; i++) {
            list.addFirst(list.removeLast() || createPayload(iter));
            list.addLast(list.removeFirst() || createPayload(iter));
        }
        /*
        
        list.addLast(createPayload(iter));
        list.peekFirst();
        if(iter % 2 === 0) {
            list.removeLast();
        }*/
    }
}

graficoTempoExecucao(N, 30, 1, [
    /*{
        name: "ArrayDeque",
        setup: async (N: number, etapas: number) => {
            const list = new ArrayDeque<Payload>(N * (etapas+1));

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        },
    },*/
    /*{
        name: "Array",
        setup: async (N: number, etapas: number) => {
            const list: number[] = [];

            return (N: number, etapa: number) => {
                for(let iter = 0; iter < N; iter++) {
                    / *const value = list[Math.floor(Math.random() * list.length)] || createPayload(iter);
                    list.splice(Math.floor(Math.random() * list.length), 0, value);
                    if(iter % 2 === 0) {
                        list.splice(Math.floor(Math.random() * list.length), 1);
                    }* /

                    for(let i = 0; i < 5; i++) {
                        list.unshift(list.pop() || createPayload(iter));
                        list.push(list.shift() || createPayload(iter));
                    }

                    list.push(createPayload(iter));
                    list[0];
                    if(iter % 2 === 0) {
                        list.pop();
                    }
                }
            };
        },
    },*/
    {
        name: "LinkedList",
        setup: async (N: number, etapas: number) => {
            const list = new LinkedList<Payload>();

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        },
    },
    {
        name: "PoolList",
        setup: async (N: number, etapas: number) => {
            /*const list = new PoolList(N * (etapas+1), 
                {
                    a: bType.int32(),
                    b: bType.int32(),
                    c: bType.int32()
                },
                (pool, index) => { 
                    return [ 
                        pool.get(index, pool.schema.value.a),
                        pool.get(index, pool.schema.value.b),
                        pool.get(index, pool.schema.value.c)
                    ]
                    
                },
                (pool, index, value) => { 
                    pool.set(index, pool.schema.value.a, value[0]); 
                    pool.set(index, pool.schema.value.b, value[1]);
                    pool.set(index, pool.schema.value.c, value[2]);
                }
            )*/
            const list = PoolList.createNumberList(N * (etapas+1));

            return (N: number, etapa: number) => {
                medirAdd(list, N, etapa);
            };
        }
    }
]);
