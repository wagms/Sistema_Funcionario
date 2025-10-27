package com.senai.jonatas.funcionarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartamentoRequest(

        @NotBlank(message = "O nome do departamento é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "A sigla é obrigatória")
        @Size(max = 10, message = "A sigla deve ter no máximo 10 caracteres")
        String sigla
) {}
