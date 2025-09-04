import { describe, expect, test } from "vitest";
import { ArrayStack } from "../../src/estruturas/arrayStack.js";
import { LinkedStack } from "../../src/estruturas/linkedStack.js";
import { ArrayQueue } from "../../src/estruturas/arrayQueue.js";
import { ArrayDeque } from "../../src/estruturas/arrayDeque.js";
import { LinkedList } from "../../src/estruturas/linkedList.js";
import { DualStackQueue } from "../../src/estruturas/dualStackQueue.js";
//import { PoolList } from "../../src/estruturas/poolList.js";

describe("Testes método Iterator de cada Estrutura", () => {

    function testIterator(estrutura: Iterable<string>, expected: string[]) {
        let index = 0;
        for (const item of estrutura) {
            expect(item).toBe(expected[index]);
            index++;
        }
        expect(index).toBe(expected.length);
    }

    const inputValues = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    test("ArrayStack", () => {
        const stack = new ArrayStack<string>();
        for(let value of inputValues) {
            stack.push(value);
        }

        testIterator(stack, inputValues.toReversed());
    });

    test("LinkedStack", () => {
        const linkedStack = new LinkedStack<string>();
        for(let value of inputValues) {
            linkedStack.push(value);
        }

        testIterator(linkedStack, inputValues.toReversed());
    });

    test("ArrayQueue", () => {
        const arrayQueue = new ArrayQueue<string>();
        for(let value of inputValues) {
            arrayQueue.addLast(value);
        }

        testIterator(arrayQueue, inputValues);
    });

    test("DualStackQueue", () => {
        {
            const dualStackQueue = new DualStackQueue<string>();
            for(let value of inputValues) {
                dualStackQueue.addLast(value);
            }
            testIterator(dualStackQueue, inputValues);
        }
        
        {
            const dualStackQueue = new DualStackQueue<string>();
            dualStackQueue.addLast("Z");
            for(let value of inputValues.slice(0, inputValues.length - 1)) {
                dualStackQueue.addLast(value);
            }
            expect(dualStackQueue.removeFirst()).toBe("Z");
            dualStackQueue.addLast(inputValues[inputValues.length - 1]);
            
            testIterator(dualStackQueue, inputValues);
        }
    });

    test("ArrayDeque", () => {
        {
            const arrayDeque = new ArrayDeque<string>();
            for(let value of inputValues) {
                arrayDeque.addFirst(value);
            }

            testIterator(arrayDeque, inputValues.toReversed());
        }

        {
            const arrayDeque = new ArrayDeque<string>(inputValues.length+5);
            for(let value of inputValues) {
                arrayDeque.addLast(value);
            }
            for(let value of inputValues) {
                arrayDeque.removeFirst();
                arrayDeque.addLast(value);
            }
            
            testIterator(arrayDeque, inputValues);
        }
    });

    test("LinkedList", () => {
        const linkedList = new LinkedList<string>();
        for(let value of inputValues) {
            linkedList.addLast(value);
        }

        testIterator(linkedList, inputValues);
    });

    /*test("PoolList", () => {
        const linkedList = new PoolList<string>();
        for(let value of inputValues) {
            linkedList.addLast(value);
        }

        testIterator(linkedList, inputValues);
    });*/
});