import { ArrayQueue } from "../estruturas/arrayQueue.js";
import { DualStackQueue } from "../estruturas/dualStackQueue.js";
import { Queue } from "../interfaces/queue.js";

export class ConsumerQueue<T> {
    private resolveNext: (() => void) | undefined;
    private queue: Queue<T | null>;
    public isClosed: boolean;

    constructor() {
        this.resolveNext = undefined;
        this.queue = new DualStackQueue<T | null>();
        this.isClosed = false;
    }

    /**
     * Esta função serve para consumir as linhas
     * O funcionamento é o seguinte:
     * - Se tiver linha na fila, retorna ela um Promise já resolvida com a linha imediatamente
     * - Se não tiver linha na fila, vai ficar 'esperando' o evento de uma nova linha, e então resolve a Promise quando tiver linha pronta
     */
    next(): Promise<T | null> {
        if(!this.queue.isEmpty()) {
            // Se tiver linha na fila, retorna ela imediatamente
            return Promise.resolve(this.queue.removeFirst()!);
        } else {
            // Se não tiver linha na fila, retorna uma Promise que só vai resolver quando tiver linha pronta para ser lida
            return new Promise((resolve) => {
                this.resolveNext = () => {
                    this.resolveNext = undefined;
                    resolve(this.queue.removeFirst()!);
                };
            });
        }
    }

    push(...values: T[]) {
        if(this.isClosed) {
            throw new Error("Consumer was already closed");
        }

        for(let v of values) {
            this.queue.addLast(v);
        }

        if(this.resolveNext) {
            this.resolveNext();
        }
    }

    close() {
        // Para indicar o fim da fila, adiciona um elemento nulo
        this.queue.addLast(null);

        if(this.resolveNext) {
            this.resolveNext();
        }

        this.isClosed = true;
    }

    // Mudar para async iterator?
    async foreach(callback: (elem: T) => any) {
        while(true) {
            let element = await this.next();

            // Se acabou a fila e estiver fechado, para o loop
            if(element === null) {
                break;
            }

            await callback(element);
        }
    }
}
