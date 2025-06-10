import { jest, describe, expect, test, afterAll, beforeAll } from "@jest/globals";
import { ArrayStack } from "../../src/estruturas/arrayStack.js";
import { Stack } from "../../src/interfaces/stack.js";
import { LinkedStack } from "../../src/estruturas/linkedStack.js";
import { DequeTest } from "../../src/interfaces/deque.js";

describe("Testes em Pilha", () => {

    function testStack(pilha: Stack<string>) {
        expect(pilha.isEmpty()).toBe(true);
        expect(pilha.size()).toBe(0);
        expect(pilha.pop()).toBe(undefined);
        expect(pilha.capacity()).toBeGreaterThan(0);

        pilha.push("A");
        pilha.push("B");
        pilha.push("C");

        expect(pilha.size()).toBe(3);
        expect(pilha.isEmpty()).toBe(false);

        expect(pilha.pop()).toBe("C");
        expect(pilha.pop()).toBe("B");
        expect(pilha.pop()).toBe("A");
        expect(pilha.pop()).toBe(undefined);

        expect(pilha.size()).toBe(0);
        expect(pilha.isEmpty()).toBe(true);

        pilha.push("A");
        pilha.push("B");
        pilha.push("C");

        expect(pilha.size()).toBe(3);
        expect(pilha.isEmpty()).toBe(false);

        pilha.clear();

        expect(pilha.size()).toBe(0);
        expect(pilha.isEmpty()).toBe(true);

        pilha.push("A");

        for(let i =0; i < 10; i++) {
            pilha.push("B");
            pilha.push("C");
            pilha.push("D");
            expect(pilha.size()).toBe(4);

            expect(pilha.pop()).toBe("D");
            expect(pilha.pop()).toBe("C");
            expect(pilha.pop()).toBe("B");
            expect(pilha.size()).toBe(1);
        }

        expect(pilha.pop()).toBe("A");

        expect(pilha.size()).toBe(0);
        expect(pilha.isEmpty()).toBe(true);
    }

    test("Testes arrayStack", () => {
        testStack(new ArrayStack<string>());        
    });

    test("Testes linkedStack", () => {
        testStack(new LinkedStack<string>());        
    });

    test("Testes DequeTest", () => {
        testStack(new DequeTest<string>());        
    });
});