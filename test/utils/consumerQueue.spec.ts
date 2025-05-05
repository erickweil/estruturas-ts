import { jest, describe, expect, test, beforeEach } from "@jest/globals";
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
