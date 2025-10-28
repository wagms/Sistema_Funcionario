import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioService } from '../../services/funcionario.service';
import { Funcionario, FuncionarioFiltro } from '../../models/funcionario';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { Subject, Subscription, startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ToolbarModule, InputTextModule, DropdownModule, SelectButtonModule, ButtonModule,
    TableModule, TagModule, CardModule,
    ConfirmDialogModule, ToastModule
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

  busca = '';
  cargo?: string;
  ativo?: boolean;

  search$ = new Subject<string>();

  cargos: string[] = ['Analista', 'Assistente', 'Coordenador', 'Gerente', 'Estagiário'];
  statusOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Ativos', value: true },
    { label: 'Inativos', value: false }
  ];

  private sub?: Subscription;
  private subSearch?: Subscription;

  ngOnInit(): void {
    this.subSearch = this.search$.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(v => { this.busca = v ?? ''; this.service.sinalizarRefresh(); });

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
          const q = this.busca.trim().toLowerCase();
          const filtrado = q
            ? lista.filter(f => (f.nome + ' ' + f.email + ' ' + f.cargo).toLowerCase().includes(q))
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
      message: `Tem certeza que deseja inativar ${f.nome}?`,
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
    this.subSearch?.unsubscribe();
  }
}
