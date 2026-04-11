import { binarySearch } from "../src/algoritmos/busca/binarySearch.js";
import { graficoTempoExecucao } from "./grafico.js";

async function algoLento() {
    return Math.sqrt(Math.random()) - Math.sqrt(Math.random());
}

await graficoTempoExecucao(1000, 50, 2, [
    {
        name: "O(1)",
        setup: async (N: number, etapas: number) => {
            return async (N: number, etapa: number) => {
                await algoLento();
            };
        },
    },
    {
        name: "O(N)",
        setup: async (N: number, etapas: number) => {
            return async (N: number, etapa: number) => {
                for(let i = 0; i < N * etapa; i++) {
                    await algoLento();
                }
            };
        },
    },
    {
        name: "O(N²)",
        setup: async (N: number, etapas: number) => {
            return async (N: number, etapa: number) => {
                for(let i = 0; i < (N * etapa) / 100; i++) {
                    for(let i = 0; i < (N * etapa) / 100; i++) {
                        await algoLento();
                    }
                }
            };
        },
    }
]);