# API do portfólio

API GraphQL que serve o meu portfólio e o blog. Cuida da autenticação, do cadastro de projetos e dos usuários, com a sessão em cookies httpOnly.

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-E10098?logo=graphql&logoColor=white)
![Licença](https://img.shields.io/badge/licen%C3%A7a-Apache--2.0-blue)

## Stack

- NestJS 11 com TypeScript 5.9
- GraphQL code-first com Apollo, schema gerado a partir dos decorators
- MongoDB com Mongoose 9
- JWT com access token de 15 minutos e refresh token de 7 dias, gravados em cookies httpOnly
- Validação na borda com class-validator e `ValidationPipe` global em `forbidNonWhitelisted`
- pnpm como gerenciador de pacotes e Node 24, versão fixada no `.nvmrc`
- Docker com três estágios no Dockerfile: development, builder e production
- GitHub Actions publicando imagem multi-arch no GHCR e disparando o deploy por webhook do Portainer

## Como rodar

```bash
pnpm install
cp .env.example .env       # troque o JWT_SECRET antes de qualquer coisa
pnpm docker:up             # sobe a API, o MongoDB e o Mongo Express
```

A API responde em `http://localhost:5050/graphql`, com o GraphiQL habilitado. O Mongo Express fica em `http://localhost:8081`.

Para rodar sem Docker, use `pnpm start:dev` com as variáveis `MONGODB_*` apontando para um MongoDB acessível.

## API GraphQL

Tudo exige autenticação, menos o que está marcado como público.

**Autenticação**

- `query health: String` (público): retorna `ok`
- `mutation login(input: LoginInput!)` (público): valida as credenciais e grava os cookies `accessToken` e `refreshToken`

**Projetos**

- `query getProjects(pagination: PaginationInput, filter: ProjectFilterInput, sorting: [ProjectSortingInput!]): ProjectPaginationType`
- `query getProjectId(id: ID!): Project`
- `mutation createProject(createProjectInput: CreateProjectInput!): Project`
- `mutation updateProject(id: ID!, updateProjectInput: UpdateProjectInput!): Project`
- `mutation deleteProject(id: ID!): Project`

## Organização do código

```
src/
  common/           decorators (@Public, @Filterable, @Sortable), DTOs e tipos de
                    paginação, guard de JWT, helper de paginação, schema base do Mongoose
  modules/
    app/            composição dos módulos, configuração do GraphQL, guard global
    authentication/ login, emissão dos tokens e escrita dos cookies
    database/       configuração da conexão com o Mongo
    projects/       CRUD de projetos com paginação, filtro e ordenação
    users/          schema e serviço de usuários
```

Filtro e ordenação vêm de decorators nos DTOs (`@Filterable` e `@Sortable`), e o `pagination.helper` monta a consulta no Mongo. É isso que deixa `getProjects` aceitar paginação, filtro e ordenação sem repetir esse código em cada módulo novo.

## Testes

```bash
pnpm test        # unitários com Jest
pnpm test:e2e    # ponta a ponta
pnpm test:cov    # com cobertura
```

## Status

Funcionando: autenticação com JWT, CRUD de projetos com paginação, filtro e ordenação, ambiente local em Docker e pipeline que builda, publica no GHCR e faz deploy por webhook.

Ainda por fazer: módulo de artigos, integração com as APIs do LinkedIn e do GitHub para importar foto e repositórios, e padronização de commits com commitlint e husky.

## Licença

Apache-2.0, conforme o arquivo `LICENSE`.
