package com.jampasafe.api.controller;

import com.jampasafe.api.model.Ocorrencia;
import com.jampasafe.api.service.OcorrenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public ResponseEntity<Ocorrencia> criar(@RequestBody Ocorrencia ocorrencia) {
        Ocorrencia salva = service.criar(ocorrencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public Ocorrencia atualizar(@PathVariable Long id, @RequestBody Ocorrencia dadosNovos) {
        return service.atualizar(id, dadosNovos);
    }

    @PatchMapping("/{id}")
    public Ocorrencia atualizarParcial(@PathVariable Long id, @RequestBody Ocorrencia dadosParciais) {
        return service.atualizarParcial(id, dadosParciais);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
