import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { Fila } from "../../src/estruturas/fila.js";

describe("Testes em Fila", () => {

    test("Teste inserir e remover", async () => {
        let fila = new Fila<string>(5);

        for(let i = 5; i >= 0; i--) {
            fila.inserir("A");
            fila.inserir("B");
            fila.inserir("C");
        
            expect(fila.remover()).toBe("A");
            expect(fila.remover()).toBe("B");
            expect(fila.remover()).toBe("C");
        }
    });


});
