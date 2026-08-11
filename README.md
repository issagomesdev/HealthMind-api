# HealthMind — Conectando pacientes e profissionais de saúde mental (API)
 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=for-the-badge)

![Preview do site](https://media.byissa.dev/healthmind/api_preview.webp)

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#estrutura">Estrutura</a> •
  <a href="#rotas">Rotas</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#variaveis">Variáveis de Ambiente</a> •
  <a href="#docker">Docker</a> •
  <a href="#testes">Testes</a> •
  <a href="#deploy">Deploy</a> •
  <a href="#seguranca">Segurança</a> •
  <a href="#team">Equipe</a> •
  <a href="#related-projects">Projetos relacionados</a> •
  <a href="#licenca">Licença</a>
</p>

API RESTful da plataforma **HealthMind** — Conectando pacientes e profissionais de saúde mental.

Construída com Node.js + TypeScript + Fastify, seguindo princípios SOLID e arquitetura modular. Preparada para produção e deploy em VPS ou AWS.

<h2 id="sobre">📌 Sobre</h2>

O **HealthMind** é uma plataforma mobile de saúde mental que utiliza tecnologia para conectar pacientes e profissionais, promovendo cuidado emocional, bem-estar e acompanhamento psicológico de forma acessível e acolhedora.

A API serve como backend completo para o aplicativo mobile HealthMind, fornecendo:

- autenticação stateless com JWT
- gestão de perfis de pacientes e profissionais
- autorização por role (`patient` / `professional`)
- documentação interativa via Swagger/OpenAPI
- testes automatizados em camadas (unitário, integração, funcional, segurança e carga)

### Roadmap

**✅ Implementado**

- Autenticação completa (register, login, me, logout) com JWT
- Hash de senhas com bcryptjs
- Perfil do paciente — criação e atualização
- Perfil do profissional — criação e atualização
- Autorização por role com middleware `authorize`
- Validação de schemas com Zod
- Documentação Swagger/OpenAPI em `/docs`
- Testes unitários, de integração, funcionais e de segurança com Vitest
- Testes de carga com k6
- Docker Compose (desenvolvimento e produção)
- CI com GitHub Actions

**🔄 Planejado**

- Módulo de agendamentos (consultas)
- Módulo de diário emocional
- Módulo de check-in de humor
- Módulo de comunidade
- Sistema de notificações push
- Upload de arquivos
- Integração com gateway de pagamento
- WebSocket para chat paciente/profissional

<h2 id="tecnologias">🧪 Tecnologias</h2>

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 20 | Runtime |
| TypeScript | 5.x | Tipagem estática |
| Fastify | 4.x | Framework HTTP |
| Prisma ORM | 5.x | Acesso ao banco de dados |
| PostgreSQL | 16 | Banco de dados relacional |
| `@fastify/jwt` | — | Autenticação stateless com JWT |
| `@fastify/cors` | — | Controle de CORS |
| `@fastify/helmet` | — | Headers de segurança HTTP |
| `@fastify/rate-limit` | — | Limitação de requisições |
| Zod | 3.x | Validação de schemas e variáveis de ambiente |
| bcryptjs | — | Hash seguro de senhas |
| Docker + Compose | — | Containerização (dev e produção) |
| Swagger/OpenAPI | — | Documentação interativa |
| Vitest | — | Testes automatizados |
| k6 | — | Testes de carga e performance |

<h2 id="arquitetura">🏗️ Arquitetura</h2>

Arquitetura modular em camadas, com separação clara de responsabilidades:

```
Requisição HTTP
    │
    ▼
  Routes        ← registro de rotas Fastify + schema Swagger
    │
    ▼
Controller      ← recebe req/res, valida via Zod, delega ao service
    │
    ▼
  Service       ← regras de negócio, orquestra chamadas ao repository
    │
    ▼
Repository      ← acesso ao banco exclusivamente via Prisma
    │
    ▼
 PostgreSQL
```

Princípios aplicados: SOLID, separação de responsabilidades, injeção de dependência leve via importação.

<h2 id="estrutura">📁 Estrutura</h2>

```
src/
├── config/
│   └── env.ts                    # Validação de variáveis de ambiente com Zod
│
├── modules/                      # Funcionalidades organizadas por domínio
│   ├── auth/                     # Autenticação e controle de acesso
│   └── health/                   # Health check da API
│
├── shared/
│   ├── errors/
│   │   ├── AppError.ts           # Classe de erro com statusCode e message
│   │   └── ErrorHandler.ts       # Handler global de erros do Fastify
│   ├── infra/
│   │   └── prisma.ts             # Instância singleton do PrismaClient
│   ├── middlewares/              # Autenticação, autorização e segurança
│   ├── types/index.ts            # Tipos globais (JwtPayload, UserRole…)
│   └── utils/                    # Utilitários compartilhados
│
├── app.ts                        # Plugins, rotas e hooks do Fastify
└── server.ts                     # Bootstrap — inicia o servidor

prisma/
├── migrations/                   # Histórico de migrations
└── schema.prisma                 # Models e datasource

tests/
├── unit/                         # Testes unitários
├── integration/                  # Testes de integração (rotas + banco real)
├── functional/                   # Fluxos completos ponta a ponta
├── security/                     # Autenticação, autorização e proteção
├── performance/                  # Scripts k6 para carga
└── setup.ts                      # Configuração global de testes
```

<h2 id="rotas">🔀 Rotas</h2>

| Método | Rota | Auth | Role | Descrição |
|--------|------|:----:|:----:|-----------|
| `GET` | `/health` | — | — | Status da API |
| `POST` | `/auth/register` | — | — | Cadastro |
| `POST` | `/auth/login` | — | — | Login |
| `GET` | `/auth/me` | JWT | qualquer | Dados do usuário autenticado |
| `POST` | `/auth/logout` | JWT | qualquer | Logout |
| `GET` | `/patients/me` | JWT | patient | Perfil do paciente |
| `PUT` | `/patients/me` | JWT | patient | Atualiza perfil do paciente |
| `GET` | `/professionals/me` | JWT | professional | Perfil do profissional |
| `PUT` | `/professionals/me` | JWT | professional | Atualiza perfil do profissional |

Documentação interativa: `http://localhost:3333/docs`

### Fluxo de autenticação e onboarding

```
POST /auth/register
  └── Cria usuário + perfil inicial (patient ou professional)
  └── Retorna JWT + profile_completed: false

Frontend redireciona para onboarding

PUT /patients/me  ou  PUT /professionals/me
  └── Completa as informações de perfil
  └── API marca profile_completed: true automaticamente

GET /auth/me
  └── Frontend valida sessão e status do perfil
  └── Redireciona para o dashboard
```

<h2 id="getting-started">▶️ Getting Started</h2>

Escolha o fluxo adequado ao seu cenário:

- [Desenvolvimento local](#dev-local) — rodar a API direto na máquina com `npm run dev`
- [Docker local](#docker-local) — API + banco via Docker Compose, com hot reload
- [Produção / VPS](#producao) — imagem de produção otimizada via Docker Compose

<h3 id="dev-local">1. Desenvolvimento local (sem Docker)</h3>

**Pré-requisitos:** Node.js 20+, npm, Docker (para o banco)

```bash
# 1. Clonar e instalar dependências
git clone https://github.com/issagomesdev/HealthMind-api
cd HealthMind-api
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env — garanta que DATABASE_URL usa 'localhost' como host
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthmind

# 3. Subir apenas o banco de dados
docker compose up -d postgres

# 4. Aplicar migrations e gerar Prisma client
npm run prisma:migrate

# 5. Iniciar a API com hot reload
npm run dev
```

API: `http://localhost:3333`  
Swagger: `http://localhost:3333/docs`

> **Por que `localhost` no DATABASE_URL?**  
> Quando você roda `npm run dev` diretamente na sua máquina (fora de container), o banco PostgreSQL exposto na porta `5432` é acessado via `localhost`.

<h3 id="docker-local">2. Docker local (desenvolvimento com Docker Compose)</h3>

O `docker-compose.yml` sobe a API com hot reload e o PostgreSQL juntos, montando o código local via volume:

```bash
# Subir API + banco em background
docker compose up -d

# Aplicar migrations (primeira vez ou após novas migrations)
docker compose exec api npm run prisma:migrate

# Acompanhar logs
docker compose logs -f api

# Verificar containers em execução
docker compose ps
```

> **Por que `postgres` no DATABASE_URL dentro do Docker?**  
> Dentro do Docker Compose, os containers se comunicam pelo nome do serviço (não por `localhost`). A API enxerga o banco pelo hostname `postgres`, que é o nome do serviço definido no compose. O `docker-compose.yml` já define `DATABASE_URL=...@postgres:5432/healthmind` no bloco `environment` da API.

**Comandos úteis:**

```bash
docker compose restart api          # Reiniciar apenas a API
docker compose stop                 # Parar todos os containers
docker compose down                 # Parar e remover containers (dados persistem no volume)
docker compose down -v              # Parar, remover containers e apagar volumes (⚠️ perde dados)
docker compose build api            # Rebuild da imagem sem subir
docker compose up -d --build        # Rebuild e subir
```

**Comandos Prisma:**

```bash
npm run prisma:migrate    # Criar e aplicar nova migration (dev)
npm run prisma:generate   # Regenerar Prisma client
npm run prisma:studio     # Abrir interface visual do banco
```

<h2 id="variaveis">⚙️ Variáveis de Ambiente</h2>

```bash
cp .env.example .env
```

| Variável | Descrição | Dev | Produção |
|---|---|---|---|
| `PORT` | Porta HTTP da API | `3333` | `3333` |
| `NODE_ENV` | Ambiente de execução | `development` | `production` |
| `DATABASE_URL` | Conexão PostgreSQL | `...@localhost:5432/...` (local) ou `...@postgres:5432/...` (Docker) | URL do banco externo ou `...@postgres:5432/...` |
| `TEST_DATABASE_URL` | Banco de testes | `...@localhost:5433/...` | — não necessário |
| `JWT_SECRET` | Chave de assinatura JWT | qualquer string | **string aleatória ≥ 32 chars** |
| `JWT_EXPIRES_IN` | Expiração do token | `7d` | `7d` ou menos |
| `CORS_ORIGIN` | Origens CORS permitidas | `*` | URL exata do frontend web (ou `*` para uso em mobile) |

### DATABASE_URL: localhost vs postgres

```env
# ✅ Rodando npm run dev direto na máquina (banco via docker-expose ou local):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthmind

# ✅ Rodando dentro do Docker Compose (api e banco no mesmo compose):
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/healthmind
```

A diferença é o **host**: `localhost` (acesso direto na máquina) vs `postgres` (nome do serviço dentro da rede Docker).

### CORS_ORIGIN: entendendo o comportamento

O CORS é uma política de segurança dos **navegadores** (browsers). Ele não se aplica a:

- **React Native / Expo mobile** — apps mobile não são navegadores e não impõem CORS. O app faz requests diretamente à API sem restrição de origem, independente do valor de `CORS_ORIGIN`.
- **Swagger UI** — servido pelo próprio servidor, sem cross-origin.

Cenários práticos:

```env
# Desenvolvimento ou API consumida apenas por mobile:
CORS_ORIGIN=*

# Frontend web em desenvolvimento local (ex: Vite/React):
CORS_ORIGIN=http://localhost:5173

# Produção com frontend web:
CORS_ORIGIN=https://app.healthmind.com.br
```

> **Nota técnica:** Quando `CORS_ORIGIN=*`, a API reflete a origem da requisição ao invés de enviar o header `Access-Control-Allow-Origin: *`. Isso é necessário para manter compatibilidade com o header `Access-Control-Allow-Credentials: true`, que browsers exigem para requests com Authorization header. A segurança real é garantida pelo JWT — apenas tokens válidos acessam dados protegidos.

<h2 id="docker">🐳 Docker</h2>

### Dockerfile — estágios de build

O `Dockerfile` usa **multi-stage build** com dois estágios:

| Estágio | O que faz | Quando usar |
|---|---|---|
| `builder` | Instala dependências, gera Prisma client, compila TypeScript (`tsc`) | Intermediário |
| `production` | Imagem final: somente `dist/` + deps de produção, sem devDeps | Deploy |

O estágio `production` copia apenas os arquivos compilados de `dist/` e instala dependências sem `devDependencies` (`npm ci --omit=dev`), resultando em imagem enxuta e segura.

```bash
# Build manual da imagem de produção
docker build --target production -t healthmind-api .

# Rodar o container apontando para banco externo
docker run -d \
  --name healthmind-api \
  --env-file .env \
  -p 3333:3333 \
  healthmind-api
```

### docker-compose.yml (desenvolvimento)

Sobe API + PostgreSQL com código local montado via volume e hot reload (`tsx watch`):

```bash
docker compose up -d           # Subir em background
docker compose up              # Subir com logs no terminal
docker compose logs -f api     # Logs da API
docker compose logs -f         # Logs de todos os serviços
docker compose ps              # Status dos containers
docker compose restart api     # Reiniciar API
docker compose stop            # Parar (mantém containers)
docker compose down            # Remover containers (volumes persistem)
docker compose down -v         # Remover containers e volumes ⚠️
docker compose up -d --build   # Rebuild e subir
```

> O `docker-compose.yml` é **exclusivo para desenvolvimento**. Ele usa `npm run dev` (tsx watch) e volumes, portanto alterações no código são refletidas em tempo real sem rebuild.

### docker-compose.prod.yml (produção)

Sobe a imagem de produção compilada + PostgreSQL sem expor o banco ao host.

Configurações incluídas:
- `container_name`: `healthmind-api` e `healthmind-postgres` — nomes fixos para facilitar operação
- `logging`: limite de 10 MB por arquivo, máximo 3 arquivos rotacionados — evita disco cheio em produção
- `healthcheck`: verificação via Node.js inline (não usa `wget`/`curl`, ausentes no `node:20-alpine`)
- `restart: unless-stopped`: reinicia automaticamente em caso de falha

```bash
docker compose -f docker-compose.prod.yml up -d --build     # Subir/rebuild
docker compose -f docker-compose.prod.yml logs -f api       # Logs da API
docker compose -f docker-compose.prod.yml ps                # Status dos containers
docker compose -f docker-compose.prod.yml restart api       # Reiniciar API
docker compose -f docker-compose.prod.yml stop              # Parar
docker compose -f docker-compose.prod.yml down              # Remover containers

# Com container_name definido, também é possível usar docker direto:
docker logs -f healthmind-api
docker restart healthmind-api
docker exec -it healthmind-api sh
```

<h2 id="testes">🧪 Testes</h2>

### Pré-requisito

Subir o banco de testes isolado (porta `5433`):

```bash
docker compose -f docker-compose.test.yml up -d

# Aplicar migrations no banco de testes
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/healthmind_test \
  npx prisma migrate deploy
```

### Executar testes

```bash
npm test                   # Todos os testes
npm run test:unit          # Unitários
npm run test:integration   # Integração (rotas + banco real)
npm run test:functional    # Funcionais (fluxos completos)
npm run test:security      # Segurança (autenticação e autorização)
npm run test:coverage      # Com relatório de coverage
npm run test:watch         # Modo watch (desenvolvimento)
```

### Testes de carga com k6

> **Pré-requisito:** [k6 instalado](https://k6.io/docs/getting-started/installation/)

```bash
# Health check
k6 run tests/performance/health.k6.js

# Login
k6 run tests/performance/login.k6.js

# Auth/me com token
export TOKEN=$(curl -s -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"k6test@example.com","password":"senha12345"}' | jq -r '.token')

k6 run --env TOKEN=$TOKEN tests/performance/auth-me.k6.js
```

<h2 id="deploy">☁️ Deploy</h2>

<h3 id="producao">Produção com Docker Compose (VPS)</h3>

Fluxo completo para subir em um servidor Linux com Docker instalado:

**1. Configure o `.env` de produção no servidor:**

```env
PORT=3333
NODE_ENV=production

POSTGRES_USER=healthmind
POSTGRES_PASSWORD=senha_muito_segura_aqui
POSTGRES_DB=healthmind

# Host 'postgres' — nome do serviço dentro do Docker Compose
DATABASE_URL=postgresql://healthmind:senha_muito_segura_aqui@postgres:5432/healthmind

JWT_SECRET=string_aleatoria_longa_minimo_32_caracteres_aqui
JWT_EXPIRES_IN=7d

# CORS: use * se o frontend é somente mobile
# Para frontend web: use a URL exata
CORS_ORIGIN=*
```

**2. Faça o build e suba os containers:**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**3. Aplique as migrations:**

```bash
# Em produção: sempre 'migrate deploy', nunca 'migrate dev'
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

**4. Verifique o status:**

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f api
curl http://localhost:3333/health
```

**5. Atualizar após novo deploy:**

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Prisma: migrate dev vs migrate deploy

| Comando | Quando usar | O que faz |
|---|---|---|
| `prisma migrate dev` | **Desenvolvimento** | Cria nova migration, aplica, regenera client, pode resetar banco |
| `prisma migrate deploy` | **Produção** | Aplica somente migrations pendentes, sem interação, sem criar novas |

> Em produção use sempre `prisma migrate deploy`. O `migrate dev` é interativo e pode resetar dados — nunca deve rodar em produção.

### CI com GitHub Actions

O workflow `.github/workflows/ci.yml` roda em todo push para `main` e `develop`, e em pull requests.

Etapas:
1. Checkout do código
2. Setup Node.js 20 com cache de npm
3. Install das dependências
4. Lint com ESLint
5. Generate do Prisma client
6. Migrate no banco de testes (service container PostgreSQL)
7. Testes com coverage (Vitest)
8. Build TypeScript

### AWS (planejado)

| Serviço | Uso |
|---|---|
| **Amazon ECR** | Registry de imagens Docker |
| **AWS App Runner** | Deploy automático da API |
| **Amazon RDS PostgreSQL** | Banco de dados gerenciado |
| **AWS Secrets Manager** | Armazenamento seguro de variáveis sensíveis |

```bash
# 1. Autenticar no ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# 2. Build e push (estágio production)
docker build --target production -t healthmind-api .
docker tag healthmind-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/healthmind-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/healthmind-api:latest

# 3. Configurar App Runner para usar a imagem do ECR
# 4. Configurar variáveis via Secrets Manager
# 5. Apontar DATABASE_URL para o endpoint do RDS
```

### Troubleshooting

**API entra em `unhealthy` ou não passa no healthcheck**

```bash
# Ver detalhes do healthcheck
docker inspect healthmind-api | grep -A 10 Health

# Testar manualmente dentro do container
docker exec healthmind-api node -e \
  "require('http').get('http://localhost:3333/health',r=>console.log(r.statusCode))"

# Verificar se a API subiu corretamente
docker logs healthmind-api --tail 50
```

**`POSTGRES_PASSWORD` é obrigatório no compose de produção**

O `docker-compose.prod.yml` usa `${POSTGRES_PASSWORD:?Defina POSTGRES_PASSWORD no .env}`. Se a variável não estiver definida no `.env`, o Compose recusa iniciar com mensagem de erro. Defina `POSTGRES_PASSWORD` no `.env` antes de subir.

**Migrations não aplicadas — API falha ao iniciar**

```bash
# Aplicar migrations após subir os containers
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# Verificar status das migrations
docker compose -f docker-compose.prod.yml exec api npx prisma migrate status
```

**Erro de conexão com o banco (`ECONNREFUSED` ou `Can't reach database server`)**

- Dentro do Docker Compose: `DATABASE_URL` deve usar `postgres` (nome do serviço) como host, não `localhost`
- Fora do Docker: `DATABASE_URL` deve usar `localhost`
- Verificar se o container `healthmind-postgres` está `healthy`: `docker compose -f docker-compose.prod.yml ps`

**Logs ocupando muito disco**

O `docker-compose.prod.yml` e o `docker-compose.yml` já configuram `max-size: 10m` e `max-file: 3`. Para verificar o uso atual dos logs:

```bash
docker system df
docker logs healthmind-api --tail 100
```

<h2 id="seguranca">🔒 Segurança</h2>

### Checklist para produção

- [ ] `JWT_SECRET` com string aleatória segura (≥ 32 chars): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] `POSTGRES_PASSWORD` com senha forte — nunca usar `postgres` ou `change_me`
- [ ] `.env` não commitado no repositório (verificar `.gitignore`)
- [ ] `NODE_ENV=production` definido no container
- [ ] Porta do PostgreSQL **não exposta** ao host (sem `ports:` no serviço postgres em prod)
- [ ] Reverse proxy (nginx/Caddy/Traefik) na frente da API em produção
- [ ] HTTPS configurado no reverse proxy
- [ ] Rate limiting ativo (`@fastify/rate-limit` já configurado: 100 req/min)
- [ ] Headers de segurança ativos (`@fastify/helmet` já configurado)
- [ ] `CORS_ORIGIN` com URL exata do frontend web (se houver)
- [ ] Backups periódicos do volume do PostgreSQL
- [ ] Monitorar logs da API em produção

<h2 id="team">👥 Equipe</h2>

| Nome | Papel | LinkedIn |
|---|---|---|
| Hayssa Gomes | Desenvolvimento Front-end & Produto | [LinkedIn](https://www.linkedin.com/in/issagomesdev) |
| Vitoria Inacia | Produto, Pesquisa & Experiência | [LinkedIn](https://www.linkedin.com/in/vitoria-inacia-0a1086250) |
| Kelvson Nilson | Desenvolvimento & Solução Técnica | [LinkedIn](https://www.linkedin.com/in/kelvson-nilson-129751286/) |
| Leticia Oliveira | Pesquisa, Estratégia & Experiência | [LinkedIn](https://www.linkedin.com/in/-leticiaoliveira/) |
| Arthur Santo | Produto, Tecnologia & Apresentação | [LinkedIn](https://www.linkedin.com/in/arthur-santo-b8651a2b6/) |

<h2 id="related-projects">🔗 Projetos relacionados</h2>

| Projeto | Descrição | Link |
|---|---|---|
| **HealthMind App** | Aplicativo mobile do HealthMind, desenvolvido com React Native, Expo e TypeScript | <a href="https://github.com/issagomesdev/HealthMind">Acessar repositório</a> |
| **HealthMind Page** | Landing page oficial do HealthMind, desenvolvida com React, Vite, TypeScript e Tailwind CSS | <a href="https://github.com/issagomesdev/HealthMindPage">Acessar repositório</a> |

<h2 id="licenca">📄 Licença</h2>

Projeto desenvolvido para fins acadêmicos, demonstração técnica e evolução da plataforma HealthMind.
