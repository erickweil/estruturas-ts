export interface List<T> {
    addFirst(value: T): void;
    addLast(value: T): void;
    add(data: T, index: number): void;

    removeFirst(): T | undefined;
    removeLast(): T | undefined;
    remove(index: number): T | undefined;

    peekFirst(): T | undefined;
    peekLast(): T | undefined;
    get(index: number): T | undefined;
    
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    capacity(): number;
}