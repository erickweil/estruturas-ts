export class Fila<T> {
    capacidade: number;
    inicio: number;
    fim: number;
    arr: T[];

    constructor(capacidade: number) {
        this.capacidade = capacidade;
        this.inicio = 0;
        this.fim = 0;
        this.arr = new Array(this.capacidade);
    }

    private incrementar(cont: number) {
        return (cont + 1) % this.capacidade;
    }

    inserir(valor: T) {
        this.arr[this.fim] = valor;
        this.fim = this.incrementar(this.fim);
    }

    remover(): T {
        const temp = this.arr[this.inicio];
        
        delete this.arr[this.inicio];
        this.inicio = this.incrementar(this.inicio);

        return temp;
    }
}