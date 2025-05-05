export interface Queue<T> {
    addLast(valor: T): void;
    removeFirst(): T | null;
    peekFirst(): T | null;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    capacity(): number;
}