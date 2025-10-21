package com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.repository;

import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.entity.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findByEmail(String email);
    List<Funcionario> findByCargoContainingIgnoreCase(String cargo);
    List<Funcionario> findByAtivo(Boolean ativo);
    List<Funcionario> findByCargoContainingIgnoreCaseAndAtivo(String cargo, Boolean ativo);
}