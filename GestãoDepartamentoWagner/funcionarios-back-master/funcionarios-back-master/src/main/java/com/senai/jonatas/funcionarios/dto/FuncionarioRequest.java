package com.senai.jonatas.funcionarios.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FuncionarioRequest(
        String nome,
        String email,
        String cargo,
        BigDecimal salario,
        LocalDate dataAdmissao,
        Long departamentoId
) {}
