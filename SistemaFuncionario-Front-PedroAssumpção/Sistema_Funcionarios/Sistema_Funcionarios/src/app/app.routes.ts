import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FuncionarioListComponent } from './components/funcionario-list/funcionario-list.component';
import { FuncionarioFormComponent } from './components/funcionario-form/funcionario-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home com botão "Começar"

  { path: 'funcionarios', component: FuncionarioListComponent },
  { path: 'funcionarios/new', component: FuncionarioFormComponent },
  { path: 'funcionarios/:id/edit', component: FuncionarioFormComponent },

  { path: '**', redirectTo: '' }
];
