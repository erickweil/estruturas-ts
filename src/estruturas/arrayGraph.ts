import { Graph } from "../interfaces/graph.js";

class Vertex<T> {
    constructor(
        public value: T,
        public neighbors: number[] = []
    ) {}
}

export class ArrayGraph<T> implements Graph<T> {
    vertices: Map<number, Vertex<T>>;
    private nextId: number;

    constructor() {
        this.vertices = new Map<number, Vertex<T>>();
        this.nextId = 0;
    }

    addVertex(value: T): number {
        let id = this.nextId++;
        this.vertices.set(id, new Vertex(value));
        return id;
    }

    connectVertices(a: number, b: number, directed: boolean = false): void {
        const vertexA = this.vertices.get(a);
        const vertexB = this.vertices.get(b);

        if(!vertexA || !vertexB) {
            throw new Error("One or both vertices not found");
        }

        vertexA.neighbors.push(b);
        if(!directed) {
            vertexB.neighbors.push(a);
        }
    }

    getVertexAt(index: number): T | undefined {
        const vertex = this.vertices.get(index);
        return vertex ? vertex.value : undefined;
    }

    getNeighbors(index: number): readonly number[] {
        const vertex = this.vertices.get(index);
        if(!vertex) throw new Error("Vertex not found");

        return vertex.neighbors;
    }

    size(): number {
        return this.vertices.size;
    }

    forEach(callback: (valor: T, id: number, neighbors: readonly number[]) => void) {
        this.vertices.forEach((vertex, key) => {
            callback(vertex.value, key, vertex.neighbors);
        });
    }
}

const graph = new ArrayGraph<string>();

const vA = graph.addVertex("A");
const vB = graph.addVertex("B");
const vC = graph.addVertex("C");
const vD = graph.addVertex("D");
const vE = graph.addVertex("E");
const vF = graph.addVertex("F");

graph.connectVertices(vA, vB);
graph.connectVertices(vA, vD);
graph.connectVertices(vA, vE);

graph.connectVertices(vB, vC);

graph.connectVertices(vC, vF);

graph.connectVertices(vD, vE);

graph.connectVertices(vE, vC);
graph.connectVertices(vE, vF);

graph.forEach((value, id, neighbors) => {
    console.log(value, "=>", neighbors.map(v => graph.getVertexAt(v)));
});