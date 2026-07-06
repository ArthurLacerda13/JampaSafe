import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feed-container">
      <h1>Monitor de Zeladoria Urbana - João Pessoa</h1>

      <div class="filters">
        <p>Total de relatos: <strong>{{ ocorrenciaService.totalOcorrencias() }}</strong></p>
      </div>

      <div class="grid">
        @for (ocorrencia of ocorrenciaService.ocorrencias(); track ocorrencia.id) {
          <div class="card" [class.resolvido]="ocorrencia.status === 'resolvido'">
            <div class="card-header">
              <span class="badge" [attr.data-status]="ocorrencia.status">{{ ocorrencia.status }}</span>
              <span class="category">{{ ocorrencia.categoria }}</span>
            </div>
            <h3>{{ ocorrencia.titulo }}</h3>
            <p class="bairro">📍 {{ ocorrencia.bairro }}</p>
            <p class="descricao">{{ ocorrencia.descricao }}</p>
            <div class="card-footer">
              <small>{{ ocorrencia.dataRelato | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
          </div>
        } @empty {
          <p>Nenhuma ocorrência encontrada.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .feed-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #ffc107; transition: transform 0.2s; }
    .card:hover { transform: translateY(-5px); }
    .card.resolvido { border-left-color: #28a745; opacity: 0.9; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; background: #eee; }
    .badge[data-status="pendente"] { background: #ffeeba; color: #856404; }
    .badge[data-status="em-progresso"] { background: #b8daff; color: #004085; }
    .badge[data-status="resolvido"] { background: #c3e6cb; color: #155724; }
    .category { color: #666; font-size: 0.9rem; }
    h3 { margin: 0.5rem 0; color: #333; }
    .bairro { font-weight: bold; color: #007bff; margin-bottom: 0.5rem; }
    .descricao { color: #555; font-size: 0.95rem; line-height: 1.4; }
    .card-footer { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; color: #999; }
  `]
})
export class FeedComponent {
  protected readonly ocorrenciaService = inject(OcorrenciaService);
}
