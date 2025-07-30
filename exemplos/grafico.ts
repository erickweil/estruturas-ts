import * as asciichart from 'asciichart';

type BenchTest = {
    name: string;
    setup: (N: number, etapas: number) => Promise<((N: number, etapa: number) => void) | ((N: number, etapa: number) => Promise<void>)>;
    run?: ((N: number, etapa: number) => void | Promise<void>)[];
};

function iniciarMedicao(): bigint {
    return process.hrtime.bigint();
}

function getMedicao(inicio: bigint) {
    let fim = process.hrtime.bigint();
    let ms = (fim - inicio) / BigInt(1000);
    return Number(ms) / 1000;
}

export async function graficoTempoExecucao(N: number, etapas: number, repeticoes: number, tests: BenchTest[]) {
    console.log("Iniciando benchmark...");

    // 1. Estrutura para armazenar os resultados (tempo em ms) para cada classe
    const results = new Map<string, number[]>();
    for (const test of tests) {
        test.run = [];
        for(let i = 0; i < repeticoes; i++) {
            test.run.push(await test.setup(N, etapas));
        }
        results.set(test.name, []);
    }

    // 2. Loop de benchmark para coletar os dados (sem imprimir na tela)
    for (let etapa = 0; etapa < etapas; etapa++) {
        console.log(`\nEtapa Nº ${etapa}/${etapas - 1}`);

        for (const test of tests) {
            const inicio = iniciarMedicao();

            for (let i = 0; i < repeticoes; i++) {
                const result = test.run![i](N, etapa);
                if (result instanceof Promise) {
                    await result;
                }
            }

            const ms = getMedicao(inicio) / repeticoes;

            // warm up
            if(etapa > 2)
            results.get(test.name)?.push(ms);

            // Exibe o tempo de execução para cada implementação
            console.log(`- ${test.name}: ${ms} ms`);
        }
    }

    console.log("\n\nBenchmark concluído. Gerando gráfico...");

    // 3. Prepara os dados e plota o gráfico
    const series = Array.from(results.values());
    const testNames = Array.from(results.keys());
    const colors = [asciichart.green, asciichart.yellow, asciichart.red, asciichart.blue, asciichart.magenta, asciichart.cyan, asciichart.white];

    console.log("Resultados do Benchmark - Tempo de Execução (ms)\n");

    // 4. Imprime uma legenda clara para o gráfico
    console.log("\nLegenda:");
    testNames.forEach((name, index) => {
        console.log(`- ${colors[index]} ${name}`);
    });

    console.log("\nEixo X: Nº da Medição (Carga de Trabalho Crescente)");
    console.log("Eixo Y: Tempo de Execução (ms)");

    console.log(asciichart.plot(series, {
        height: 30, // Altura do gráfico em linhas
        colors: colors.slice(0, testNames.length) // Define cores para cada linha do gráfico
    }));
}