package com.jampasafe.api.controller;

import com.jampasafe.api.model.Ocorrencia;
import com.jampasafe.api.repository.OcorrenciaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
@CrossOrigin(origins = "http://localhost:4200")
public class OcorrenciaController {

    private final OcorrenciaRepository repository;

    public OcorrenciaController(OcorrenciaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Ocorrencia> listarTodas() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Ocorrencia buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Ocorrencia> criar(@RequestBody Ocorrencia ocorrencia) {
        validarOcorrencia(ocorrencia);
        // Garante que o ID é nulo para criação
        ocorrencia.setId(null);
        Ocorrencia salva = repository.save(ocorrencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public Ocorrencia atualizar(@PathVariable Long id, @RequestBody Ocorrencia dadosNovos) {
        validarOcorrencia(dadosNovos);
        Ocorrencia existente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));

        existente.setTitulo(dadosNovos.getTitulo());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setLocalizacao(dadosNovos.getLocalizacao());
        existente.setCategoria(dadosNovos.getCategoria());
        existente.setStatus(dadosNovos.getStatus());

        return repository.save(existente);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada");
        }
        repository.deleteById(id);
    }

    private void validarOcorrencia(Ocorrencia o) {
        if (o == null || 
            o.getTitulo() == null || o.getTitulo().trim().isEmpty() ||
            o.getDescricao() == null || o.getDescricao().trim().isEmpty() ||
            o.getLocalizacao() == null || o.getLocalizacao().trim().isEmpty() ||
            o.getCategoria() == null || o.getCategoria().trim().isEmpty() ||
            o.getStatus() == null || o.getStatus().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados da ocorrência inválidos ou incompletos");
        }
    }
}
