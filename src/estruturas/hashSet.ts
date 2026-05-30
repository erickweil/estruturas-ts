export const stringHash = (str: string): number => {
    let n = 0;
    for(let i = 0; i < str.length; i++) {
        n = (n + str.charCodeAt(i)) | 0;
    }
    return n;
}


export class HashSet {
    private tabela: (string | undefined)[];
    constructor(capacidade: number) {
        this.tabela = new Array(capacidade).fill(undefined);
    }

    add(valor: string) {
        // 1. calcular o hash da string
        let hash = stringHash(valor);
        // 2. obter índice a partir do hash
        let indice = Math.abs(hash) % this.tabela.length;
        // 3. Achar um espaço vazio ou o mesmo valor (resolver colisão)
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) break;
            if(atual === valor) return;

            indice = (indice + 1) % this.tabela.length;
        }

        // 4. guardar o valor caso já não esteja lá
        this.tabela[indice] = valor;
    }

    has(valor: string): boolean {
        // 1. calcular o hash da string
        let hash = stringHash(valor);
        // 2. obter índice a partir do hash
        let indice = Math.abs(hash) % this.tabela.length;
        // 3. Achar um espaço vazio ou o mesmo valor (resolver colisão)
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) return false;
            if(atual === valor) return true;

            indice = (indice + 1) % this.tabela.length;
        }
    }

    delete(valor: string): boolean {
        // 1. calcular o hash da string
        let hash = stringHash(valor);
        // 2. obter índice a partir do hash
        let indice = Math.abs(hash) % this.tabela.length;
        // 3. Achar um espaço vazio ou o mesmo valor (resolver colisão)
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) return false;
            if(atual === valor) break;

            indice = (indice + 1) % this.tabela.length;
        }

        // 4. remover o valor
        this.tabela[indice] = undefined;

        // 5. Deslocar todos os próximos que o hash é igual
        let primeiroIndice = indice;
        let ultimoIndice = indice;
        indice = (indice + 1) % this.tabela.length;
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) break;
            let atualHash = stringHash(atual);
            let atualIndice = Math.abs(atualHash) % this.tabela.length;
            if(atualIndice !== primeiroIndice) {
                break;
            }
            this.tabela[ultimoIndice] = atual;
            this.tabela[indice] = undefined;

            ultimoIndice = indice;
            indice = (indice + 1) % this.tabela.length;
        }

        return true;
    }

    clear() {
        this.tabela.fill(undefined);
    }

    forEach(callback: (valor: string) => void) {
        this.tabela.forEach((v) => {
            if(v !== undefined) 
                callback(v)
        });
    }
}