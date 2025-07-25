import * as asciichart from 'asciichart';
import { ArrayDeque } from "../src/estruturas/arrayDeque.js";
import { ArrayQueue } from "../src/estruturas/arrayQueue.js";
import { ArrayStack } from "../src/estruturas/arrayStack.js";
import { DualStackQueue } from "../src/estruturas/dualStackQueue.js";
import { LinkedList } from "../src/estruturas/linkedList.js";
import { LinkedStack } from "../src/estruturas/linkedStack.js";
import { ObjectPool } from "../src/estruturas/objectPool.js";
//import { PoolList } from "../src/estruturas/poolList.js";
import { Deque } from "../src/interfaces/deque.js";
import { List } from "../src/interfaces/list.js";
import { Queue } from "../src/interfaces/queue.js";
import { Stack } from "../src/interfaces/stack.js";
const N = 100_000;

interface Bucket {
    value: any;
    next: number; // Índice do próximo nó
};

class PoolQueue<T extends Bucket> implements Queue<T> {
    pool: ObjectPool<T>;
    
    private front: number;
    private rear: number;

    constructor() {
        this.pool = new ObjectPool(() => ({
            next: -1,
            value: -1
        } as T
        ));
        
        this.front = -1; // Índice do primeiro elemento
        this.rear = -1; // Índice do último elemento
    }
    
    addLast(valor: T): void {
        const [node, index] = this.pool.allocNode();
        node.value = valor;
        node.next = -1; // Inicialmente não aponta para nenhum próximo

        if (this.rear === -1) {
            // Se a fila está vazia, o primeiro elemento é o front e rear
            this.front = index;
            this.rear = index;
        } else {
            // Caso contrário, adiciona ao final da fila
            const rearNode = this.pool.get(this.rear)!;
            rearNode.next = index; // O próximo do antigo rear será o novo nó
            this.rear = index; // Atualiza o rear para o novo nó
        }
    }

    removeFirst(): T | undefined {
        if (this.front === -1) return undefined; // Fila vazia

        const node = this.pool.freeNode(this.front)!;
        const value = node.value;

        if (node.next === -1) {
            // Se não há próximo, a fila ficará vazia
            this.front = -1;
            this.rear = -1;
        } else {
            // Move o front para o próximo nó
            this.front = node.next;
        }
        return value;
    }

    // push(v: any): void {
    //     const [node, index] = this.pool.allocNode();
    //     node.value = v;
    //     node.next = this.top; // O próximo será o antigo topo
        
    //     this.top = index;
    // }
    // pop(): T | undefined {
    //     if (this.top === -1) return undefined;

    //     const node = this.pool.freeNode(this.top)!;
    //     this.top = node.next!;

    //     return node as T;
    // }
    peekFirst(): T | undefined {
        throw new Error("Method not implemented.");
    }
    isEmpty(): boolean {
        throw new Error("Method not implemented.");
    }
    clear(): void {
        this.pool.clear();
        this.front = -1;
        this.rear = -1;
    }
    size(): number {
        return this.pool.size();
    }
    capacity(): number {
        throw new Error("Method not implemented.");
    }

    // for of
    *[Symbol.iterator](): IterableIterator<T> {
        let currentIndex = this.front;
        while (currentIndex !== -1) {
            const node = this.pool.get(currentIndex);
            if (node) {
                yield node;
                currentIndex = node.next; // Move para o próximo nó
            } else {
                break; // Se não houver mais nós, sai do loop
            }
        }
    }
}

function criarListas(): Queue<unknown>[] {
    return [
        new ArrayQueue(),
        new LinkedList(),
        new PoolQueue()
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
    // for(let iter = 0; iter < WARMUP_SIZE; iter++) {
    //     list.addLast(list.removeFirst());
    // }

    //for (let iter = 0; iter < medicao; iter++) {
        for(let elem of (list as any)) {
            if(!elem) {
                throw new Error("Elemento inválido na lista");
            }
        }
    //}
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
    const queueImplementations = criarListas();

    // Inicializa o Map com o nome de cada implementação de fila
    for (const list of queueImplementations) {
        results.set(list.constructor.name, []);
    }

    const MAX_MEDICOES = 100;

    // 2. Loop de benchmark para coletar os dados (sem imprimir na tela)
    for (let medicoes = 1; medicoes < MAX_MEDICOES; medicoes++) {
        // Exibe o progresso para o usuário não achar que o programa travou
        console.log(`Executando medição Nº ${medicoes}/${MAX_MEDICOES - 1}`);

        const lists = criarListas(); // Recria as listas para um teste justo
        for (const lista of lists) {
            const className = lista.constructor.name;

            const inicio = iniciarMedicao();
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
            asciichart.red,   // LinkedList
            asciichart.blue,  // PoolQueue
        ]
    };

    //console.clear(); // Limpa o terminal para exibir o gráfico
    console.log("Resultados do Benchmark - Tempo de Execução (ms)\n");

    // 4. Imprime uma legenda clara para o gráfico
    console.log("\nLegenda:");
    console.log("ArrayQueue: Verde");
    console.log("LinkedList: Vermelho");
    console.log("PoolQueue: Azul");
    console.log("\nEixo X: Nº da Medição (Carga de Trabalho Crescente)");
    console.log("Eixo Y: Tempo de Execução (ms)");

    console.log(asciichart.plot(series, config));
}
await runBenchmarkAndChart();