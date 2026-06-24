import { DualStackQueue } from "../estruturas/dualStackQueue.js";
import { Queue } from "../interfaces/queue.js";


export class ConsumerQueue<T> implements AsyncIterable<T> {
    private resolveNext: (() => void) | undefined;
    private readonly queue: Queue<T | null>;
    private closed: boolean;

    constructor() {
        this.queue = new DualStackQueue<T | null>();
        this.closed = false;
    }

   
    public next(): Promise<T | null> {
        if (!this.queue.isEmpty()) {
            return Promise.resolve(this.queue.removeFirst()!);
        }

        return new Promise((resolve) => {
            this.resolveNext = () => {
                this.resolveNext = undefined;
                resolve(this.queue.removeFirst()!);
            };
        });
    }

   
    public push(...values: T[]): void {
        if (this.closed) {
            throw new Error("Cannot push to a closed ConsumerQueue");
        }

       
        values.forEach(value => this.queue.addLast(value));

    
        if (this.resolveNext) {
            this.resolveNext();
        }
    }

   
    public close(): void {
        this.queue.addLast(null);

        if (this.resolveNext) {
            this.resolveNext();
        }

        this.closed = true;
    }

    
    public get isClosed(): boolean {
        return this.closed;
    }

    
    public [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
            next: async (): Promise<IteratorResult<T>> => {
                const element = await this.next();
                
                if (element === null) {
                    return { done: true, value: undefined };
                }

                return { done: false, value: element };
            }
        };
    }
}
