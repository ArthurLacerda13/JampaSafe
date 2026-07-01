📑 Documentação de Requisitos: API REST JampaSafe
1. Visão Geral do Projeto
O objetivo deste documento é orientar o desenvolvimento do back-end para o sistema de zeladoria urbana JampaSafe. A aplicação deve substituir o mock JSON local por uma API REST robusta desenvolvida em Spring Boot com persistência em PostgreSQL, integrando-se perfeitamente ao front-end Angular existente.

2. Arquitetura e Stack Tecnológica
Framework Principal: Spring Boot 3.x

Linguagem: Java 17+

Persistência de Dados: Spring Data JPA

Banco de Dados: PostgreSQL

Gerenciador de Dependências: Maven ou Gradle

Segurança/Integração: Configuração de CORS habilitada para o endereço do front-end Angular (http://localhost:4200)

3. Estrutura de Módulos (Divisão de Responsabilidades)
Conforme solicitado, o sistema deve ser logicamente ou fisicamente dividido em dois escopos/módulos principais de manipulação do recurso Ocorrencia:

🔄 Módulo de Escrita (Cadastro e Remoção)
Responsável pelas operações que alteram o estado do banco de dados.

POST /api/ocorrencias: Criação de uma nova ocorrência (denúncia).

DELETE /api/ocorrencias/{id}: Exclusão de uma ocorrência do sistema.

PUT/PATCH /api/ocorrencias/{id}: Atualização dos dados (ex: alteração de status pelo painel do gestor).

🔍 Módulo de Leitura (Consulta e Listagem)
Responsável pelas operações de recuperação de dados, otimizando a exibição do Feed e do Painel.

GET /api/ocorrencias: Listagem de todas as ocorrências cadastradas.

GET /api/ocorrencias/{id}: Detalhamento de uma ocorrência específica através do seu ID.

4. Modelo de Dados (Entidade Ocorrencia)
Para manter a compatibilidade com as telas de Feed, Denúncia e Painel do Gestor do front-end, a entidade JPA deve possuir a seguinte estrutura básica:

Java
@Entity
@Table(name = "tb_ocorrencia")
public class Ocorrencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;
    
    @Column(nullable = false)
    private String localizacao; // Ex: Bairro ou Coordenadas
    
    @Column(nullable = false)
    private String categoria; // Ex: Iluminação, Buraco, Saneamento
    
    @Column(nullable = false)
    private String status; // Ex: PENDENTE, EM_ANDAMENTO, RESOLVIDO
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();

    // Getters, Setters e Construtores
}
5. Especificação dos Endpoints (Contrato da API)
POST /api/ocorrencias
Descrição: Cadastra uma nova denúncia.

Payload (Request Body):

JSON
{
  "titulo": "Poste apagado na Orla",
  "descricao": "Lâmpada queimada há 3 dias trazendo insegurança.",
  "localizacao": "Cabo Branco",
  "categoria": "Iluminação",
  "status": "PENDENTE"
}
Resposta de Sucesso: 21 Created com o objeto salvo e seu respectivo id.

GET /api/ocorrencias
Descrição: Retorna a lista completa de ocorrências para alimentar o Feed e o Painel do Gestor.

Resposta de Sucesso: 200 OK

Payload (Response Body):

JSON
[
  {
    "id": 1,
    "titulo": "Poste apagado na Orla",
    "descricao": "Lâmpada queimada há 3 dias trazendo insegurança.",
    "localizacao": "Cabo Branco",
    "categoria": "Iluminação",
    "status": "PENDENTE",
    "dataCriacao": "2026-06-30T19:00:00"
  }
]
GET /api/ocorrencias/{id}
Descrição: Busca os detalhes de uma ocorrência específica.

Resposta de Sucesso: 200 OK

Resposta de Erro: 404 Not Found se o ID não existir.

PUT /api/ocorrencias/{id}
Descrição: Atualiza uma ocorrência (ideal para o Gestor mudar o status para "EM_ANDAMENTO" ou "RESOLVIDO").

Resposta de Sucesso: 200 OK com o objeto atualizado.

DELETE /api/ocorrencias/{id}
Descrição: Remove uma ocorrência do sistema.

Resposta de Sucesso: 204 No Content (sem corpo de resposta).

6. Integração com o Front-End Angular
Para que a comunicação funcione perfeitamente, o desenvolvedor deve se atentar aos seguintes pontos:

Habilitar CORS no Spring Boot:
Adicionar a anotação @CrossOrigin(origins = "http://localhost:4200") nos Controllers ou criar uma configuração global.

Substituição do Mock no Angular:
No front-end, a alteração será feita no OcorrenciaService. Onde antes existia:

TypeScript
this.http.get('data/ocorrencias.json')
Agora será injetada a URL da API:

TypeScript
private apiUrl = 'http://localhost:8080/api/ocorrencias';
this.http.get(this.apiUrl)
7. Critérios de Aceite para o Codificador
O projeto deve compilar sem erros usando o Maven/Gradle.

O script SQL (schema.sql) ou a propriedade ddl-auto: update deve criar a tabela corretamente no PostgreSQL.

As respostas HTTP devem seguir os padrões REST (Tratamento de exceções com 404 para recursos não encontrados e 400 para requisições malformadas).