package com.jampasafe.api.controller;

import com.jampasafe.api.model.Ocorrencia;
import com.jampasafe.api.service.OcorrenciaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Módulo de Consulta — responsável exclusivamente pela listagem de ocorrências.
 *
 * Separa as operações de leitura (GET) das operações de escrita (POST, PUT, PATCH, DELETE),
 * atendendo ao requisito de dois módulos distintos na API.
 */
@RestController
@RequestMapping("/api/consulta/ocorrencias")
@CrossOrigin(origins = "*")
public class OcorrenciaConsultaController {

    private final OcorrenciaService service;

    public OcorrenciaConsultaController(OcorrenciaService service) {
        this.service = service;
    }

    /**
     * Lista todas as ocorrências cadastradas.
     */
    @GetMapping
    public List<Ocorrencia> listarTodas() {
        return service.listarTodas();
    }

    /**
     * Busca uma ocorrência específica pelo ID.
     */
    @GetMapping("/{id}")
    public Ocorrencia buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }
}
