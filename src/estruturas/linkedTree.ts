import { Tree } from "../interfaces/tree.js";

class TreeNode<T> {
    constructor(
        public value: T, 
        public left?: TreeNode<T>, 
        public right?: TreeNode<T>
    ) {}
}

export class LinkedTree<T> implements Tree<T> {
    private root?: TreeNode<T>;

    constructor(
        private compFn: (a: T,b: T) => number,
    ) {}

    private addNode(value: T, node: TreeNode<T> | undefined): TreeNode<T> {
        if(!node) {
            node = new TreeNode(value);
        } else if(this.compFn(value, node.value) < 0) {
            // é menor, então vai para a esquerda
            node.left = this.addNode(value, node.left);
        } else {
            // é maior, então vai para a direita
            node.right = this.addNode(value, node.right);
        }
        return node;
    }

    public add(value: T): void {
        this.root = this.addNode(value, this.root);
    }

    public getNode(value: T, node: TreeNode<T> | undefined): TreeNode<T> | undefined {
        if(!node) {
            return undefined;
        }
        const comp = this.compFn(value, node.value);
        if(comp === 0) {
            return node;
        } else if(comp < 0) {
            return this.getNode(value, node.left);
        } else {
            return this.getNode(value, node.right);
        }
    }

    public get(value: T): T | undefined {
        return this.getNode(value, this.root)?.value;
    }

    private inOrderTraversalGo(node: TreeNode<T> | undefined, callback: (value: T) => void): void {
        if(!node) return;

        this.inOrderTraversalGo(node.left, callback);
        callback(node.value);
        this.inOrderTraversalGo(node.right, callback);
    }

    public traverseDFS(callback: (value: T) => void): void {
        this.inOrderTraversalGo(this.root, callback);
    }

    traverseBFS(callback: (value: T) => void): void {
        throw new Error("Method not implemented.");
    }

    isEmpty(): boolean {
        return this.root ? false : true;
    }

    clear() {
        this.root = undefined;
    }
}

