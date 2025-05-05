export interface Queue<T> {
    addLast(valor: T): void;
    removeFirst(): T | undefined;
    peekFirst(): T | undefined;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    capacity(): number;
}