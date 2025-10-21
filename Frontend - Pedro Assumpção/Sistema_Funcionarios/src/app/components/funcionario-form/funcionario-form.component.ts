import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioRequest, Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    CardModule, InputTextModule, InputNumberModule, CalendarModule, ButtonModule, DropdownModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './funcionario-form.component.html',
  styleUrls: ['./funcionario-form.component.scss']
})
export class FuncionarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(FuncionarioService);
  private toast = inject(MessageService);

  id: number | null = null;
  titulo = 'Novo Funcionário';
  carregando = false;

  cargos: string[] = ['Analista', 'Assistente', 'Coordenador', 'Gerente', 'Estagiário'];

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\s*\S.*$/)]],
    email: ['', [Validators.required, Validators.email]],
    cargo: ['', [Validators.required]],
    salario: [null as number | null, [Validators.required, Validators.min(0.01)]],
    dataAdmissao: [null as Date | null, [Validators.required]]
  });

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = Number(paramId);
      this.titulo = 'Editar Funcionário';
      this.carregarEdicao(this.id);
    }
  }

  private carregarEdicao(id: number): void {
    this.carregando = true;
    this.service.obterPorId(id).subscribe({
      next: (fx: Funcionario) => {
        const [yyyy, mm, dd] = fx.dataAdmissao.split('-').map(Number);
        const dt = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1);
        this.form.patchValue({
          nome: fx.nome, email: fx.email, cargo: fx.cargo, salario: fx.salario, dataAdmissao: dt
        });
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Revise os campos obrigatórios.' });
      return;
    }

    const v = this.form.value;
    const payload: FuncionarioRequest = {
      nome: String(v.nome).trim(),
      email: String(v.email).trim(),
      cargo: String(v.cargo).trim(),
      salario: Number(v.salario),
      dataAdmissao: this.formatarData(v.dataAdmissao as Date)
    };

    this.carregando = true;
    const obs = this.id
      ? this.service.atualizar(this.id, payload)
      : this.service.criar(payload);

    obs.subscribe({
      next: () => {
        this.carregando = false;
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Dados salvos!' });
        this.router.navigate(['/funcionarios']);
      },
      error: () => {
        this.carregando = false;
        this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar.' });
      }
    });
  }

  private formatarData(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get f() { return this.form.controls; }
}
