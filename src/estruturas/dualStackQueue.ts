import { Queue } from "../interfaces/queue.js";

/**
 * Adaptado de: https://stackoverflow.com/a/73957258
 *   "How do you implement a Stack and a Queue in JavaScript?"
 *   Oct 5, 2022 at 7:47, njlarsson
 * 
 * Implementação de uma fila O(1) amortized
 * 
 * A FAZER: ver como é em uma biblioteca?
 * - https://www.npmjs.com/package/@js-sdsl/deque (Biblioteca com várias estruturas testadas em performance)
 * - https://www.npmjs.com/package/denque (Utilizado por clientes nodejs de Kafka, MariaDB, MongoDB, Mysql, Redis)
 */
export class DualStackQueue<T> implements Queue<T> {
    private entrada: T[];
    private saida: T[];

    constructor() {
        this.entrada = [];
        this.saida = [];
    }

    // O(1)
    isEmpty(): boolean {
        return this.entrada.length === 0 && this.saida.length === 0;
    }

    // O(1)
    clear(): void {
        this.entrada = [];
        this.saida = [];
    }

    // O(1)
    capacity(): number {
        // Não tem como saber a capacidade, pois é uma fila dinâmica
        return Infinity;
    }

    /**
     * push/enqueue - Adiciona valores na fila
     * O(1)
     */
    addLast(value: T) {
        this.entrada.push(value);
    }

    /**
     * shift/dequeue - Remove e retorna o primeiro valor da fila
     * @returns {any} Retorna o primeiro valor da fila
     * O(N)
     */
    removeFirst(): T | undefined {
        if(this.saida.length === 0) {
            if(this.entrada.length === 0) {
                // Se não tiver nada na fila, retorna undefined
                return undefined;
            }
            // Inverte a ordem dos elementos
            while(this.entrada.length > 0) {
                this.saida.push(this.entrada.pop()!);
            }
        }

        return this.saida.pop();
    }

    // O(1)
    peekFirst(): T | undefined {
        if(this.saida.length === 0) {
            if(this.entrada.length === 0) {
                // Se não tiver nada na fila, retorna null
                return undefined;
            }
            
            // Já que inverte a ordem dos elementos, pega o primeiro da entrada
            return this.entrada[0];
        }
        
        // Pega o último da saída
        return this.saida[this.saida.length - 1];
    }

    // O(1)
    size() {
        return this.entrada.length + this.saida.length;
    }
}