package com.senai.jonatas.funcionarios.controller;

import com.senai.jonatas.funcionarios.dto.DepartamentoRequest;
import com.senai.jonatas.funcionarios.dto.DepartamentoResponse;
import com.senai.jonatas.funcionarios.service.DepartamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Departamentos")
@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoController {

    private final DepartamentoService service;

    public DepartamentoController(DepartamentoService service) {
        this.service = service;
    }

    @Operation(summary = "Lista todos os departamentos")
    @GetMapping
    public ResponseEntity<List<DepartamentoResponse>> listar() {
        return ResponseEntity.ok(service.listar(false));
    }

    @Operation(summary = "Lista apenas departamentos ativos")
    @GetMapping("/ativos")
    public ResponseEntity<List<DepartamentoResponse>> listarAtivos() {
        return ResponseEntity.ok(service.listar(true));
    }

    @Operation(summary = "Cria novo departamento")
    @PostMapping
    public ResponseEntity<DepartamentoResponse> criar(@RequestBody DepartamentoRequest req) {
        var criado = service.criar(req);
        // location header
        return ResponseEntity.created(URI.create("/api/departamentos/" + criado.id())).body(criado);
    }

    @Operation(summary = "Atualiza departamento")
    @PutMapping("/{id}")
    public ResponseEntity<DepartamentoResponse> atualizar(@PathVariable Long id,
                                                          @RequestBody DepartamentoRequest req) {
        var atualizado = service.atualizar(id, req);
        return ResponseEntity.ok(atualizado);
    }

    @Operation(summary = "Inativa departamento")
    @PatchMapping("/{id}/inativar")
    public ResponseEntity<DepartamentoResponse> inativar(@PathVariable Long id) {
        var resp = service.inativar(id);
        return ResponseEntity.ok(resp);
    }
}
