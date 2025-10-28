import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-departamento-list',
  templateUrl: './departamento-list.component.html',
  styleUrls: ['./departamento-list.component.css']
})
export class DepartamentoListComponent implements OnInit {
  departamentos: any[] = [];

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.departamentoService.getAllDepartamentos().subscribe((data) => {
      this.departamentos = data;
    });
  }

  inativarDepartamento(id: number): void {
    this.departamentoService.inativarDepartamento(id).subscribe(() => {
      this.departamentos = this.departamentos.filter(departamento => departamento.id !== id);
    });
  }
}
