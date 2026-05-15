# HealthMind — Conectando pacientes e profissionais de saúde mental (API) 

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=for-the-badge)

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#estrutura">Estrutura</a> •
  <a href="#rotas">Rotas</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#testes">Testes</a> •
  <a href="#deploy">Deploy</a>
</p>

API RESTful da plataforma **HealthMind** — Conectando pacientes e profissionais de saúde mental.

Construída com Node.js + TypeScript + Fastify, seguindo princípios SOLID e arquitetura modular. Preparada para produção, portfolio e deploy futuro na AWS.

<h2 id="sobre">📌 Sobre</h2>

O **HealthMind** é uma plataforma mobile de saúde mental que utiliza tecnologia para conectar pacientes e profissionais, promovendo cuidado emocional, bem-estar e acompanhamento psicológico de forma acessível e acolhedora.

A API serve como backend completo para o aplicativo mobile HealthMind, fornecendo:

- autenticação stateless com JWT
- gestão de perfis de pacientes e profissionais
- autorização por role (`patient` / `professional`)
- documentação interativa via Swagger/OpenAPI
- testes automatizados em camadas (unitário, integração, funcional, segurança e carga)

<h2 id="roadmap">🚧 Roadmap</h2>

### ✅ Implementado

- Autenticação completa (register, login, me, logout) com JWT
- Hash de senhas com bcryptjs
- Perfil do paciente — criação e atualização
- Perfil do profissional — criação e atualização 
- Autorização por role com middleware `authorize`
- Validação de schemas com Zod
- Documentação Swagger/OpenAPI em `/docs`
- Testes unitários, de integração, funcionais e de segurança com Vitest
- Testes de carga com k6
- Docker Compose para desenvolvimento e testes
- CI com GitHub Actions
- Preparação para deploy na AWS (ECR + App Runner + RDS)

### 🔄 Planejado

- Módulo de agendamentos (consultas)
- Módulo de comunidade
- Módulo de diário emocional
- Módulo de check-in de humor
- Sistema de notificações push
- Upload de arquivos (foto de perfil, documento profissional)
- Rate limiting e proteção contra brute-force
- Integração com gateway de pagamento
- WebSocket para chat paciente/profissional
- Integração com IA para recomendações

<h2 id="tecnologias">🧪 Tecnologias</h2>

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 20 | Runtime |
| TypeScript | 5.x | Tipagem estática |
| Fastify | 4.x | Framework HTTP |
| Prisma ORM | 5.x | Acesso ao banco de dados |
| PostgreSQL | 15 | Banco de dados relacional |
| JWT (`@fastify/jwt`) | — | Autenticação stateless |
| Zod | 3.x | Validação de schemas e variáveis de ambiente |
| bcryptjs | — | Hash seguro de senhas |
| Docker + Compose | — | Containerização e banco local |
| Swagger/OpenAPI | — | Documentação interativa |
| ESLint + Prettier | — | Qualidade e formatação de código |
| Vitest | — | Testes automatizados |
| k6 | — | Testes de carga e performance |

<h2 id="arquitetura">🏗️ Arquitetura</h2>

O projeto segue arquitetura modular em camadas:

- **Controller** — recebe a requisição HTTP, delega ao service e retorna a resposta
- **Service** — contém as regras de negócio e orquestra as chamadas ao repository
- **Repository** — acesso ao banco via Prisma, isolado do restante da aplicação
- **Schema** — contrato Zod para validação de entrada e tipagem de saída
- **Routes** — registro das rotas Fastify com schema de documentação Swagger

Princípios aplicados:
- SOLID
- Separação clara de responsabilidades
- Injeção de dependência leve via importação

<h2 id="estrutura">📁 Estrutura</h2>

```
src/
├── config/
│   └── env.ts                          # Validação de variáveis de ambiente com Zod
│
├── modules/                            # Funcionalidades da API, organizadas por domínio
│   ├── auth/                           # Fluxos de autenticação e controle de acesso
│   ├── patients/                       # Regras e operações relacionadas aos pacientes
│   ├── professionals/                  # Regras e operações relacionadas aos profissionais
│   │
│   ├── users/                          # Operações gerais de usuário
│   └── health/                         # Health check da aplicação       
│
├── shared/                             # Componentes internos reutilizáveis entre os módulos da API
│   ├── errors/
│   │   ├── AppError.ts                 # Classe de erro com statusCode e message
│   │   └── ErrorHandler.ts             # Handler global de erros do Fastify
│   ├── infra/
│   │   └── prisma.ts                   # Instância singleton do PrismaClient
│   ├── middlewares/                    # Middlewares globais de autenticação, autorização e segurança
│   ├── types/
│   │   └── index.ts                    # Tipos globais (JwtPayload, UserRole…)
│   └── utils/                          # Utilitários compartilhados entre os módulos da aplicação
│
├── app.ts                              # Registro de plugins, rotas e hooks do Fastify
└── server.ts                           # Bootstrap: inicia o servidor na porta configurada

prisma/
├── migrations/                         # Histórico de migrations geradas pelo Prisma
└── schema.prisma                       # Definição dos models e datasource

tests/
├── unit/                               # Testes unitários de funções, services e regras isoladas
├── integration/                        # Testes de integração entre rotas, banco e serviços
├── functional/                         # Fluxos completos da aplicação ponta a ponta
├── security/                           # Testes de autenticação, autorização e proteção de rotas
├── performance/                        # Scripts k6 para testes de carga e desempenho
└── setup.ts                            # Configuração global do ambiente de testes
```

<h2 id="rotas">🔀 Rotas</h2>

| Método | Rota | Auth | Role | Descrição |
|--------|------|:----:|:----:|-----------|
| `GET` | `/health` | — | — | Status da API |
| `POST` | `/auth/register` | — | — | Cadastro de usuário |
| `POST` | `/auth/login` | — | — | Login |
| `GET` | `/auth/me` | JWT | qualquer | Dados do usuário autenticado |
| `POST` | `/auth/logout` | JWT | qualquer | Logout |
| `GET` | `/patients/me` | JWT | patient | Perfil do paciente |
| `PUT` | `/patients/me` | JWT | patient | Atualiza perfil do paciente |
| `GET` | `/professionals/me` | JWT | professional | Perfil do profissional |
| `PUT` | `/professionals/me` | JWT | professional | Atualiza perfil do profissional |

**Documentação interativa completa:** `http://localhost:3333/docs`

### Fluxo de autenticação e onboarding

```
1. POST /auth/register
   └── Cria o usuário e um perfil inicial (patient ou professional)
   └── Retorna JWT + profile_completed: false

2. Frontend redireciona para o onboarding complementar

3. PUT /patients/me  ou  PUT /professionals/me
   └── Usuário completa suas informações de perfil
   └── API marca profile_completed: true automaticamente

4. GET /auth/me
   └── Frontend valida a sessão e o status do perfil
   └── Usuário é redirecionado para o dashboard
```

<h2 id="getting-started">▶️ Getting Started</h2>

### Pré-requisitos

- Node.js 20+
- npm
- Docker + Docker Compose

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/issagomesdev/HealthMind-api
cd HealthMind-api

# Instalar dependências
npm install
```

### Configuração do `.env`

```bash
cp .env.example .env
```

Preencha as variáveis:

```env
PORT=3333
NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthmind
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/healthmind_test

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

### Rodando em desenvolvimento

```bash
# Subir o banco de dados
docker-compose up -d postgres

# Aplicar migrations e gerar Prisma client
npm run prisma:migrate

# Iniciar servidor com hot reload
npm run dev
```

A API estará em `http://localhost:3333`  
Swagger em `http://localhost:3333/docs`

### Comandos Prisma

```bash
npm run prisma:migrate    # Criar e aplicar migrations
npm run prisma:generate   # Gerar Prisma client
npm run prisma studio     # Interface visual do banco
```

### Build para produção

```bash
npm run build
# Arquivos compilados em dist/
```

<h2 id="testes">🧪 Testes</h2>

### Pré-requisito

Banco de testes rodando na porta `5433`:

```bash
docker-compose -f docker-compose.test.yml up -d
npx prisma migrate deploy
```

### Executar testes

```bash
npm test                   # Todos os testes
npm run test:unit          # Unitários
npm run test:integration   # Integração (rotas + banco real)
npm run test:functional    # Funcionais (fluxos completos)
npm run test:security      # Segurança (autorização)
npm run test:coverage      # Com relatório de coverage
npm run test:watch         # Modo watch para desenvolvimento
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

<h2 id="ci">⚙️ CI com GitHub Actions</h2>

O workflow `.github/workflows/ci.yml` é executado em todo push para `main` e `develop`, e em pull requests.

Etapas:

1. Checkout do código
2. Setup Node.js 20 com cache de npm
3. Install das dependências
4. Lint com ESLint
5. Generate do Prisma client
6. Migrate no banco de testes (service container PostgreSQL)
7. Testes com coverage (Vitest)
8. Build TypeScript

<h2 id="deploy">☁️ Deploy</h2>

### Docker

```bash
# Build da imagem
docker build -t healthmind-api .

# Executar container
docker run -d \
  --name healthmind-api \
  --env-file .env \
  -p 3333:3333 \
  healthmind-api
```

### AWS (planejado)

| Serviço | Uso |
|---|---|
| **Amazon ECR** | Registry de imagens Docker |
| **AWS App Runner** | Deploy automático da API |
| **Amazon RDS PostgreSQL** | Banco de dados gerenciado |
| **AWS Secrets Manager** | Armazenamento seguro de secrets |

```bash
# 1. Autenticar no ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# 2. Build e push da imagem
docker build -t healthmind-api .
docker tag healthmind-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/healthmind-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/healthmind-api:latest

# 3. Configurar App Runner para usar a imagem do ECR
# 4. Configurar variáveis de ambiente via Secrets Manager
# 5. Apontar DATABASE_URL para o RDS
```

<h2 id="related-projects">🔗 Related Projects</h2>

📱 Repositório do frontend mobile disponível <a href="https://github.com/issagomesdev/HealthMind">aqui</a>.

<h2 id="licenca">📄 Licença</h2>

Projeto desenvolvido para fins acadêmicos, demonstração técnica e evolução da plataforma HealthMind.