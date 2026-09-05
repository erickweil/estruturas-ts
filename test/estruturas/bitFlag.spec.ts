import { describe, expect, test } from "vitest";
import { BitFlag32, BitFlagArray, createBitFlag, IBitFlag } from "../../src/estruturas/bitFlag.js";

describe("Testes em BitFlag", () => {
    const testBitFlag = (flags: IBitFlag) => {
        expect(flags.count()).toBe(0);

        // Testa reset com true e false, e verifica se os bits estão corretos
        flags.reset(true);
        for (let i = 0; i < flags.nFlags; i++) {
            expect(flags.get(i)).toBe(true);
        }
        expect(flags.count()).toBe(flags.nFlags);

        flags.reset(false);
        for (let i = 0; i < flags.nFlags; i++) {
            expect(flags.get(i)).toBe(false);
        }
        expect(flags.count()).toBe(0);

        // Testa set e unset para cada bit, verificando o valor e a contagem
        flags.reset(false);
        for (let i = 0; i < flags.nFlags; i++) {
            flags.set(i);
            expect(flags.get(i)).toBe(true);
            expect(flags.count()).toBe(1);

            flags.unset(i);
            expect(flags.get(i)).toBe(false);
            expect(flags.count()).toBe(0);
        }

        // Testa set para múltiplos bits e verifica a contagem
        flags.reset(false);
        for (let i = 0; i < flags.nFlags; i++) {
            if (i % 2 === 0) {
                flags.set(i);
            }
        }
        let expectedCount = Math.ceil(flags.nFlags / 2);
        expect(flags.count()).toBe(expectedCount);
    };

    test("BitFlag: testes para BitFlag32 com diferentes tamanhos", () => {
        for(let i = 1; i <= 33; i++) {
            testBitFlag(createBitFlag(i));
        }

        // Testa o limite de 32 flags para BitFlag32
        expect(() => new BitFlag32(33)).toThrow();
    });

    test("BitFlag: testes para BitFlagArray com diferentes tamanhos", () => {
        testBitFlag(new BitFlagArray(32));
        testBitFlag(new BitFlagArray(64));
        testBitFlag(new BitFlagArray(128));

        // Testa valores quebrados para garantir que a implementação funcione mesmo com números de flags que não são múltiplos de 32
        // 1, 18, 35, 52, 69, 86, 103, 120, 137, 154, 171, 188, 205, 222, 239, 256
        for(let i = 1; i <= 256; i += 17) {
            testBitFlag(new BitFlagArray(i));
        }
    });

    test.each([32,64])("Utilização aleatória", (quantosBit) => {
        const bit = createBitFlag(quantosBit);
        let count = 0;
        for(let i = 0; i < 100; i++) {
            const indice = Math.floor(Math.random() * quantosBit);
            const valor = bit.get(indice);
            if(valor) {
                bit.unset(indice);
                count--;
            } else {
                bit.set(indice);
                count++;
            }
            expect(bit.get(indice)).toBe(!valor);
            expect(bit.count()).toBe(count);
        }
    });
});