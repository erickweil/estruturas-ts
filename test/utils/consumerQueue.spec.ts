import { beforeEach, describe, expect, test } from "vitest";
import { ConsumerQueue } from "../../src/utils/consumerQueue.js";

describe("ConsumerQueue", () => {
    let consumerQueue: ConsumerQueue<number>;

    beforeEach(() => {
        consumerQueue = new ConsumerQueue();
    });

    test("Testar fila de promessas manualmente chamando .next()", async () => {
        let promessionResolvida = false;
        let promessa = consumerQueue.next();
        promessa.then(() => {
            promessionResolvida = true;
        });

        expect(promessa).toBeInstanceOf(Promise);
        expect(promessionResolvida).toBe(false);
        expect(consumerQueue.isClosed).toBe(false);

        consumerQueue.push(33);

        const resultado = await promessa;
        expect(resultado).toBe(33);
        expect(promessionResolvida).toBe(true);
        expect(consumerQueue.isClosed).toBe(false);

        promessionResolvida = false;
        let promessa2 = consumerQueue.next();
        promessa2.then(() => {
            promessionResolvida = true;
        });

        consumerQueue.close();
        expect(consumerQueue.isClosed).toBe(true);
        const resultado2 = await promessa2;
        expect(resultado2).toBe(null);
        expect(promessionResolvida).toBe(true);

        // Deve dar erro ao tentar adicionar depois de fechar
        expect(() => {
            consumerQueue.push(1);
        }).toThrow();
    });

    test("Testar async iterator com for await...of", async () => {
        let ultimoValor = -1;

        // Produtor
        (async () => {
            for (let i = 0; i < 100; i++) {
                consumerQueue.push(i);
            }
            consumerQueue.close();
        })();

        // Consumidor com async iterator
        for await (const valor of consumerQueue) {
            // Deve ser chamado em ordem
            expect(valor !== null && valor !== undefined && Number.isInteger(valor)).toBeTruthy();
            expect(valor).toBe(ultimoValor + 1);

            // Espera um tempo aleatório para simular processamento
            await new Promise((resolve) => setTimeout(resolve, Math.floor((5 * Math.random()) + 1)));

            // Garante que não houve execução concorrente
            expect(valor).toBe(ultimoValor + 1);

            ultimoValor = valor;
        }

        // Garante que o último valor contou direito
        expect(ultimoValor).toBe(99);
    });

    test("Testar próximos elementos resolvidos imediatamente", async () => {
        consumerQueue.push(1, 2, 3);

        const resultado1 = await consumerQueue.next();
        expect(resultado1).toBe(1);

        const resultado2 = await consumerQueue.next();
        expect(resultado2).toBe(2);

        const resultado3 = await consumerQueue.next();
        expect(resultado3).toBe(3);
    });

    test("Testar erro ao tentar push após close", () => {
        consumerQueue.close();
        expect(() => consumerQueue.push(1)).toThrow("Cannot push to a closed ConsumerQueue");
    });
});
