import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from '../../services/funcionario.service';
import { MessageService } from 'primeng/api';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import {FuncionarioRequest} from "../../models/funcionarioRequest";

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, InputNumberModule, CalendarModule, ButtonModule, ToastModule
  ],
  templateUrl: './funcionario-form.component.html',
  styleUrls: ['./funcionario-form.component.css']
})
export class FuncionarioFormComponent {
  id: number | null = null;
  isEdicao = false;
  carregando = this.service.loading;

  funcionario: FuncionarioRequest = {
    nome: '',
    email: '',
    cargo: '',
    salario: 0,
    dataAdmissao: this.hojeISO()
  };
  toDate: Date = new Date();

  constructor(
    private service: FuncionarioService,
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageService
  ) {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdicao = true;
      this.id = Number(paramId);
      this.carregarFuncionario(this.id);
    }
  }

  private hojeISO(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private carregarFuncionario(id: number) {
    this.service.loading.set(true);
    this.service.buscarPorId(id).subscribe({
      next: (f) => {
        this.funcionario = {
          nome: f.nome,
          email: f.email,
          cargo: f.cargo,
          salario: f.salario,
          dataAdmissao: f.dataAdmissao
        };
        this.service.loading.set(false);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Funcionário não encontrado' });
        this.service.loading.set(false);
        this.router.navigate(['/funcionarios']);
      }
    });
  }

  salvar() {
    if (!this.validarCampos()) return;

    this.service.loading.set(true);
    if (this.isEdicao && this.id) {
      this.service.atualizar(this.id, this.funcionario).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário atualizado' });
          this.service.loading.set(false);
          this.router.navigate(['/funcionarios']);
        },
        error: (err) => this.tratarErroHttp(err)
      });
    } else {
      this.service.criar(this.funcionario).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado' });
          this.service.loading.set(false);
          this.router.navigate(['/funcionarios']);
        },
        error: (err) => this.tratarErroHttp(err)
      });
    }
  }

  limpar() {
    this.funcionario = {
      nome: '',
      email: '',
      cargo: '',
      salario: 0,
      dataAdmissao: this.hojeISO()
    };
  }

  private validarCampos(): boolean {
    const f = this.funcionario;

    if (!f.nome || f.nome.trim().length < 3) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Nome deve ter pelo menos 3 caracteres' });
      return false;
    }

    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'E-mail inválido' });
      return false;
    }

    if (!f.cargo || f.cargo.trim() === '') {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Cargo é obrigatório' });
      return false;
    }

    if (f.salario <= 0) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Salário deve ser maior que zero' });
      return false;
    }

    if (!f.dataAdmissao || f.dataAdmissao > this.hojeISO()) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Data de admissão inválida' });
      return false;
    }

    return true;
  }

  private tratarErroHttp(err: any) {
    this.service.loading.set(false);
    const status = err?.status;
    if (status === 409) {
      this.msg.add({ severity: 'warn', summary: 'Conflito', detail: 'E-mail já cadastrado' });
    } else if (status === 400) {
      this.msg.add({ severity: 'warn', summary: 'Regras', detail: err?.error?.message || 'Violação de regra de negócio' });
    } else {
      this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar' });
    }
  }
}
