export interface Deque<T> {
    addFirst(value: T): void;
    addLast(value: T): void;
    removeFirst(): T | undefined;
    removeLast(): T | undefined;
    peekFirst(): T | undefined;
    peekLast(): T | undefined;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    capacity(): number;
}