package com.jampasafe.api.controller;

import com.jampasafe.api.model.Ocorrencia;
import com.jampasafe.api.service.OcorrenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Módulo de Gestão — responsável pelo cadastramento, atualização e remoção de ocorrências.
 *
 * Também expõe endpoints de listagem neste path para manter compatibilidade com o frontend.
 * O módulo de Consulta ({@link OcorrenciaConsultaController}) disponibiliza os mesmos
 * endpoints de leitura em /api/consulta/ocorrencias.
 */
@RestController
@RequestMapping("/api/ocorrencias")
@CrossOrigin(origins = "*")
public class OcorrenciaController {

    private final OcorrenciaService service;

    public OcorrenciaController(OcorrenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Ocorrencia> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Ocorrencia buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    /**
     * Cria uma nova ocorrência.
     */
    @PostMapping
    public ResponseEntity<Ocorrencia> criar(@RequestBody Ocorrencia ocorrencia) {
        Ocorrencia salva = service.criar(ocorrencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    /**
     * Atualiza completamente uma ocorrência existente (PUT).
     */
    @PutMapping("/{id}")
    public Ocorrencia atualizar(@PathVariable Long id, @RequestBody Ocorrencia dadosNovos) {
        return service.atualizar(id, dadosNovos);
    }

    /**
     * Atualiza parcialmente uma ocorrência existente (PATCH).
     */
    @PatchMapping("/{id}")
    public Ocorrencia atualizarParcial(@PathVariable Long id, @RequestBody Ocorrencia dadosParciais) {
        return service.atualizarParcial(id, dadosParciais);
    }

    /**
     * Remove uma ocorrência pelo ID.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
