package com.senai.jonatas.funcionarios.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departamentos",
        uniqueConstraints = @UniqueConstraint(name = "uk_departamento_nome", columnNames = "nome"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String sigla;

    @Column(nullable = false)
    private Boolean ativo = true;

    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL, orphanRemoval = false, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Funcionario> funcionarios = new ArrayList<>();
}
