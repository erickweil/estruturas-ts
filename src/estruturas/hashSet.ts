export const stringHash = (str: string): number => {
    let n = 0;
    for(let i = 0; i < str.length; i++) {
        n = (n + str.charCodeAt(i)) | 0;
    }
    return n;
}


export class HashSet {
    private tabela: (string | undefined)[];
    private tamanho: number;
    constructor(capacidade: number) {
        this.tabela = new Array(capacidade).fill(undefined);
        this.tamanho = 0;
    }

    private indiceIdeal(valor: string): number {
        return Math.abs(stringHash(valor)) % this.tabela.length;
    }

    add(valor: string) {
        // 1. calcular o hash da string e obter índice a partir do hash
        let indice = this.indiceIdeal(valor);
        // 2. Achar um espaço vazio ou o mesmo valor (resolver colisão)
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) break;
            if(atual === valor) return;

            indice = (indice + 1) % this.tabela.length;
        }

        // 3. Sempre deve sobrar 1 espaço vazio, senão has() e delete() nunca terminam
        if(this.tamanho + 1 >= this.tabela.length) {
            throw new Error("HashSet cheio. Aumente a capacidade.");
        }

        // 4. guardar o valor caso já não esteja lá
        this.tabela[indice] = valor;
        this.tamanho++;
    }

    has(valor: string): boolean {
        // 1. calcular o hash da string e obter índice a partir do hash
        let indice = this.indiceIdeal(valor);
        // 2. Achar um espaço vazio ou o mesmo valor (resolver colisão)
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) return false;
            if(atual === valor) return true;

            indice = (indice + 1) % this.tabela.length;
        }
    }

    delete(valor: string): boolean {
        // 1. calcular o hash da string e obter índice a partir do hash
        let indice = this.indiceIdeal(valor);
        // 2. Achar um espaço vazio ou o mesmo valor (resolver colisão)
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) return false;
            if(atual === valor) break;

            indice = (indice + 1) % this.tabela.length;
        }

        // 3. remover o valor
        this.tabela[indice] = undefined;
        this.tamanho--;

        // 4. Deslocar para trás os próximos valores do mesmo agrupamento que ficariam
        // inalcançáveis por causa do buraco (podem ter qualquer hash, não só o mesmo do removido)
        let vazio = indice;
        indice = (indice + 1) % this.tabela.length;
        while(true) {
            let atual = this.tabela[indice];
            if(atual === undefined) break;

            // Se o índice ideal estiver entre o buraco (exclusivo) e a posição atual (inclusivo),
            // o valor continua alcançável e não precisa mover
            let ideal = this.indiceIdeal(atual);
            let alcancavel = vazio <= indice
                ? (vazio < ideal && ideal <= indice)
                : (vazio < ideal || ideal <= indice);

            if(!alcancavel) {
                this.tabela[vazio] = atual;
                this.tabela[indice] = undefined;
                vazio = indice;
            }

            indice = (indice + 1) % this.tabela.length;
        }

        return true;
    }

    clear() {
        this.tabela.fill(undefined);
        this.tamanho = 0;
    }

    size(): number {
        return this.tamanho;
    }

    forEach(callback: (valor: string) => void) {
        this.tabela.forEach((v) => {
            if(v !== undefined) 
                callback(v)
        });
    }
}
