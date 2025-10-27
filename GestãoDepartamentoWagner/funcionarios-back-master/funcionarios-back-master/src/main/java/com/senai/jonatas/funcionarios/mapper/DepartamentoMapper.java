package com.senai.jonatas.funcionarios.mapper;

import com.senai.jonatas.funcionarios.dto.DepartamentoRequest;
import com.senai.jonatas.funcionarios.dto.DepartamentoResponse;
import com.senai.jonatas.funcionarios.entity.Departamento;

public final class DepartamentoMapper {
    private DepartamentoMapper() {}

    public static Departamento toEntity(DepartamentoRequest req) {
        return Departamento.builder()
                .nome(req.nome())
                .sigla(req.sigla())
                .ativo(true)
                .build();
    }

    public static void copyToEntity(DepartamentoRequest req, Departamento entity) {
        entity.setNome(req.nome());
        entity.setSigla(req.sigla());
    }

    public static DepartamentoResponse toResponse(Departamento d) {
        return new DepartamentoResponse(d.getId(), d.getNome(), d.getSigla(), d.getAtivo());
    }
}
