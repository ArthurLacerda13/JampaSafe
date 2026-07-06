package com.jampasafe.api.service;

import com.jampasafe.api.model.Ocorrencia;
import com.jampasafe.api.repository.OcorrenciaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository repository;

    public OcorrenciaService(OcorrenciaRepository repository) {
        this.repository = repository;
    }

    /**
     * Retorna todas as ocorrências cadastradas, ordenadas por data de criação (mais recentes primeiro).
     */
    public List<Ocorrencia> listarTodas() {
        return repository.findAllByOrderByDataCriacaoDesc();
    }

    /**
     * Busca uma ocorrência pelo ID. Lança 404 se não encontrada.
     */
    public Ocorrencia buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ocorrência com ID " + id + " não encontrada."));
    }

    /**
     * Cria uma nova ocorrência após validar os dados de entrada.
     */
    public Ocorrencia criar(Ocorrencia ocorrencia) {
        validar(ocorrencia);
        ocorrencia.setId(null); // Garante que é uma criação, nunca um update disfarçado
        ocorrencia.setDataCriacao(LocalDateTime.now());
        if (ocorrencia.getStatus() == null || ocorrencia.getStatus().isBlank()) {
            ocorrencia.setStatus("PENDENTE");
        }
        return repository.save(ocorrencia);
    }

    /**
     * Substitui completamente os dados de uma ocorrência existente (PUT).
     */
    public Ocorrencia atualizar(Long id, Ocorrencia dadosNovos) {
        validar(dadosNovos);
        Ocorrencia existente = buscarPorId(id);

        existente.setTitulo(dadosNovos.getTitulo());
        existente.setDescricao(dadosNovos.getDescricao());
        existente.setLocalizacao(dadosNovos.getLocalizacao());
        existente.setCategoria(dadosNovos.getCategoria());
        existente.setStatus(dadosNovos.getStatus());

        return repository.save(existente);
    }

    /**
     * Atualiza parcialmente uma ocorrência (PATCH).
     * Apenas os campos não nulos do payload são aplicados.
     */
    public Ocorrencia atualizarParcial(Long id, Ocorrencia dadosParciais) {
        Ocorrencia existente = buscarPorId(id);

        if (dadosParciais.getTitulo() != null && !dadosParciais.getTitulo().isBlank()) {
            existente.setTitulo(dadosParciais.getTitulo());
        }
        if (dadosParciais.getDescricao() != null && !dadosParciais.getDescricao().isBlank()) {
            existente.setDescricao(dadosParciais.getDescricao());
        }
        if (dadosParciais.getLocalizacao() != null && !dadosParciais.getLocalizacao().isBlank()) {
            existente.setLocalizacao(dadosParciais.getLocalizacao());
        }
        if (dadosParciais.getCategoria() != null && !dadosParciais.getCategoria().isBlank()) {
            existente.setCategoria(dadosParciais.getCategoria());
        }
        if (dadosParciais.getStatus() != null && !dadosParciais.getStatus().isBlank()) {
            existente.setStatus(dadosParciais.getStatus());
        }

        return repository.save(existente);
    }

    /**
     * Remove uma ocorrência pelo ID. Lança 404 se não existir.
     */
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Ocorrência com ID " + id + " não encontrada.");
        }
        repository.deleteById(id);
    }

    // ---- Validação interna ----

    private void validar(Ocorrencia o) {
        if (o == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Corpo da requisição não pode ser nulo.");
        }
        if (o.getTitulo() == null || o.getTitulo().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O campo 'titulo' é obrigatório.");
        }
        if (o.getDescricao() == null || o.getDescricao().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O campo 'descricao' é obrigatório.");
        }
        if (o.getLocalizacao() == null || o.getLocalizacao().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O campo 'localizacao' é obrigatório.");
        }
        if (o.getCategoria() == null || o.getCategoria().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O campo 'categoria' é obrigatório.");
        }
    }
}
