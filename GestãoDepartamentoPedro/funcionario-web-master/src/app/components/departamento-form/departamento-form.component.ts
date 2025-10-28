import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departamento-form',
  templateUrl: './departamento-form.component.html',
  styleUrls: ['./departamento-form.component.css']
})
export class DepartamentoFormComponent implements OnInit {
  departamento: any = {
    nome: '',
    sigla: '',
    ativo: true
  };

  constructor(private departamentoService: DepartamentoService, private router: Router) {}

  ngOnInit(): void {}

  saveDepartamento(): void {
    if (this.departamento.id) {
      this.departamentoService.updateDepartamento(this.departamento.id, this.departamento).subscribe(() => {
        this.router.navigate(['/departamentos']);
      });
    } else {
      this.departamentoService.createDepartamento(this.departamento).subscribe(() => {
        this.router.navigate(['/departamentos']);
      });
    }
  }
}
