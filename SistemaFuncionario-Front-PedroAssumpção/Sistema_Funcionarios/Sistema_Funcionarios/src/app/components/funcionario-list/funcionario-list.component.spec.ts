import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioService } from '../../services/funcionario.service';
import { Funcionario, FuncionarioFiltro } from '../../models/funcionario';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, startWith, switchMap } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ToolbarModule, InputTextModule,
    TableModule, ButtonModule, DropdownModule, SelectButtonModule, TagModule,
    ToastModule, ConfirmDialogModule, ProgressSpinnerModule, CardModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './funcionario-list.component.html',
  styleUrls: ['./funcionario-list.component.scss']
})
export class FuncionarioListComponent implements OnInit, OnDestroy {
  private service = inject(FuncionarioService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  funcionarios: Funcionario[] = [];
  loading = false;

  cargo?: string;
  ativo?: boolean;
  busca = '';

  cargos: string[] = ['Analista', 'Assistente', 'Coordenador', 'Gerente', 'Estagiário'];
  statusOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Ativos', value: true },
    { label: 'Inativos', value: false }
  ];

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.service.refresh$
      .pipe(
        startWith(true),
        switchMap(() => {
          this.loading = true;
          const filtro: FuncionarioFiltro = { cargo: this.cargo, ativo: this.ativo };
          return this.service.listar(filtro);
        })
      )
      .subscribe({
        next: (lista) => {
          const filtrado = this.busca
            ? lista.filter(f => (f.nome + f.email + f.cargo).toLowerCase().includes(this.busca.toLowerCase()))
            : lista;
          this.funcionarios = [...filtrado].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  aplicarFiltros(): void {
    this.service.sinalizarRefresh();
  }

  confirmarInativar(f: Funcionario): void {
    this.confirm.confirm({
      header: 'Inativar funcionário',
      message: `Tem certeza que deseja inativar **${f.nome}**?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, inativar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.inativar(f.id)
    });
  }

  private inativar(id: number): void {
    this.service.inativar(id).subscribe({
      next: () => this.toast.add({ severity: 'success', summary: 'Pronto!', detail: 'Funcionário inativado.' }),
      error: () => this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível inativar.' })
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
