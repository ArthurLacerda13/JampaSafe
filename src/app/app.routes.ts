import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    loadComponent: () => import('./features/feed/feed.component').then(m => m.FeedComponent),
    title: 'JampaSafe - Feed de Ocorrências'
  },
  {
    path: 'denunciar',
    loadComponent: () => import('./features/report/report.component').then(m => m.ReportComponent),
    title: 'JampaSafe - Relatar Problema'
  },
  {
    path: 'painel-gestor',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'JampaSafe - Painel do Gestor'
  },
  {
    path: '**',
    redirectTo: 'feed'
  }
];
