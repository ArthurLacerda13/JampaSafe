import { Injectable } from '@angular/core';

/**
 * BairroService
 *
 * Centraliza a lista de bairros de João Pessoa utilizados nos formulários
 * e filtros da aplicação. Caso futuramente os bairros precisem vir de uma
 * API externa, basta substituir o getter por uma chamada HTTP.
 */
@Injectable({
  providedIn: 'root'
})
export class BairroService {

  private readonly _bairros: string[] = [
    'Mangabeira',
    'Bessa',
    'Cabo Branco',
    'Manaíra',
    'Gramame',
    'Bancários',
    'Altiplano',
    'Torre',
    'Tambaú',
    'Intermares',
    'Valentina',
    'Cristo Redentor',
    'Castelo Branco',
    'Centro',
    'Funcionários',
    'Jardim Cidade Universitária'
  ];

  /** Retorna a lista completa de bairros em ordem alfabética. */
  get bairros(): string[] {
    return [...this._bairros].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }
}
