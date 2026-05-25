import { Routes } from '@angular/router';

// Definição das rotas da aplicação (mapeamento de URLs para componentes)
export const routes: Routes = [
  // Redireciona a raiz para o feed
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  },
  // Rota do Feed de Ocorrências (Lazy Loading)
  {
    path: 'feed',
    loadComponent: () => import('./features/feed/feed.component').then(m => m.FeedComponent),
    title: 'JampaSafe - Feed de Ocorrências'
  },
  // Rota para relatar um novo problema
  {
    path: 'denunciar',
    loadComponent: () => import('./features/report/report.component').then(m => m.ReportComponent),
    title: 'JampaSafe - Criar Denúncia'
  },
  // Rota do Painel do Gestor (Dashboard)
  {
    path: 'painel-gestor',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'JampaSafe - Painel Administrativo'
  },
  // Rota curinga: redireciona caminhos inválidos de volta para o feed
  {
    path: '**',
    redirectTo: 'feed'
  }
];
