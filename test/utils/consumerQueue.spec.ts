import { beforeEach, describe, expect, test } from "vitest";
import { ConsumerQueue } from "../../src/utils/consumerQueue.js";

describe("ConsumerArrayQueue", () => {
    let consumerArrayQueue: ConsumerQueue<number>;

    beforeEach(() => {
        consumerArrayQueue = new ConsumerQueue();
    });

    test("Testar fila de promessas manualmente chamando .next()", async () => {
        let promessaTerminou = false;
        let promessa = consumerArrayQueue.next();
        promessa.then(() => {
            promessaTerminou = true;
        });

        expect(promessa).toBeInstanceOf(Promise);
        expect(promessaTerminou).toBe(false);
        expect(consumerArrayQueue.isClosed).toBe(false);

        consumerArrayQueue.push(33);

        const resultadoPromessa = await promessa;
        expect(resultadoPromessa).toBe(33);
        expect(promessaTerminou).toBe(true);
        expect(consumerArrayQueue.isClosed).toBe(false);

        promessaTerminou = false;
        let promessa2 = consumerArrayQueue.next();
        promessa2.then(() => {
            promessaTerminou = true;
        });

        consumerArrayQueue.close();
        expect(consumerArrayQueue.isClosed).toBe(true);
        const resultadoPromessa2 = await promessa2;
        expect(resultadoPromessa2).toBe(null);
        expect(promessaTerminou).toBe(true);

        // Deve dar erro ao tentar adicionar depois de fechar
        expect(() => {
            consumerArrayQueue.push(1);
        }).toThrow();
    });


    test("Testar foreach na fila de promessas", async () => {
        let ultimoValor = -1;
        const promessaForEach = consumerArrayQueue.foreach(async (valor) => {
            // Deve ser chamado em ordem
            expect(valor !== null && valor !== undefined && Number.isInteger(valor)).toBeTruthy();
            expect(valor).toBe(ultimoValor + 1);

            // Espera um tempo aleatório para simular processamento
            await new Promise((resolve) => setTimeout(resolve, Math.floor((5 * Math.random())+1)));

            // Garante que não houve execução concorrente
            expect(valor).toBe(ultimoValor + 1);

            ultimoValor = valor!;
        });
        
        // Adiciona valores na fila, sem esperar
        for(let i = 0; i < 100; i++) {
            consumerArrayQueue.push(i);
        }
        consumerArrayQueue.close();

        // Espera o foreach terminar
        await promessaForEach;

        // Garante que o último valor contou direito
        expect(ultimoValor).toBe(99);
    });
});

/**
 * Cria uma promessa que só resolve quando alguém chamar .resolve(), para
 * controlar exatamente quando o processamento assíncrono termina
 */
function promessaControlada() {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => { resolve = r; });
    return { promise, resolve };
}

/** Deixa o event loop rodar, para dar chance de qualquer promessa pendente resolver */
function esperarUmPouco(ms: number = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("ConsumerQueue.size", () => {
    let fila: ConsumerQueue<number>;

    beforeEach(() => {
        fila = new ConsumerQueue();
    });

    test("Fila recém criada não tem nada pendente", () => {
        expect(fila.size()).toBe(0);
    });

    test("push aumenta e next() diminui a quantidade pendente", async () => {
        fila.push(1, 2, 3);
        expect(fila.size()).toBe(3);

        expect(await fila.next()).toBe(1);
        expect(fila.size()).toBe(2);

        expect(await fila.next()).toBe(2);
        expect(await fila.next()).toBe(3);
        expect(fila.size()).toBe(0);
    });

    test("O marcador de fim de fila não conta como item pendente", async () => {
        fila.push(1);
        fila.close();
        // O null adicionado pelo close() não entra na contagem
        expect(fila.size()).toBe(1);

        expect(await fila.next()).toBe(1);
        expect(fila.size()).toBe(0);

        // Consumir o marcador não pode deixar a contagem negativa
        expect(await fila.next()).toBe(null);
        expect(fila.size()).toBe(0);
        await expect(fila.onIdle()).resolves.toBeUndefined();
    });

    test("Item já retirado da fila mas ainda não entregue continua contando", async () => {
        // next() fica esperando com a fila vazia
        const promessa = fila.next();

        // O push retira o item da fila na hora, mas quem pediu só recebe depois
        fila.push(7);
        expect(fila.size()).toBe(1);

        expect(await promessa).toBe(7);
        expect(fila.size()).toBe(0);
    });

    test("size() conta os itens pendentes, incluindo o que está sendo processado pelo foreach", async () => {
        // Um portão por item, para liberar o processamento um de cada vez
        const portoes = [promessaControlada(), promessaControlada(), promessaControlada()];
        const processados: number[] = [];

        const promessaForEach = fila.foreach(async (valor) => {
            await portoes[valor].promise;
            processados.push(valor);
        });

        fila.push(0, 1, 2);
        expect(fila.size()).toBe(3);

        // O item 0 saiu da fila mas ainda está sendo processado, então continua contando
        await esperarUmPouco(0);
        expect(fila.size()).toBe(3);
        expect(processados).toEqual([]);

        portoes[0].resolve();
        await esperarUmPouco(0);
        expect(fila.size()).toBe(2);
        expect(processados).toEqual([0]);

        portoes[1].resolve();
        await esperarUmPouco(0);
        expect(fila.size()).toBe(1);

        portoes[2].resolve();
        await esperarUmPouco(0);
        expect(fila.size()).toBe(0);
        expect(processados).toEqual([0, 1, 2]);

        fila.close();
        expect(fila.size()).toBe(0);
        await promessaForEach;
        expect(fila.size()).toBe(0);
    });
});

describe("ConsumerQueue.onIdle", () => {
    let fila: ConsumerQueue<number>;

    beforeEach(() => {
        fila = new ConsumerQueue();
    });

    test("Fila recém criada já está ociosa, onIdle resolve imediatamente", async () => {
        expect(fila.size()).toBe(0);

        let resolveu = false;
        const idle = fila.onIdle().then(() => { resolveu = true; });

        await esperarUmPouco(0);
        expect(resolveu).toBe(true);
        await expect(idle).resolves.toBeUndefined();
    });

    test("onIdle resolve quando os itens são consumidos por next() manualmente", async () => {
        fila.push(1, 2);

        let resolveu = false;
        const idle = fila.onIdle().then(() => { resolveu = true; });

        expect(await fila.next()).toBe(1);
        await esperarUmPouco(0);
        // Ainda falta um item
        expect(resolveu).toBe(false);
        expect(fila.size()).toBe(1);

        expect(await fila.next()).toBe(2);
        await idle;
        expect(resolveu).toBe(true);
        expect(fila.size()).toBe(0);
    });

    test("onIdle não resolve enquanto o callback do foreach está processando", async () => {
        const bloqueio = promessaControlada();
        let processados = 0;

        const promessaForEach = fila.foreach(async () => {
            await bloqueio.promise;
            processados++;
        });

        fila.push(42);

        // O item já saiu da fila, mas ainda está pendente por causa do callback
        expect(fila.size()).toBe(1);

        let resolveu = false;
        const idle = fila.onIdle().then(() => { resolveu = true; });

        await esperarUmPouco();
        expect(resolveu).toBe(false);
        expect(processados).toBe(0);

        // Libera o callback
        bloqueio.resolve();
        await idle;

        expect(resolveu).toBe(true);
        expect(processados).toBe(1);
        expect(fila.size()).toBe(0);

        fila.close();
        await promessaForEach;
    });

    test("Vários chamadores simultâneos resolvem juntos", async () => {
        const bloqueio = promessaControlada();
        const promessaForEach = fila.foreach(async () => {
            await bloqueio.promise;
        });

        fila.push(1, 2, 3);
        expect(fila.size()).toBe(3);

        const resolvidos: boolean[] = [false, false, false];
        const esperas = resolvidos.map((_, i) => fila.onIdle().then(() => {
            // Quando resolver, nada mais pode estar pendente
            expect(fila.size()).toBe(0);
            resolvidos[i] = true;
        }));

        await esperarUmPouco();
        expect(resolvidos).toEqual([false, false, false]);

        bloqueio.resolve();
        await Promise.all(esperas);
        expect(resolvidos).toEqual([true, true, true]);

        // Depois de ociosa, novas chamadas resolvem na hora
        await expect(fila.onIdle()).resolves.toBeUndefined();

        fila.close();
        await promessaForEach;
    });

    test("Chamadores que chegam em momentos diferentes resolvem todos no fim", async () => {
        const portoes = [promessaControlada(), promessaControlada()];
        const promessaForEach = fila.foreach(async (valor) => {
            await portoes[valor].promise;
        });

        fila.push(0, 1);

        // Primeiro chamador entra com 2 itens pendentes
        let resolveu1 = false;
        const idle1 = fila.onIdle().then(() => { resolveu1 = true; });

        portoes[0].resolve();
        await esperarUmPouco(0);
        expect(fila.size()).toBe(1);
        expect(resolveu1).toBe(false);

        // Segundo chamador entra depois, com apenas 1 item pendente
        let resolveu2 = false;
        const idle2 = fila.onIdle().then(() => { resolveu2 = true; });

        await esperarUmPouco(0);
        expect(resolveu1).toBe(false);
        expect(resolveu2).toBe(false);

        portoes[1].resolve();
        await Promise.all([idle1, idle2]);
        expect(resolveu1).toBe(true);
        expect(resolveu2).toBe(true);

        fila.close();
        await promessaForEach;
    });

    test("Depois de resolver, um novo ciclo de espera funciona de novo", async () => {
        fila.push(1);
        const idle1 = fila.onIdle();
        expect(await fila.next()).toBe(1);
        await idle1;

        // O ciclo anterior não pode deixar resíduo: a nova espera tem que ficar pendente
        fila.push(2);
        let resolveu = false;
        const idle2 = fila.onIdle().then(() => { resolveu = true; });

        await esperarUmPouco();
        expect(resolveu).toBe(false);

        expect(await fila.next()).toBe(2);
        await idle2;
        expect(resolveu).toBe(true);
    });

    test("onIdle resolve (e não rejeita) quando o callback do foreach lança", async () => {
        const promessaForEach = fila.foreach(async () => {
            throw new Error("falhou no callback");
        });

        fila.push(1);
        expect(fila.size()).toBe(1);

        const idle = fila.onIdle();
        let rejeitou = false;
        idle.catch(() => { rejeitou = true; });

        await expect(promessaForEach).rejects.toThrow("falhou no callback");
        await expect(idle).resolves.toBeUndefined();

        expect(rejeitou).toBe(false);
        expect(fila.size()).toBe(0);
    });

    test("Se o foreach morreu com itens ainda na fila, eles continuam pendentes", async () => {
        const promessaForEach = fila.foreach(async () => {
            throw new Error("falhou no primeiro item");
        });

        fila.push(1, 2, 3);
        await expect(promessaForEach).rejects.toThrow("falhou no primeiro item");

        // Sobraram 2 itens sem ninguém para consumir
        expect(fila.size()).toBe(2);

        const marcador = Symbol("timeout");
        const resultado = await Promise.race([
            fila.onIdle(),
            esperarUmPouco().then(() => marcador)
        ]);
        expect(resultado).toBe(marcador);

        // Consumindo o que sobrou na mão, a fila fica ociosa de novo
        expect(await fila.next()).toBe(2);
        expect(await fila.next()).toBe(3);
        await expect(fila.onIdle()).resolves.toBeUndefined();
    });

    test("onIdle resolve depois que o foreach processa todos os itens", async () => {
        let processados = 0;
        const promessaForEach = fila.foreach(async () => {
            await new Promise((resolve) => setTimeout(resolve, Math.floor(3 * Math.random()) + 1));
            processados++;
        });

        for(let i = 0; i < 50; i++) {
            fila.push(i);
        }
        expect(fila.size()).toBe(50);

        await fila.onIdle();
        expect(processados).toBe(50);
        expect(fila.size()).toBe(0);

        // A fila continua utilizável depois de ficar ociosa
        fila.push(100, 101);
        expect(fila.size()).toBe(2);

        await fila.onIdle();
        expect(processados).toBe(52);
        expect(fila.size()).toBe(0);

        fila.close();
        await promessaForEach;
    });

    test("onIdle espera todos os itens de uma fila alimentada aos poucos", async () => {
        let processados = 0;
        const promessaForEach = fila.foreach(async () => {
            await esperarUmPouco(1);
            processados++;
        });

        // Alimenta a fila em lotes, com pausas no meio
        for(let lote = 0; lote < 5; lote++) {
            fila.push(lote * 2, lote * 2 + 1);
            await esperarUmPouco(1);
        }

        await fila.onIdle();
        expect(processados).toBe(10);
        expect(fila.size()).toBe(0);

        fila.close();
        await promessaForEach;
    });
});
