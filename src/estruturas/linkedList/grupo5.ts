import { List } from "../../interfaces/list.js";

/*Nó da lista duplamente ligada que armazena um valor e referências para os nós adjacentes
  template T é o tipo do valor armazenado
*/
export class No<T> {
    public valor: T;
    public proximo: No<T> | null = null;
    public anterior: No<T> | null = null;

    constructor(valor: T) {
        this.valor = valor;
        this.proximo = null;
        this.anterior = null;
    }
}

//usa a interface para padronizar os métodos da lista
export class DoublyLinkedList5<T> implements List<T> {
    public inicio: No<T> | null = null;
    public fim: No<T> | null = null;
    public tamanho: number = 0;


    capacity(): number {
        return Infinity;
    }

    /*
      Adiciona um elemento no início da lista e atualiza os ponteiros para manter a estrutura correta
      complexidade O(1)
      O parâmetro data é o valor a ser inserido
    */
    addFirst(data: T): void {
        const novoNo = new No(data);
        if (this.tamanho === 0) {
            this.inicio = novoNo;
            this.fim = novoNo;
        } else {
            const antigoInicio = this.inicio;
            novoNo.proximo = antigoInicio;
            antigoInicio!.anterior = novoNo;
            this.inicio = novoNo;
        }
        this.tamanho++;
    }

    /*
      Adiciona um elemento no final da lista atualizando os ponteiros para manter a estrutura 
      complexidade O(1)
      O parâmetro data é o valor a ser inserido
    */
    addLast(data: T): void {
        const novoNo = new No(data);
        if (this.tamanho === 0) {
            this.inicio = novoNo;
            this.fim = novoNo;
        } else {
            const antigoFim = this.fim;
            antigoFim!.proximo = novoNo;
            novoNo.anterior = antigoFim;
            this.fim = novoNo;
        }
        this.tamanho++;
    }

    /*
      Insere um elemento na posição especificada da lista
      complexidade O(n)
      O parâmetro data é o valor a ser inserido 
      O parametro index é a posição onde o elemento deve ser colocado
    */
    add(data: T, index: number): void {
        if (index < 0 || index > this.tamanho) {
            throw new Error("Índice inválido");
        }
        if (index === 0) {
            this.addFirst(data);
            return;
        }
        if (index === this.tamanho) {
            this.addLast(data);
            return;
        }
        const novoNo = new No(data);
        let atual = this.inicio;
        for (let i = 0; i < index; i++) {
            atual = atual!.proximo;
        }
        novoNo.anterior = atual!.anterior;
        novoNo.proximo = atual;
        atual!.anterior!.proximo = novoNo;
        atual!.anterior = novoNo;
        this.tamanho++;
    }

    /*
      Remove o primeiro elemento da lista e retorna seu valor
      complexidade O(1)
    */
    removeFirst(): T | undefined {
        if (!this.inicio) return undefined;
        const valor = this.inicio.valor;
        this.inicio = this.inicio.proximo;
        if (this.inicio) {
            this.inicio.anterior = null;
        } else {
            this.fim = null;
        }
        this.tamanho--;
        return valor;
    }

    /*
      Remove o último elemento da lista e retorna seu valor
      complexidade O(1)
    */
    removeLast(): T | undefined {
        if (!this.fim) return undefined;
        const valor = this.fim.valor;
        this.fim = this.fim.anterior;
        if (this.fim) {
            this.fim.proximo = null;
        } else {
            this.inicio = null;
        }
        this.tamanho--;
        return valor;
    }

    /*
      Remove o elemento da posição especificada da lista e retorna seu valor 
      complexidade O(n) 
      O parâmetro index é a posição do elemento a ser removido, ele deve estar dentro dos limites da lista
    */
    remove(index: number): T | undefined {
        if (index < 0 || index >= this.tamanho) {
            return undefined;
        }
        if (index === 0) return this.removeFirst();
        if (index === this.tamanho - 1) return this.removeLast();
        let atual = this.inicio;
        for (let i = 0; i < index; i++) {
            atual = atual!.proximo;
        }
        const valor = atual!.valor;
        atual!.anterior!.proximo = atual!.proximo;
        atual!.proximo!.anterior = atual!.anterior;
        this.tamanho--;
        return valor;
    }

    /*
      Retorna o valor do primeiro elemento da lista sem removê-lo 
      complexidade O(1) 
    */
    peekFirst(): T | undefined {
        return this.inicio ? this.inicio.valor : undefined;
    }

    peekLast(): T | undefined {
        return this.fim ? this.fim.valor : undefined;
    }

    get(position: number): T | undefined {
        if (position < 0 || position >= this.tamanho) return undefined;
        let atual = this.inicio;
        for (let i = 0; i < position; i++) {
            atual = atual!.proximo;
        }
        return atual!.valor;
    }

    size(): number {
        return this.tamanho;
    }

    isEmpty(): boolean {
        return this.tamanho === 0;
    }

    /*
      Remove todos os elementos da lista, limpando a lista completamente e atualizando o tamanho para zero
      complexidade O(1)
    */
    clear(): void {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }

    printAll(): void {
        let atual = this.inicio;
        const resultado: T[] = [];
        while (atual) {
            resultado.push(atual.valor);
            atual = atual.proximo;
        }
        console.log(resultado.join(" <-> "));
    }
}
