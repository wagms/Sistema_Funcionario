package com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.service;

import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.dto.FuncionarioRequestDTO;
import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.dto.FuncionarioResponseDTO;
import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.entity.Funcionario;
import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.repository.FuncionarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public FuncionarioResponseDTO criar(FuncionarioRequestDTO dto) {
        validarDados(dto);

        var existente = repository.findByEmail(dto.getEmail().trim());

        if (existente.isPresent()) {
            Funcionario f = existente.get();
            if (!f.isAtivo()) {
                f.setAtivo(true);
                f.setNome(dto.getNome().trim());
                f.setCargo(dto.getCargo().trim());
                f.setSalario(dto.getSalario());
                f.setDataAdmissao(dto.getDataAdmissao());
                return toDTO(repository.save(f));
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
            }
        }

        Funcionario novo = new Funcionario();
        novo.setNome(dto.getNome().trim());
        novo.setEmail(dto.getEmail().trim());
        novo.setCargo(dto.getCargo().trim());
        novo.setSalario(dto.getSalario());
        novo.setDataAdmissao(dto.getDataAdmissao());
        novo.setAtivo(true);

        return toDTO(repository.save(novo));
    }

    @Transactional
    public FuncionarioResponseDTO atualizar(Long id, FuncionarioRequestDTO dto) {
        validarDados(dto);

        Funcionario f = repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        if (!f.isAtivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas funcionários ativos podem ser atualizados.");
        }

        if (dto.getSalario().compareTo(f.getSalario()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O salário não pode ser reduzido.");
        }

        var existente = repository.findByEmail(dto.getEmail().trim());
        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já utilizado por outro funcionário.");
        }

        f.setNome(dto.getNome().trim());
        f.setCargo(dto.getCargo().trim());
        f.setSalario(dto.getSalario());
        f.setDataAdmissao(dto.getDataAdmissao());

        return toDTO(repository.save(f));
    }

    @Transactional
    public void inativar(Long id) {
        Funcionario f = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
        f.setAtivo(false);
        repository.save(f);
    }

    public FuncionarioResponseDTO buscarPorId(Long id) {
        Funcionario f = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));
        return toDTO(f);
    }

    public List<FuncionarioResponseDTO> listar(String cargo, Boolean ativo) {
        List<Funcionario> lista;

        if (cargo != null && ativo != null) {
            lista = repository.findByCargoContainingIgnoreCaseAndAtivo(cargo, ativo);
        } else if (cargo != null) {
            lista = repository.findByCargoContainingIgnoreCase(cargo);
        } else if (ativo != null) {
            lista = repository.findByAtivo(ativo);
        } else {
            lista = repository.findAll();
        }

        return lista.stream()
                .sorted((a, b) -> a.getNome().compareToIgnoreCase(b.getNome()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private void validarDados(FuncionarioRequestDTO dto) {
        if (dto.getDataAdmissao().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data de admissão não pode ser futura.");
        }
    }

    private FuncionarioResponseDTO toDTO(Funcionario f) {
        return new FuncionarioResponseDTO(
                f.getId(),
                f.getNome(),
                f.getEmail(),
                f.getCargo(),
                f.getSalario(),
                f.getDataAdmissao(),
                f.isAtivo()
        );
    }
}
