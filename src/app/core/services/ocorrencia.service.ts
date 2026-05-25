import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ocorrencia } from '../models/ocorrencia.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private http = inject(HttpClient);
  private apiUrl = 'data/ocorrencias.json';

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

  async carregarOcorrencias() {
    try {
      const data = await firstValueFrom(this.http.get<Ocorrencia[]>(this.apiUrl));
      this._ocorrencias.set(data);
    } catch (error) {
      console.error('Erro ao carregar ocorrências', error);
    }
  }

  adicionarOcorrencia(nova: Ocorrencia) {
    // Simula salvamento local
    const novaOcorrencia: Ocorrencia = { 
      ...nova, 
      id: Date.now(), 
      status: 'pendente', 
      dataRelato: new Date().toISOString() 
    };
    
    const atualizadas = [...this._ocorrencias(), novaOcorrencia];
    this._ocorrencias.set(atualizadas);
  }
}
