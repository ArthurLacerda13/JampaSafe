import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OcorrenciaService } from '../../core/services/ocorrencia.service';
import { BairroService } from '../../core/services/bairro.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="report-container">
      <div class="card">
        <h2>Relatar Problema Urbano</h2>
        <p class="subtitle">Ajude a melhorar João Pessoa informando problemas em seu bairro.</p>

        <form [formGroup]="formulario" (ngSubmit)="enviar()">
          <div class="form-group">
            <label for="titulo">Título da Ocorrência</label>
            <input id="titulo" type="text" formControlName="titulo" placeholder="Ex: Buraco na Rua principal">
            @if (formulario.get('titulo')?.invalid && formulario.get('titulo')?.touched) {
              <small class="error">O título é obrigatório (mín. 5 caracteres).</small>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="bairro">Bairro</label>
              <select id="bairro" formControlName="bairro">
                <option value="">Selecione o bairro</option>
                @for (bairro of bairros; track bairro) {
                  <option [value]="bairro">{{ bairro }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="categoria">Categoria</label>
              <select id="categoria" formControlName="categoria">
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Iluminação">Iluminação</option>
                <option value="Limpeza">Limpeza</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="descricao">Descrição Detalhada</label>
            <textarea id="descricao" formControlName="descricao" rows="4" placeholder="Descreva o problema com detalhes para facilitar o atendimento..."></textarea>
            @if (formulario.get('descricao')?.invalid && formulario.get('descricao')?.touched) {
              <small class="error">A descrição é obrigatória.</small>
            }
          </div>

          <div class="actions">
            <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="formulario.invalid">Enviar Denúncia</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .report-container { padding: 2rem; display: flex; justify-content: center; }
    .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); width: 100%; max-width: 600px; }
    h2 { margin: 0; color: #212529; font-size: 1.8rem; }
    .subtitle { color: #6c757d; margin-bottom: 2rem; }

    .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    label { font-weight: 600; color: #495057; font-size: 0.9rem; }
    input, select, textarea {
      padding: 0.8rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #ffc107;
      box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
    }

    .error { color: #dc3545; font-size: 0.8rem; font-weight: 500; }

    .actions { display: flex; gap: 1rem; margin-top: 2rem; }
    button { flex: 1; padding: 1rem; border-radius: 6px; font-weight: bold; cursor: pointer; transition: all 0.2s; border: none; }

    .btn-primary { background: #ffc107; color: #212529; }
    .btn-primary:hover:not(:disabled) { background: #e0a800; }
    .btn-primary:disabled { background: #e9ecef; color: #adb5bd; cursor: not-allowed; }

    .btn-secondary { background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; }
    .btn-secondary:hover { background: #e9ecef; }

    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
      .card { padding: 1.5rem; }
    }
  `]
})
export class ReportComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ocorrenciaService = inject(OcorrenciaService);
  private readonly bairroService = inject(BairroService);
  private readonly router = inject(Router);

  readonly bairros = this.bairroService.bairros;

  readonly formulario: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    bairro: ['', Validators.required],
    categoria: ['Infraestrutura', Validators.required],
    descricao: ['', [Validators.required, Validators.maxLength(500)]]
  });

  enviar(): void {
    if (this.formulario.invalid) return;
    this.ocorrenciaService.adicionarOcorrencia(this.formulario.value);
    alert('Denúncia enviada com sucesso! Obrigado por colaborar.');
    this.router.navigate(['/feed']);
  }

  cancelar(): void {
    this.router.navigate(['/feed']);
  }
}
