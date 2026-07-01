import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ocorrencia } from '../models/ocorrencia.model';
import { firstValueFrom } from 'rxjs';

// Modelo esperado pela API backend (conforme documentacao.md)
interface ApiOcorrencia {
  id?: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  categoria: string;
  status: string;
  dataCriacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ocorrencias';

  // Estado privado (Signals)
  private _ocorrencias = signal<Ocorrencia[]>([]);
  
  // Estado exposto (Apenas leitura)
  readonly ocorrencias = this._ocorrencias.asReadonly();
  
  // Contadores automáticos (Reativos)
  readonly totalOcorrencias = computed(() => this._ocorrencias().length);
  readonly pendentes = computed(() => 
    this._ocorrencias().filter(o => o.status === 'pendente').length
  );

  constructor() {
    this.carregarOcorrencias();
  }

  // Busca ocorrências no banco de dados via API REST
  async carregarOcorrencias() {
    try {
      const data = await firstValueFrom(
        this.http.get<ApiOcorrencia[]>(this.apiUrl)
      );
      const mapped = (data || []).map(o => this.mapToFrontend(o));
      // Ordena por dataRelato decrescente (mais recentes primeiro)
      mapped.sort((a, b) => new Date(b.dataRelato).getTime() - new Date(a.dataRelato).getTime());
      this._ocorrencias.set(mapped);
    } catch (error) {
      console.error('Erro ao carregar ocorrências', error);
    }
  }

  // Insere ocorrência no banco de dados via API REST
  async adicionarOcorrencia(nova: Ocorrencia) {
    try {
      const apiPayload = this.mapToApi(nova);
      // Garante que o status inicial é PENDENTE
      apiPayload.status = 'PENDENTE';
      
      await firstValueFrom(
        this.http.post<ApiOcorrencia>(this.apiUrl, apiPayload)
      );
      
      // Recarrega dados atualizados da API
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao adicionar ocorrência', error);
    }
  }

  // Remove uma ocorrência via API REST pelo ID
  async removerOcorrencia(id: number) {
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
      
      // Recarrega lista após deletar
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao remover ocorrência', error);
    }
  }

  // Atualiza o status de uma ocorrência via API REST
  async atualizarStatus(id: number, novoStatus: 'pendente' | 'em-progresso' | 'resolvido') {
    try {
      const atual = this._ocorrencias().find(o => o.id === id);
      if (atual && atual.status === 'resolvido') {
        return;
      }

      if (atual) {
        const updatedFe = { ...atual, status: novoStatus };
        const apiPayload = this.mapToApi(updatedFe);
        
        await firstValueFrom(
          this.http.put<ApiOcorrencia>(`${this.apiUrl}/${id}`, apiPayload)
        );
        
        // Recarrega lista após atualizar
        await this.carregarOcorrencias();
      }
    } catch (error) {
      console.error('Erro ao atualizar status', error);
    }
  }

  // Mapeamentos Auxiliares
  private mapToFrontend(api: ApiOcorrencia): Ocorrencia {
    return {
      id: api.id,
      titulo: api.titulo,
      descricao: api.descricao,
      bairro: api.localizacao,
      categoria: api.categoria as 'Infraestrutura' | 'Iluminação' | 'Limpeza',
      status: this.mapStatusToFrontend(api.status),
      dataRelato: api.dataCriacao || new Date().toISOString()
    };
  }

  private mapToApi(fe: Ocorrencia): ApiOcorrencia {
    return {
      id: fe.id,
      titulo: fe.titulo,
      descricao: fe.descricao,
      localizacao: fe.bairro,
      categoria: fe.categoria,
      status: this.mapStatusToApi(fe.status)
    };
  }

  private mapStatusToFrontend(status: string): 'pendente' | 'em-progresso' | 'resolvido' {
    const s = status ? status.toUpperCase() : 'PENDENTE';
    if (s === 'EM_ANDAMENTO' || s === 'EM_PROGRESSO') {
      return 'em-progresso';
    }
    if (s === 'RESOLVIDO') {
      return 'resolvido';
    }
    return 'pendente';
  }

  private mapStatusToApi(status: 'pendente' | 'em-progresso' | 'resolvido'): string {
    if (status === 'em-progresso') {
      return 'EM_ANDAMENTO';
    }
    if (status === 'resolvido') {
      return 'RESOLVIDO';
    }
    return 'PENDENTE';
  }
}


