# Estruturas-TS

Estruturas de dados em TypeScript.

Estruturas criadas:
- ArrayStack: Pilha baseada em array
- LinkedStack: Pilha utilizando referências simplesmente ligada
- ArrayQueue: Fila baseada em array circular
- ArrayDeque: Deque (e pilha) baseado em array circular
- DualStackQueue: Fila baseada em duas pilhas
- LinkedList: Lista duplamente encadeada
- PoolList: Lista duplamente encadeada com os nós armazenados em um BufferPool
- BufferPool: Object pool de structs binárias (ver `structSchema`)
- BitFlag32 / BitFlagArray: Conjunto de flags armazenadas em bits
- ArrayBufferDeque: Deque de números baseado em TypedArray
- HashSet: Conjunto de strings com endereçamento aberto (sondagem linear)
- LinkedTree: Árvore binária de busca (incompleta: falta traverseBFS)
- ConsumerQueue: Fila assíncrona para produtor/consumidor

Algoritmos:
- Busca: binarySearch, binarySearchLeftMost, binarySearchRightMost
- Ordenação: bubbleSort, selectionSort, insertionSort, binaryInsertionSort

> Este pacote é experimental, utilize por sua conta e risco.

## Utilização:

Veja a pasta [./exemplos](./exemplos/) para exemplos de utilização.