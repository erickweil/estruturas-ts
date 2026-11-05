export interface Graph<T> {
    getVertexAt(index: number): T | undefined;
    getNeighbors(index: number): readonly number[];
    size(): number;
}