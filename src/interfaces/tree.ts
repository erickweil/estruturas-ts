export interface Tree<T> {
    add(value: T): void;
    get(value: T): T | undefined;
    traverseDFS(callback: (value: T) => void): void;
    traverseBFS(callback: (value: T) => void): void;

    isEmpty(): boolean;
    clear(): void;
}