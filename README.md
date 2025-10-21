# Sisteman de Gestão de Funcionários
Sistema desenvolvido em **Java 21** com **Spring Boot 3.5.6**, responsável por gerenciar o cadastro, listagem, atualização e inativação de funcionários
---
      Frontend realizado por: Pedro Assumpção
      Backend realizado por: Wagner Gomes
---
## Passos para execução
1. Clone o repositório?
2. '''bash
3. git clone https://github.com/wagms/Sistema_Funcionario.git
4. 2. Execute a aplicação com Maven:
      ./mvnw spring-boot:run

3. Acesse a documentação Swagger:
4. http://localhost:8080/swagger-ui.html

5. ## Dependências utilizadas
6. - Java 21
   - Spring Boot 3.5.6
   - Spring Web
   - Spring Data JPA
   - Spring Validation
   - H2 Database
   - Swagger UI
     
## Porta utilizadas
      API:8080
      Swagger UI: http://localhost:8080/swagger-ui.html
      H2 Console: http://localhost:8080/h2-console

## Exemplos de endpoint

      GET/api/funcionarios = Lista todos (com filtros)
      GET/api/funcionarios/{id} = Busca por ID
      POST/api/funcionarios = Cadastra novo funcionário
      PUT/api/funcionarios{id} = Atualiza funcionário
      PATCH/api/funcionarios/{id}/invativar = Inativa funcionário
