import { Injectable, computed, inject } from '@angular/core';
import { OcorrenciaService } from './ocorrencia.service';

export interface EstatisticaBairro {
  bairro: string;
  total: number;
  pendentes: number;
  emProgresso: number;
  resolvidas: number;
  percentualResolvido: number;
}

export interface EstatisticaCategoria {
  categoria: string;
  total: number;
}

/**
 * EstatisticaService
 *
 * Responsável por calcular e expor estatísticas derivadas das ocorrências.
 * Separa a lógica de agregação do OcorrenciaService, que cuida apenas do
 * CRUD e comunicação com a API.
 */
@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {

  private readonly ocorrenciaService = inject(OcorrenciaService);

  /** Total de ocorrências cadastradas. */
  readonly total = computed(() => this.ocorrenciaService.ocorrencias().length);

  /** Quantidade de ocorrências com status 'pendente'. */
  readonly totalPendentes = computed(() =>
    this.ocorrenciaService.ocorrencias().filter(o => o.status === 'pendente').length
  );

  /** Quantidade de ocorrências em andamento. */
  readonly totalEmProgresso = computed(() =>
    this.ocorrenciaService.ocorrencias().filter(o => o.status === 'em-progresso').length
  );

  /** Quantidade de ocorrências resolvidas. */
  readonly totalResolvidas = computed(() =>
    this.ocorrenciaService.ocorrencias().filter(o => o.status === 'resolvido').length
  );

  /** Percentual de ocorrências resolvidas em relação ao total. */
  readonly percentualResolvido = computed(() => {
    const t = this.total();
    return t === 0 ? 0 : Math.round((this.totalResolvidas() / t) * 100);
  });

  /**
   * Agrupamento de ocorrências por bairro, incluindo contadores por status.
   * Ordenado do bairro com mais ocorrências para o com menos.
   */
  readonly porBairro = computed((): EstatisticaBairro[] => {
    const mapa = new Map<string, EstatisticaBairro>();

    for (const o of this.ocorrenciaService.ocorrencias()) {
      if (!mapa.has(o.bairro)) {
        mapa.set(o.bairro, {
          bairro: o.bairro,
          total: 0,
          pendentes: 0,
          emProgresso: 0,
          resolvidas: 0,
          percentualResolvido: 0
        });
      }

      const entry = mapa.get(o.bairro)!;
      entry.total++;
      if (o.status === 'pendente') entry.pendentes++;
      else if (o.status === 'em-progresso') entry.emProgresso++;
      else if (o.status === 'resolvido') entry.resolvidas++;
    }

    // Calcular percentual e ordenar
    return Array.from(mapa.values())
      .map(e => ({
        ...e,
        percentualResolvido: e.total > 0 ? Math.round((e.resolvidas / e.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  });

  /**
   * Agrupamento de ocorrências por categoria.
   * Ordenado da categoria com mais ocorrências para a com menos.
   */
  readonly porCategoria = computed((): EstatisticaCategoria[] => {
    const mapa = new Map<string, number>();

    for (const o of this.ocorrenciaService.ocorrencias()) {
      mapa.set(o.categoria, (mapa.get(o.categoria) ?? 0) + 1);
    }

    return Array.from(mapa.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total);
  });
}
