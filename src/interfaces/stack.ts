export interface Stack<T> {
    push(value: T): void;
    pop(): T | undefined;
    peekLast(): T | undefined;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    capacity(): number;
}