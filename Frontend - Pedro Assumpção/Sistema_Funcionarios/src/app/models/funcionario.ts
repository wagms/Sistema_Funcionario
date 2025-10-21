export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  salario: number;
  dataAdmissao: string;   // yyyy-MM-dd
  ativo: boolean;
}

export interface FuncionarioRequest {
  nome: string;
  email: string;
  cargo: string;
  salario: number;
  dataAdmissao: string;   // yyyy-MM-dd
}

export interface FuncionarioResponse extends Funcionario {}

export interface FuncionarioFiltro {
  cargo?: string;
  ativo?: boolean;
}
