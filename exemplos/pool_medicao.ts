import * as asciichart from 'asciichart';
import { ArrayDeque } from "../src/estruturas/arrayDeque.js";
import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { ArrayStack } from "../src/estruturas/arrayStack.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { LinkedList } from "../src/estruturas/linkedList.js";
import { LinkedStack } from "../src/estruturas/linkedStack.js";
import { ObjectPool, PoolNode } from "../src/estruturas/objectPool2.js";
//import { PoolList } from "../src/estruturas/poolList.js";
import { Deque } from "../src/interfaces/deque.js";
import { List } from "../src/interfaces/list.js";
import { Queue } from "../src/interfaces/queue.js";
import { Stack } from "../src/interfaces/stack.js";
import { NumberPoolQueue } from '../src/estruturas/numberPool.js';
import { BufferPoolQueue } from '../src/estruturas/bufferPool.js';
const N = 100_000;

function criarListas(capacity: number): Queue<unknown>[] {
    return [
        new ArrayQueue(capacity),
        new BufferPoolQueue(capacity),
        new NumberPoolQueue(capacity),
        new LinkedList(),
    ]
}

function iniciarMedicao(): bigint {
    return process.hrtime.bigint();
}

function printMedicao(inicio: bigint, mensagem: string) {
    let fim = process.hrtime.bigint();
    let ms = (fim - inicio) / BigInt(1000000);
    console.log(`${mensagem}${ms}`);
}

function createPayload(i: number) {
    /*return {
        id: i,
        value: Math.random() * 100,
    };*/
    return i;
}

function medirAdd(list: Queue<any>, medicao: number) {
    list.clear();
    const WARMUP_SIZE = N * medicao;
    
    // 1. Aquecimento: Preenche a pilha com um número inicial de objetos
    for (let i = 0; i < WARMUP_SIZE; i++) {
        list.addLast(createPayload(i+1));
    }

    // // 2. Medição: Adiciona e remove elementos repetidamente, sem alterar o tamanho da fila
    for(let iter = 0; iter < WARMUP_SIZE; iter++) {
        list.addLast(list.removeFirst());
    }

    // 3. Atravessa a lista para garantir que os objetos estão acessíveis
    /*//for (let iter = 0; iter < medicao; iter++) {
        for(let elem of (list as any)) {
            if(!elem) {
                throw new Error("Elemento inválido na lista");
            }
        }
    //}*/
}

/*
for(let medicoes = 1; medicoes < 20; medicoes++) {
    let lists = criarListas();
    console.log();
    console.log("Medição Nº",medicoes);
    for(let [n, lista] of lists.entries()) {
        let inicio = iniciarMedicao();
        medirAdd(lista as any, medicoes);
        //printMedicao(inicio,`${medicoes} Nº elementos: ${fila.size()} Tempo:`);
        printMedicao(inicio,`Lista Nº ${n} (${(lista as Object).constructor.name}), Tempo:`);
    }
}*/

async function runBenchmarkAndChart() {
    console.log("Iniciando benchmark...");

    // 1. Estrutura para armazenar os resultados (tempo em ms) para cada classe
    const results = new Map<string, number[]>();
    const queueImplementations = criarListas(N);

    // Inicializa o Map com o nome de cada implementação de fila
    for (const list of queueImplementations) {
        results.set(list.constructor.name, []);
    }

    const MAX_MEDICOES = 20;

    // 2. Loop de benchmark para coletar os dados (sem imprimir na tela)
    for (let medicoes = 1; medicoes < MAX_MEDICOES; medicoes++) {
        // Exibe o progresso para o usuário não achar que o programa travou
        console.log(`Executando medição Nº ${medicoes}/${MAX_MEDICOES - 1}`);

        const lists = criarListas(N * medicoes); // Recria as listas para um teste justo
        for (const lista of lists) {
            const className = lista.constructor.name;

            const inicio = iniciarMedicao();
            medirAdd(lista as any, medicoes);
            medirAdd(lista as any, medicoes);
            const fim = process.hrtime.bigint();

            // Converte para número e armazena o resultado
            const ms = Number((fim - inicio) / BigInt(1000000));
            results.get(className)?.push(ms);

            // Exibe o tempo de execução para cada implementação
            console.log(`Lista: ${className}, Tempo: ${ms} ms`);
        }
    }

    console.log("\n\nBenchmark concluído. Gerando gráfico...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pequena pausa para o usuário ler

    // 3. Prepara os dados e plota o gráfico
    const series = Array.from(results.values());
    const classNames = Array.from(results.keys());

    const config = {
        height: 30, // Altura do gráfico em linhas
        colors: [   // Define cores para cada linha do gráfico
            asciichart.green, // ArrayQueue
            asciichart.yellow, // BufferPoolQueue
            asciichart.blue,  // PoolQueue
            asciichart.red,   // LinkedList
        ]
    };

    //console.clear(); // Limpa o terminal para exibir o gráfico
    console.log("Resultados do Benchmark - Tempo de Execução (ms)\n");

    // 4. Imprime uma legenda clara para o gráfico
    console.log("\nLegenda:");
    console.log("ArrayQueue: Verde");
    console.log("BufferPoolQueue: Amarelo");
    console.log("PoolQueue: Azul");
    console.log("LinkedList: Vermelho");

    console.log("\nEixo X: Nº da Medição (Carga de Trabalho Crescente)");
    console.log("Eixo Y: Tempo de Execução (ms)");

    console.log(asciichart.plot(series, config));
}
await runBenchmarkAndChart();