import { BitFlagArray, BitFlag32, createBitFlag } from "../src/estruturas/bitFlag.js";
import { graficoTempoExecucao } from "./grafico.js";

const BITS = 1024;
/**
 * Compara a performance das operações set, get, count e reset entre:
 *
 * - boolean[]    — array JS nativo (1 referência por flag, ~8 bytes cada)
 * - Uint8Array   — array tipado (1 byte por flag)
 * - BitFlagArray — 1 bit por flag, com SWAR para count() e fill para reset()
 *
 * As estruturas são pré-alocadas no setup para que o tempo de alocação
 * não interfira na medição das operações em si.
 *
 * Eixo X: número de flags operadas (N * etapa)
 * Eixo Y: tempo de execução (ms)
 */
await graficoTempoExecucao(500, 55, 2, [
    {
        name: "boolean[]",
        setup: async (N: number, etapas: number) => {
            const arr = Array.from({ length: N * etapas }, () => new Array(BITS).fill(false));

            return (N: number, etapa: number) => {
                const size = N * etapa;
                if (size === 0) return;

                // set
                for (let i = 0; i < size; i++) {
                    const flags = arr[i];
                    for (let b = 0; b < BITS; b++) {
                        if(Math.random() < 0.5) {
                            flags[b] = !flags[b];
                        }
                    }
                }

                // get
                //for (let i = 0; i < size; i++) { const v = arr[i]; }

                // count (manual — sem método nativo)
                for (let i = 0; i < size; i++) {
                    const flags = arr[i];
                    let count = 0;
                    for (let b = 0; b < BITS; b++) {
                        if (flags[b]) count++;
                    }
                }

                // reset
                //arr.fill(false, 0, size);
            };
        }
    },
    {
        name: "Uint8Array",
        setup: async (N: number, etapas: number) => {
            //const arr = new Uint8Array(N * etapas);
            const arr = Array.from({ length: N * etapas }, () => new Uint8Array(BITS));

            return (N: number, etapa: number) => {
                const size = N * etapa;
                if (size === 0) return;

                // set
                // for (let i = 0; i < size; i++) {
                //     if(Math.random() < 0.5)
                //     arr[i] = arr[i] ? 0 : 1;
                // }

                for (let i = 0; i < size; i++) {
                    const flags = arr[i];
                    for (let b = 0; b < BITS; b++) {
                        if(Math.random() < 0.5) {
                            flags[b] = flags[b] ? 0 : 1;
                        }
                    }
                }

                // get
                //for (let i = 0; i < size; i++) { const v = arr[i]; }

                // count (manual)
                for (let i = 0; i < size; i++) {
                    const flags = arr[i];
                    let count = 0;
                    for (let b = 0; b < BITS; b++) {
                        if (flags[b]) count++;
                    }
                }

                // reset
                //arr.fill(0, 0, size);
            };
        }
    },
    {
        name: "BitFlagArray",
        setup: async (N: number, etapas: number) => {
            const flag = Array.from({ length: N * etapas }, () => createBitFlag(BITS));

            return (N: number, etapa: number) => {
                const size = N * etapa;
                if (size === 0) return;

                // set
                // for (let i = 0; i < size; i++) {
                //     if(Math.random() < 0.5)
                //     {
                //         flag.get(i) ? flag.unset(i) : flag.set(i);
                //     }
                // }

                for (let i = 0; i < size; i++) {
                    const f = flag[i];
                    for (let b = 0; b < BITS; b++) {
                        if(Math.random() < 0.5) {
                            f.get(b) ? f.unset(b) : f.set(b);
                        }
                    }
                }

                // get
                //for (let i = 0; i < size; i++) flag.get(i);

                // count — SWAR (Hamming Weight) sobre os blocos Uint32Array
                for (let i = 0; i < size; i++) {
                    const f = flag[i];
                    let count = f.count();
                }

                // reset — fill(0) sobre o Uint32Array interno
                //flag.reset(false);
            };
        }
    },
]);
