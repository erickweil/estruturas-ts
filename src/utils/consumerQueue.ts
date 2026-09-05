import { DualStackQueue } from "../estruturas/dualStackQueue.js";
import { Queue } from "../interfaces/queue.js";

/**
 * Esta classe implementa uma fila de consumo, onde os elementos podem ser adicionados e consumidos de forma assíncrona.
 * 
 * Obs: deve ter apenas 1 consumidor por vez chamando next() OU foreach(), caso contrário vai lançar um erro e/ou comportamento inesperado.
 */
export class ConsumerQueue<T> {
    private resolveNext: (() => void) | undefined;
    private queue: Queue<T | null>;
    public isClosed: boolean;

    /** Quantidade de itens que ainda estão na fila aguardando ou ainda sendo processados */
    private waitingCount: number;
    /** Quem está esperando a fila ficar ociosa */
    private idleWaiter?: () => void;

    constructor() {
        this.resolveNext = undefined;
        this.queue = new DualStackQueue<T | null>();
        this.isClosed = false;

        this.waitingCount = 0;
        this.idleWaiter = undefined;
    }

    /**
     * Retorna a quantidade de itens que ainda estão na fila aguardando ou ainda sendo processados
     */
    size(): number {
        return this.waitingCount;
    }

    /**
     * Retorna uma promessa que resolve quando não houver mais nada pendente na fila.
     * - Se já estiver ociosa no momento da chamada, a promessa já vem resolvida
     * - Vários chamadores podem esperar ao mesmo tempo, todos resolvem juntos
     * - Nunca rejeita, mesmo que o callback do foreach lance um erro
     */
    onIdle(): Promise<void> {
        if(this.waitingCount === 0) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            if(this.idleWaiter) {
                // Se já tiver alguém esperando, adiciona na lista de quem está esperando
                const oldWaiter = this.idleWaiter;
                this.idleWaiter = () => {
                    oldWaiter();
                    resolve();
                };
            } else {
                this.idleWaiter = resolve;
            }
        });
    }

    private notifyIdle() {
        if(this.waitingCount === 0 && this.idleWaiter) {
            const waiter = this.idleWaiter;
            this.idleWaiter = undefined;
            waiter();
        }
    }

    private _next(): Promise<T | null> {
        if(!this.queue.isEmpty()) {
            // Se tiver linha na fila, retorna ela imediatamente
            return Promise.resolve(this.queue.removeFirst()!);
        } else {
            // Se não tiver linha na fila, retorna uma Promise que só vai resolver quando tiver linha pronta para ser lida
            return new Promise((resolve) => {
                if(this.resolveNext) {
                    throw new Error("Já existe um consumidor esperando a próxima linha");
                }
                this.resolveNext = () => {
                    this.resolveNext = undefined;
                    resolve(this.queue.removeFirst()!);
                };
            });
        }
    }

    /**
     * Esta função serve para consumir as linhas
     * O funcionamento é o seguinte:
     * - Se tiver linha na fila, retorna ela um Promise já resolvida com a linha imediatamente
     * - Se não tiver linha na fila, vai ficar 'esperando' o evento de uma nova linha, e então resolve a Promise quando tiver linha pronta
     */
    async next(): Promise<T | null> {
        const value = await this._next();
        if(value !== null) {
            this.waitingCount--;
            this.notifyIdle();
        }

        return value;
    }

    push(...values: T[]) {
        if(this.isClosed) {
            throw new Error("Consumer was already closed");
        }

        for(let v of values) {
            this.queue.addLast(v);
            this.waitingCount++;
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
            let element = await this._next();

            // Se acabou a fila e estiver fechado, para o loop
            if(element === null) {
                break;
            }

            try {
                await callback(element);
            } finally {
                // Mesmo que o callback lance, o item deixa de estar pendente
                this.waitingCount--;
                this.notifyIdle();
            }
        }        
    }
}
