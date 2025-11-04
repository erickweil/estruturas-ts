export interface Tree<T> {
    add(value: T): void;
    get(index: number): T | undefined;
    traverseDFS(callback: (value: T) => void): void;

    isEmpty(): boolean;
    clear(): void;
}