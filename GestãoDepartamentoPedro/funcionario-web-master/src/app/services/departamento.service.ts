import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = `${environment.apiUrl}/api/departamentos`;

  constructor(private http: HttpClient) {}

  getAllDepartamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getAtivosDepartamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ativos`);
  }

  createDepartamento(departamento: any): Observable<any> {
    return this.http.post(this.apiUrl, departamento);
  }

  updateDepartamento(id: number, departamento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, departamento);
  }

  inativarDepartamento(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/inativar`, {});
  }
}
