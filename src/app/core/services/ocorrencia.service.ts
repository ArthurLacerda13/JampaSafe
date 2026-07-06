import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Ocorrencia } from '../models/ocorrencia.model';

interface ApiOcorrencia {
  id?: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  categoria: string;
  status: string;
  dataCriacao?: string;
}

type StatusFrontend = 'pendente' | 'em-progresso' | 'resolvido';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/ocorrencias';

  private _ocorrencias = signal<Ocorrencia[]>([]);

  readonly ocorrencias = this._ocorrencias.asReadonly();
  readonly totalOcorrencias = computed(() => this._ocorrencias().length);
  readonly pendentes = computed(() =>
    this._ocorrencias().filter(o => o.status === 'pendente').length
  );

  constructor() {
    this.carregarOcorrencias();
  }

  async carregarOcorrencias(): Promise<void> {
    try {
      const dados = await firstValueFrom(this.http.get<ApiOcorrencia[]>(this.apiUrl));
      const ocorrencias = (dados || []).map(o => this.paraFrontend(o));
      ocorrencias.sort((a, b) => new Date(b.dataRelato).getTime() - new Date(a.dataRelato).getTime());
      this._ocorrencias.set(ocorrencias);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    }
  }

  async adicionarOcorrencia(nova: Ocorrencia): Promise<void> {
    try {
      const payload = { ...this.paraApi(nova), status: 'PENDENTE' };
      await firstValueFrom(this.http.post<ApiOcorrencia>(this.apiUrl, payload));
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao adicionar ocorrência:', error);
    }
  }

  async removerOcorrencia(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao remover ocorrência:', error);
    }
  }

  async atualizarStatus(id: number, novoStatus: StatusFrontend): Promise<void> {
    const ocorrencia = this._ocorrencias().find(o => o.id === id);
    if (!ocorrencia || ocorrencia.status === 'resolvido') return;

    try {
      const payload = this.paraApi({ ...ocorrencia, status: novoStatus });
      await firstValueFrom(this.http.put<ApiOcorrencia>(`${this.apiUrl}/${id}`, payload));
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  private paraFrontend(api: ApiOcorrencia): Ocorrencia {
    return {
      id: api.id,
      titulo: api.titulo,
      descricao: api.descricao,
      bairro: api.localizacao,
      categoria: api.categoria as Ocorrencia['categoria'],
      status: this.traduzirStatusParaFrontend(api.status),
      dataRelato: api.dataCriacao ?? new Date().toISOString()
    };
  }

  private paraApi(ocorrencia: Ocorrencia): ApiOcorrencia {
    return {
      id: ocorrencia.id,
      titulo: ocorrencia.titulo,
      descricao: ocorrencia.descricao,
      localizacao: ocorrencia.bairro,
      categoria: ocorrencia.categoria,
      status: this.traduzirStatusParaApi(ocorrencia.status)
    };
  }

  private traduzirStatusParaFrontend(status: string): StatusFrontend {
    const statusNormalizado = (status ?? '').toUpperCase();
    if (statusNormalizado === 'EM_ANDAMENTO' || statusNormalizado === 'EM_PROGRESSO') return 'em-progresso';
    if (statusNormalizado === 'RESOLVIDO') return 'resolvido';
    return 'pendente';
  }

  private traduzirStatusParaApi(status: StatusFrontend): string {
    const mapeamento: Record<StatusFrontend, string> = {
      'pendente': 'PENDENTE',
      'em-progresso': 'EM_ANDAMENTO',
      'resolvido': 'RESOLVIDO'
    };
    return mapeamento[status];
  }
}
