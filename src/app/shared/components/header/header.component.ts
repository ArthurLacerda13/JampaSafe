import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <nav>
        <div class="logo">
          <strong>JampaSafe</strong>
          <span>João Pessoa</span>
        </div>
        <ul>
          <li><a routerLink="/feed" routerLinkActive="active">Ocorrências</a></li>
          <li><a routerLink="/denunciar" routerLinkActive="active">Relatar Problema</a></li>
          <li><a routerLink="/painel-gestor" routerLinkActive="active">Gestão</a></li>
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    header { background: #212529; color: white; padding: 1rem 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
    .logo { display: flex; flex-direction: column; line-height: 1; }
    .logo strong { font-size: 1.5rem; color: #ffc107; }
    .logo span { font-size: 0.8rem; letter-spacing: 1px; }
    ul { display: flex; list-style: none; gap: 1.5rem; margin: 0; padding: 0; }
    a { color: #adb5bd; text-decoration: none; font-weight: 500; transition: color 0.2s; }
    a:hover, a.active { color: white; }
    a.active { border-bottom: 2px solid #ffc107; padding-bottom: 4px; }
  `]
})
// Componente de cabeçalho global com menu de navegação do site
export class HeaderComponent {}
