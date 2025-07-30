import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { graficoTempoExecucao } from "./grafico.js";

graficoTempoExecucao(50_000, 30, 2, [
    {
        name: "Array",
        setup: async (N: number, etapas: number) => {
            let arr = [];

            return (N: number, etapa: number) => {
                for (let i = 0; i < N * etapa; i++) {
                    arr.push(i);
                }
                for (let i = 0; i < N * etapa; i++) {
                    // arr.shift(); // sim isso é lento, não é esse o objetivo do teste
                    arr.pop();
                }
            };
        }
    },
    {
        name: "ArrayQueue",
        setup: async (N: number, etapas: number) => {
            const queue = new ArrayQueue<number>();

            return (N: number, etapa: number) => {
                for(let i = 0; i < N * etapa; i++) {
                    queue.addLast(i);
                }
                for(let i = 0; i < N * etapa; i++) {
                    queue.removeFirst();
                }
            };
        }
    },
]);

