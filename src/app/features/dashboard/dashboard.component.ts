import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Painel do Gestor</h1>
      
      <div class="stats-grid">
        <div class="stat-card total">
          <h3>Total de Ocorrências</h3>
          <p class="value">{{ service.totalOcorrencias() }}</p>
        </div>
        <div class="stat-card pendentes">
          <h3>Pendentes</h3>
          <p class="value">{{ service.pendentes() }}</p>
        </div>
        <div class="stat-card resolvidas">
          <h3>Resolvidas</h3>
          <p class="value">{{ resolvidas() }}</p>
        </div>
      </div>

      <div class="bairros-stats">
        <h2>Ocorrências por Bairro</h2>
        <ul>
          @for (stat of statsPorBairro(); track stat.bairro) {
            <li>
              <span>{{ stat.bairro }}</span>
              <div class="progress-bar">
                <div class="fill" [style.width.%]="(stat.count / service.totalOcorrencias()) * 100"></div>
              </div>
              <span class="count">{{ stat.count }}</span>
            </li>
          }
        </ul>
      </div>

      <div class="gerenciar-secao">
        <h2>Gerenciar Ocorrências</h2>
        
        <div class="ocorrencias-lista">
          @for (item of service.ocorrencias(); track item.id) {
            <div class="lista-item">
              <div class="item-info">
                <span class="badge" [attr.data-status]="item.status">{{ item.status }}</span>
                <h4>{{ item.titulo }}</h4>
                <p>📍 {{ item.bairro }} • 🏷️ {{ item.categoria }}</p>
              </div>
              <button class="btn-deletar" (click)="confirmarRemocao(item.id)">
                Remover
              </button>
            </div>
          } @empty {
            <div class="empty-state">
              <p>Nenhuma ocorrência registrada.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
    .stat-card { padding: 1.5rem; border-radius: 12px; color: white; text-align: center; }
    .total { background: #007bff; }
    .pendentes { background: #ffc107; color: #333; }
    .resolvidas { background: #28a745; }
    .value { font-size: 2.5rem; font-weight: bold; margin: 0; }
    
    .bairros-stats ul { list-style: none; padding: 0; }
    .bairros-stats li { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .bairros-stats span { width: 120px; }
    .progress-bar { flex-grow: 1; height: 10px; background: #eee; border-radius: 5px; overflow: hidden; }
    .fill { height: 100%; background: #007bff; transition: width 0.5s ease; }
    .count { width: 30px !important; font-weight: bold; text-align: right; }

    .gerenciar-secao {
      margin-top: 3rem;
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }
    
    .gerenciar-secao h2 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .ocorrencias-lista {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .lista-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border: 1px solid #f0f0f0;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lista-item:hover {
      border-color: #ff3b30;
      box-shadow: 0 4px 20px rgba(255, 59, 48, 0.05);
      transform: translateY(-2px);
    }

    .item-info h4 {
      margin: 0.25rem 0 0.5rem;
      font-size: 1.1rem;
      color: #222;
    }

    .item-info p {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    .badge[data-status="pendente"] { background: #ffeeba; color: #856404; }
    .badge[data-status="em-progresso"] { background: #b8daff; color: #004085; }
    .badge[data-status="resolvido"] { background: #c3e6cb; color: #155724; }

    .btn-deletar {
      background: transparent;
      border: 1px solid #ff3b30;
      color: #ff3b30;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-deletar:hover {
      background: #ff3b30;
      color: white;
      box-shadow: 0 4px 12px rgba(255, 59, 48, 0.2);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #888;
      font-style: italic;
    }
  `]
})
export class DashboardComponent {
  // Injeta o serviço de ocorrências
  service = inject(OcorrenciaService);

  // Filtra e conta apenas as resolvidas
  resolvidas = computed(() => 
    this.service.ocorrencias().filter(o => o.status === 'resolvido').length
  );

  // Agrupa a quantidade de ocorrências por bairro
  statsPorBairro = computed(() => {
    const counts: Record<string, number> = {};
    this.service.ocorrencias().forEach(o => {
      counts[o.bairro] = (counts[o.bairro] || 0) + 1;
    });
    return Object.entries(counts).map(([bairro, count]) => ({ bairro, count }));
  });

  // Solicita confirmação antes de remover a ocorrência
  async confirmarRemocao(id?: number) {
    if (!id) return;
    const confirmou = confirm('Tem certeza que deseja remover esta ocorrência de forma permanente?');
    if (confirmou) {
      await this.service.removerOcorrencia(id);
    }
  }
}

