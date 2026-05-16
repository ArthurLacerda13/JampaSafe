export interface Ocorrencia {
  id?: number;
  titulo: string;
  descricao: string;
  categoria: 'Infraestrutura' | 'Iluminação' | 'Limpeza';
  bairro: string;
  status: 'pendente' | 'em-progresso' | 'resolvido';
  dataRelato: string;
}
