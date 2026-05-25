import { Injectable, signal, computed } from '@angular/core';
import { Ocorrencia } from '../models/ocorrencia.model';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  // Inicializa o cliente do Supabase
  private supabase = createClient(
    'https://fgkqzekvjbvlanlsnajn.supabase.co',
    'sb_publishable_XSUpcyk4KIVG6zTvIKkNKA_cX-_5CPL'
  );

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

  // Busca ocorrências no banco Supabase
  async carregarOcorrencias() {
    try {
      const { data, error } = await this.supabase
        .from('ocorrencias')
        .select('*')
        .order('dataRelato', { ascending: false });

      if (error) throw error;
      
      this._ocorrencias.set((data || []) as Ocorrencia[]);
    } catch (error) {
      console.error('Erro ao carregar ocorrências', error);
    }
  }

  // Insere ocorrência no banco Supabase
  async adicionarOcorrencia(nova: Ocorrencia) {
    try {
      const novaOcorrencia = { 
        titulo: nova.titulo, 
        descricao: nova.descricao, 
        categoria: nova.categoria, 
        bairro: nova.bairro,
        status: 'pendente'
      };

      const { error } = await this.supabase
        .from('ocorrencias')
        .insert([novaOcorrencia]);

      if (error) throw error;
      
      // Recarrega dados atualizados do Supabase
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao adicionar ocorrência', error);
    }
  }

  // Remove uma ocorrência do Supabase pelo ID
  async removerOcorrencia(id: number) {
    try {
      const { error } = await this.supabase
        .from('ocorrencias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Recarrega lista após deletar
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao remover ocorrência', error);
    }
  }

  // Atualiza o status de uma ocorrência no Supabase
  async atualizarStatus(id: number, novoStatus: 'pendente' | 'em-progresso' | 'resolvido') {
    try {
      const { error } = await this.supabase
        .from('ocorrencias')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) throw error;

      // Recarrega lista após atualizar
      await this.carregarOcorrencias();
    } catch (error) {
      console.error('Erro ao atualizar status', error);
    }
  }
}


