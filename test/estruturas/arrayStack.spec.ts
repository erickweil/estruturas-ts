import { describe, expect, test } from "vitest";
import { ArrayStack } from "../../src/estruturas/arrayStack.js";
import { Stack } from "../../src/interfaces/stack.js";
import { LinkedStack } from "../../src/estruturas/linkedStack.js";
import { ArrayDeque } from "../../src/estruturas/arrayDeque.js";
import { testStack } from "./stackTest.js";

describe("Testes em Pilha", () => {
    test("Testes arrayStack", () => {
        testStack(new ArrayStack<string>());        
    });

    test("Testes linkedStack", () => {
        testStack(new LinkedStack<string>());        
    });

    test("Testes DequeTest", () => {
        testStack(new ArrayDeque<string>());        
    });
});