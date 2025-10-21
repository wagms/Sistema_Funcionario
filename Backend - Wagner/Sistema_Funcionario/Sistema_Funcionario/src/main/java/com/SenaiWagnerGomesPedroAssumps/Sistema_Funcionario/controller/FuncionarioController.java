package com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.controller;

import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.dto.FuncionarioRequestDTO;
import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.dto.FuncionarioResponseDTO;
import com.SenaiWagnerGomesPedroAssumps.Sistema_Funcionario.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponseDTO>> listar(
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) Boolean ativo
    ) {
        List<FuncionarioResponseDTO> lista = service.listar(cargo, ativo);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorId(@PathVariable Long id) {
        FuncionarioResponseDTO dto = service.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> criar(@Valid @RequestBody FuncionarioRequestDTO dto) {
        FuncionarioResponseDTO criado = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody FuncionarioRequestDTO dto
    ) {
        FuncionarioResponseDTO atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        service.inativar(id);
        return ResponseEntity.noContent().build();
    }
}