export class FilaCircular {
    array: any[];
    inicio: number;
    fim: number;
    tamanho_atual: number;
    capacidade: number;

    constructor(capacidade: number) {
        this.capacidade = capacidade;
        this.array = new Array(capacidade);
        this.inicio = 0;
        this.fim = 0;
        this.tamanho_atual = 0;
    }

    enfileirar(valor: number) {
        if (this.tamanho_atual === this.capacidade) {
            console.log("Fila cheia");
            return;
        }

        this.array[this.fim] = valor;
        this.fim = (this.fim + 1) % this.capacidade;
        this.tamanho_atual++;
    }

    desenfileirar(): any {
        if (this.tamanho_atual === 0) {
            console.log("Fila vazia");
            return;
        }

        let resultado = this.array[this.inicio];
        this.array[this.inicio] = undefined;
        
        this.inicio = (this.inicio + 1) % this.capacidade;
        this.tamanho_atual--;
        
        return resultado;
    }
}