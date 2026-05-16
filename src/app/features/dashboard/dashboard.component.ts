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
  `]
})
export class DashboardComponent {
  service = inject(OcorrenciaService);

  resolvidas = computed(() => 
    this.service.ocorrencias().filter(o => o.status === 'resolvido').length
  );

  statsPorBairro = computed(() => {
    const counts: Record<string, number> = {};
    this.service.ocorrencias().forEach(o => {
      counts[o.bairro] = (counts[o.bairro] || 0) + 1;
    });
    return Object.entries(counts).map(([bairro, count]) => ({ bairro, count }));
  });
}
