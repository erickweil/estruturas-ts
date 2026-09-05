import { describe, expect, test } from "vitest";
import { HashSet } from "../../src/estruturas/hashSet.js";

describe("Testes em HashSet", () => {
    test("HashSet: Testes padrão", () => {
        const set = new HashSet(100);

        set.add("A");
        set.add("A");
        set.add("B");
        set.add("C");

        expect(set.has("A")).toBe(true);
        expect(set.has("B")).toBe(true);
        expect(set.has("C")).toBe(true);
        expect(set.has("D")).toBe(false);

        let letras: string[] = [];
        set.forEach((valor) => {
            letras.push(valor);
        });
        expect(letras.length).toBe(3);
        letras.sort();
        expect(letras).toEqual(["A", "B", "C"]);

        expect(set.delete("C")).toBe(true);
        expect(set.delete("C")).toBe(false);
        expect(set.has("A")).toBe(true);
        expect(set.has("B")).toBe(true);
        expect(set.has("C")).toBe(false);


        set.add("C");
        expect(set.has("C")).toBe(true);


        set.clear();
        expect(set.has("A")).toBe(false);
        expect(set.has("B")).toBe(false);
        expect(set.has("C")).toBe(false);
    });

    test("HashSet: Testes vários valores, colisão", () => {
        const set = new HashSet(100);

        // Tem que ter 1 espaço vazio
        for(let i = 0; i < 99; i++) {
            let valor = ""+(i * 81);
            expect(set.has(valor)).toBe(false);
            set.add(valor);
            expect(set.has(valor)).toBe(true);
        }

        for(let i = 0; i < 99; i++) {
            let valor = ""+(i * 81);
            console.log(valor, set);
            expect(set.has(valor)).toBe(true);
            expect(set.delete(valor)).toBe(true);
            expect(set.delete(valor)).toBe(false);
            expect(set.has(valor)).toBe(false);
        }

        set.forEach(() => {
            throw new Error("Não deveria ter nada aqui");
        });
    });
});