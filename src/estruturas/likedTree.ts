/*
Arvore -> Inserir
0. A árvore está vazia?
    Sim: Adiciona novo nó como raiz.
    Não: chamar inserir para nó raiz.

ArvoreNó -> Inserir
1. O valor a ser inserido é maior ou igual que o valor do nó?
    Sim: 
        1.1 direita é nulo?
            Sim: adicionar novo nó aqui
            Não: chama inserir para este nó.
    Não: 
        1.2 esquerda é nulo?
            Sim: adicionar novo nó aqui
            Não: chama inserir para este nó.
*/

import { Tree } from "../interfaces/tree.js";
import { lexicograficallyCompare } from "../utils/lexicograficallyCompare.js";
import { DualStackQueue } from "./dualStackQueue.js";


class ArvoreNo<T> {
    valor: T;
    direita: ArvoreNo<T> | null;
    esquerda: ArvoreNo<T> | null;

    constructor(valor: T) {
        this.valor = valor;
        this.direita = null;
        this.esquerda = null;
    }

    travessia(callback: (valor: T) => void) {
        if(this.esquerda) this.esquerda.travessia(callback);
        callback(this.valor);
        if(this.direita) this.direita.travessia(callback);
    }
}

export class LinkedTree<T> implements Tree<T> {
    raiz: ArvoreNo<T> | null;
    compFn: (a: T, b: T) => number;

    constructor(compFn: (a: T,b: T) => number = lexicograficallyCompare) {
        this.raiz = null;
        this.compFn = compFn;
    }

    add(valor: T) {
        if(!this.raiz) {
            this.raiz = new ArvoreNo(valor);
            return;
        }

        let atual = this.raiz;
        while(true) {
            if(this.compFn(valor, atual.valor) >= 0) {
                // valor >= atual.valor
                // direita
                if(!atual.direita) {
                    atual.direita = new ArvoreNo(valor);
                    return;
                }
                atual = atual.direita;
            } else {
                // valor < atual.valor
                // esquerda
                if(!atual.esquerda) {
                    atual.esquerda = new ArvoreNo(valor);
                    return;
                }
                atual = atual.esquerda;
            }
        }
    }

    get(index: number): T | undefined {
        throw new Error("Não implementado");
    }

    traverseDFS(callback: (valor: T) => void) {
        if(!this.raiz) {
            return;
        }
        this.raiz.travessia(callback);
    }



    traverseBFS(callback: (valor: T) => void) {
        if(!this.raiz) return;
        const proximos = new DualStackQueue<ArvoreNo<T>>();
        proximos.addLast(this.raiz);

        while(true) {
            const no = proximos.removeFirst();
            if(!no) break;
            
            callback(no.valor);
            if(no.esquerda) {
                proximos.addLast(no.esquerda);
            }
            if(no.direita) {
                proximos.addLast(no.direita);
            }
        }
    }






    isEmpty(): boolean {
        return this.raiz ? false : true;
    }

    clear(): void {
        this.raiz = null;
    }
}
