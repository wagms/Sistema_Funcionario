package com.senai.jonatas.funcionarios.mapper;

import com.senai.jonatas.funcionarios.dto.FuncionarioRequest;
import com.senai.jonatas.funcionarios.dto.FuncionarioResponse;
import com.senai.jonatas.funcionarios.entity.Departamento;
import com.senai.jonatas.funcionarios.entity.Funcionario;

public final class FuncionarioMapper {

    private FuncionarioMapper() {}

    public static Funcionario toEntity(FuncionarioRequest req, Departamento departamento) {
        return Funcionario.builder()
                .nome(req.nome())
                .email(req.email())
                .cargo(req.cargo())
                .salario(req.salario())
                .dataAdmissao(req.dataAdmissao())
                .ativo(true)
                .departamento(departamento)
                .build();
    }

    public static void copyToEntity(FuncionarioRequest req, Funcionario entity, Departamento departamento) {
        entity.setNome(req.nome());
        entity.setCargo(req.cargo());
        entity.setSalario(req.salario());
        entity.setDataAdmissao(req.dataAdmissao());
        entity.setEmail(req.email());
        entity.setDepartamento(departamento);
    }

    public static FuncionarioResponse toResponse(Funcionario e) {
        Long depId = null;
        String depNome = null;
        String depSigla = null;
        if (e.getDepartamento() != null) {
            depId = e.getDepartamento().getId();
            depNome = e.getDepartamento().getNome();
            depSigla = e.getDepartamento().getSigla();
        }
        return new FuncionarioResponse(
                e.getId(), e.getNome(), e.getEmail(),
                e.getCargo(), e.getSalario(), e.getDataAdmissao(), e.getAtivo(),
                depId, depNome, depSigla
        );
    }
}
