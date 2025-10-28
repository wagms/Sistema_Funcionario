import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Funcionario,
  FuncionarioFiltro,
  FuncionarioRequest,
  FuncionarioResponse
} from '../models/funcionario';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/funcionarios`;

  private _refresh$ = new BehaviorSubject<boolean>(true);
  readonly refresh$ = this._refresh$.asObservable();

  listar(filtro?: FuncionarioFiltro): Observable<Funcionario[]> {
    let params = new HttpParams();
    if (filtro?.cargo) params = params.set('cargo', filtro.cargo);
    if (filtro?.ativo !== undefined) params = params.set('ativo', String(filtro.ativo));
    return this.http.get<Funcionario[]>(this.baseUrl, { params });
  }

  obterPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  criar(payload: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.baseUrl, payload)
      .pipe(tap(() => this._refresh$.next(true)));
  }

  atualizar(id: number, payload: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.put<FuncionarioResponse>(`${this.baseUrl}/${id}`, payload)
      .pipe(tap(() => this._refresh$.next(true)));
  }

  inativar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/inativar`, {})
      .pipe(tap(() => this._refresh$.next(true)));
  }

  sinalizarRefresh() {
    this._refresh$.next(true);
  }
}
