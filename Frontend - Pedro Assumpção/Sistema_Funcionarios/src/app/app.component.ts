import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrimeNGConfig, MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MenubarModule, ButtonModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-menubar styleClass="card-glass" [style]="{ margin: '16px', borderRadius: '14px' }">
      <ng-template pTemplate="start">
        <span class="h-title" style="font-size:18px">Sistema de Gestão de Funcionários</span>
      </ng-template>
      <ng-template pTemplate="end">
        <a routerLink="/" pButton label="Início" icon="pi pi-home"></a>
        <a routerLink="/funcionarios" class="ml-2" pButton label="Listar" icon="pi pi-table"></a>
        <a routerLink="/funcionarios/new" class="ml-2" pButton label="Novo" icon="pi pi-plus"></a>
      </ng-template>
    </p-menubar>

    <div class="app-wrap">
      <router-outlet />
    </div>

    <p-toast position="top-right" />
    <p-confirmDialog />
  `
})
export class AppComponent implements OnInit {
  private config = inject(PrimeNGConfig);
  ngOnInit(): void { this.config.ripple = true; }
}
