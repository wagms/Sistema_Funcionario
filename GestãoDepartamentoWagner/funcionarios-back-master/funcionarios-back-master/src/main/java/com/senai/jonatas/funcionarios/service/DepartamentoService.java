package com.senai.jonatas.funcionarios.service;

import com.senai.jonatas.funcionarios.dto.DepartamentoRequest;
import com.senai.jonatas.funcionarios.dto.DepartamentoResponse;
import com.senai.jonatas.funcionarios.entity.Departamento;
import com.senai.jonatas.funcionarios.exceptions.DepartamentoConflictException;
import com.senai.jonatas.funcionarios.exceptions.ResourceNotFoundException;
import com.senai.jonatas.funcionarios.mapper.DepartamentoMapper;
import com.senai.jonatas.funcionarios.repository.DepartamentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    private final DepartamentoRepository repository;

    public DepartamentoService(DepartamentoRepository repository) {
        this.repository = repository;
    }

    public List<DepartamentoResponse> listar(Boolean ativosSomente) {
        List<Departamento> lista;
        if (ativosSomente != null && ativosSomente) {
            lista = repository.findByAtivoOrderByNomeAsc(true);
        } else {
            lista = repository.findAllByOrderByNomeAsc();
        }
        return lista.stream().map(DepartamentoMapper::toResponse).toList();
    }

    public DepartamentoResponse buscarPorId(Long id) {
        var dep = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento não encontrado"));
        return DepartamentoMapper.toResponse(dep);
    }

    @Transactional
    public DepartamentoResponse criar(DepartamentoRequest req) {
        if (req.nome() == null || req.nome().isBlank()) {
            throw new IllegalArgumentException("Nome do departamento é obrigatório");
        }
        if (repository.existsByNomeIgnoreCase(req.nome().trim())) {
            throw new DepartamentoConflictException("Nome de departamento já cadastrado");
        }
        var novo = DepartamentoMapper.toEntity(req);
        var salvo = repository.save(novo);
        return DepartamentoMapper.toResponse(salvo);
    }

    @Transactional
    public DepartamentoResponse atualizar(Long id, DepartamentoRequest req) {
        var existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento não encontrado"));

        if (!existente.getNome().equalsIgnoreCase(req.nome())
                && repository.existsByNomeIgnoreCase(req.nome())) {
            throw new DepartamentoConflictException("Nome de departamento já cadastrado");
        }

        DepartamentoMapper.copyToEntity(req, existente);
        var salvo = repository.save(existente);
        return DepartamentoMapper.toResponse(salvo);
    }

    @Transactional
    public DepartamentoResponse inativar(Long id) {
        var existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento não encontrado"));
        existente.setAtivo(false);
        var salvo = repository.save(existente);
        return DepartamentoMapper.toResponse(salvo);
    }
}
