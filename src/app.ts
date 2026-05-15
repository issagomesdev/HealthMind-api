import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env } from './config/env'
import { errorHandler } from './shared/errors/ErrorHandler'
import { authRoutes } from './modules/auth/auth.routes'
import { patientRoutes } from './modules/patients/patients.routes'
import { professionalRoutes } from './modules/professionals/professionals.routes'
import { healthRoutes } from './modules/health/health.routes'
import { userRoutes } from './modules/users/users.routes'
import { JwtPayload } from './shared/types'

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload
  }
}

export async function buildApp() {
  const app = fastify({
    logger: env.NODE_ENV === 'development',
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  })

  await app.register(helmet, { contentSecurityPolicy: false })

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'HealthMind API',
        description: `## HealthMind — API de Saúde Mental

Bem-vindo à documentação interativa da API HealthMind. Esta API conecta pacientes e profissionais de saúde mental em uma plataforma segura e estruturada.

---

### Autenticação

A API utiliza **JWT Bearer Token**. Para acessar rotas protegidas:

1. Faça login em \`POST /auth/login\` ou cadastre-se em \`POST /auth/register\`.
2. Copie o campo \`token\` da resposta.
3. Clique no botão **Authorize** (cadeado) no topo desta página.
4. Insira o token no campo **Value** no formato: \`Bearer <seu_token>\`
5. Clique em **Authorize** e feche o modal.

O token é válido por **7 dias**.

---

### Fluxo de Onboarding

Após o cadastro, o campo \`profile_completed\` indica se o perfil complementar foi preenchido:

- **\`false\`** — o usuário ainda não completou o perfil (paciente ou profissional). Redirecione para a tela de onboarding.
- **\`true\`** — perfil completo. Libere o acesso total ao aplicativo.

Para completar o perfil:
- **Paciente**: \`PUT /patients/me\`
- **Profissional**: \`PUT /professionals/me\`

---

### Tipos de usuário

| Tipo | Valor |
|------|-------|
| Paciente | \`patient\` |
| Profissional | \`professional\` |
`,
        version: '1.0.0',
        contact: {
          name: 'HealthMind Team',
          email: 'contato@byissa.dev',
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          User: {
            type: 'object',
            description: 'Objeto de usuário retornado pela API (sem dados sensíveis)',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
              name: {
                type: 'string',
                example: 'João Silva',
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'joao.silva@email.com',
              },
              username: {
                type: 'string',
                example: 'joaosilva',
              },
              type: {
                type: 'string',
                enum: ['patient', 'professional'],
                example: 'patient',
              },
              avatar_url: {
                type: 'string',
                nullable: true,
                example: 'https://storage.healthmind.app/avatars/joaosilva.jpg',
              },
              profile_completed: {
                type: 'boolean',
                example: false,
              },
              is_active: {
                type: 'boolean',
                example: true,
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-15T10:30:00.000Z',
              },
            },
          },
          Patient: {
            type: 'object',
            description: 'Perfil complementar do paciente',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
              },
              user_id: {
                type: 'string',
                format: 'uuid',
                example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
              birth_date: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '1995-06-15T00:00:00.000Z',
              },
              gender: {
                type: 'string',
                nullable: true,
                enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
                example: 'male',
              },
              cpf: {
                type: 'string',
                nullable: true,
                example: '12345678901',
              },
              phone: {
                type: 'string',
                nullable: true,
                example: '11987654321',
              },
              address_zipcode: {
                type: 'string',
                nullable: true,
                example: '01310100',
              },
              address_street: {
                type: 'string',
                nullable: true,
                example: 'Avenida Paulista',
              },
              address_number: {
                type: 'string',
                nullable: true,
                example: '1000',
              },
              address_complement: {
                type: 'string',
                nullable: true,
                example: 'Apto 42',
              },
              address_neighborhood: {
                type: 'string',
                nullable: true,
                example: 'Bela Vista',
              },
              address_city: {
                type: 'string',
                nullable: true,
                example: 'São Paulo',
              },
              address_state: {
                type: 'string',
                nullable: true,
                example: 'SP',
              },
              emergency_contact_name: {
                type: 'string',
                nullable: true,
                example: 'Maria Silva',
              },
              emergency_contact_phone: {
                type: 'string',
                nullable: true,
                example: '11976543210',
              },
              emergency_contact_relationship: {
                type: 'string',
                nullable: true,
                example: 'Mãe',
              },
              main_complaint: {
                type: 'string',
                nullable: true,
                example: 'Ansiedade e dificuldade para dormir',
              },
              therapy_goals: {
                type: 'string',
                nullable: true,
                example: 'Reduzir a ansiedade e melhorar a qualidade do sono',
              },
              current_medications: {
                type: 'string',
                nullable: true,
                example: 'Nenhum',
              },
              has_previous_therapy: {
                type: 'boolean',
                nullable: true,
                example: true,
              },
              previous_therapy_notes: {
                type: 'string',
                nullable: true,
                example: 'Fiz terapia cognitivo-comportamental por 1 ano em 2023',
              },
              has_psychiatric_follow_up: {
                type: 'boolean',
                nullable: true,
                example: false,
              },
              has_health_insurance: {
                type: 'boolean',
                nullable: true,
                example: true,
              },
              health_insurance_name: {
                type: 'string',
                nullable: true,
                example: 'Unimed',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-15T10:30:00.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-20T14:00:00.000Z',
              },
            },
          },
          Professional: {
            type: 'object',
            description: 'Perfil complementar do profissional de saúde mental',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
              },
              user_id: {
                type: 'string',
                format: 'uuid',
                example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
              full_name: {
                type: 'string',
                nullable: true,
                example: 'Dra. Ana Paula Souza',
              },
              cpf: {
                type: 'string',
                nullable: true,
                example: '98765432100',
              },
              phone: {
                type: 'string',
                nullable: true,
                example: '11912345678',
              },
              birth_date: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '1985-03-22T00:00:00.000Z',
              },
              gender: {
                type: 'string',
                nullable: true,
                enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
                example: 'female',
              },
              professional_register: {
                type: 'string',
                nullable: true,
                example: '123456',
              },
              register_type: {
                type: 'string',
                nullable: true,
                enum: ['CRP', 'CRM', 'OTHER'],
                example: 'CRP',
              },
              register_state: {
                type: 'string',
                nullable: true,
                example: 'SP',
              },
              specialty: {
                type: 'string',
                nullable: true,
                example: 'Psicologia Clínica',
              },
              bio: {
                type: 'string',
                nullable: true,
                example: 'Psicóloga clínica com 10 anos de experiência em terapia cognitivo-comportamental.',
              },
              experience_years: {
                type: 'integer',
                nullable: true,
                example: 10,
              },
              approach: {
                type: 'string',
                nullable: true,
                example: 'Terapia Cognitivo-Comportamental (TCC)',
              },
              document_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://storage.healthmind.app/documents/crp_ana.pdf',
              },
              profile_photo_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://storage.healthmind.app/photos/ana_souza.jpg',
              },
              clinic_name: {
                type: 'string',
                nullable: true,
                example: 'Clínica Mente Sã',
              },
              consultation_price: {
                type: 'number',
                nullable: true,
                example: 180.0,
              },
              offers_online_care: {
                type: 'boolean',
                nullable: true,
                example: true,
              },
              offers_in_person_care: {
                type: 'boolean',
                nullable: true,
                example: true,
              },
              address_zipcode: {
                type: 'string',
                nullable: true,
                example: '01310100',
              },
              address_street: {
                type: 'string',
                nullable: true,
                example: 'Avenida Paulista',
              },
              address_number: {
                type: 'string',
                nullable: true,
                example: '2000',
              },
              address_complement: {
                type: 'string',
                nullable: true,
                example: 'Sala 301',
              },
              address_neighborhood: {
                type: 'string',
                nullable: true,
                example: 'Bela Vista',
              },
              address_city: {
                type: 'string',
                nullable: true,
                example: 'São Paulo',
              },
              address_state: {
                type: 'string',
                nullable: true,
                example: 'SP',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-15T10:30:00.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-20T14:00:00.000Z',
              },
            },
          },
          AuthResponse: {
            type: 'object',
            description: 'Resposta retornada após login ou cadastro bem-sucedido',
            properties: {
              token: {
                type: 'string',
                description: 'JWT válido por 7 dias',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIyYzNkNCIsInR5cGUiOiJwYXRpZW50IiwiaWF0IjoxNzM2OTM2NjAwLCJleHAiOjE3Mzc1NDE0MDB9.abc123',
              },
              user: {
                $ref: '#/components/schemas/User',
              },
              profile_completed: {
                type: 'boolean',
                description: 'Indica se o perfil complementar foi preenchido',
                example: false,
              },
            },
          },
          AuthMeResponse: {
            type: 'object',
            description: 'Resposta do endpoint GET /auth/me',
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              profile: {
                description: 'Perfil complementar do usuário (paciente ou profissional). Null se ainda não preenchido.',
                nullable: true,
                oneOf: [
                  { $ref: '#/components/schemas/Patient' },
                  { $ref: '#/components/schemas/Professional' },
                ],
              },
              profile_completed: {
                type: 'boolean',
                example: false,
              },
            },
          },
          ErrorResponse: {
            type: 'object',
            description: 'Resposta de erro padrão da API',
            properties: {
              statusCode: {
                type: 'integer',
                example: 400,
              },
              error: {
                type: 'string',
                example: 'Bad Request',
              },
              message: {
                type: 'string',
                example: 'Mensagem de erro descritiva',
              },
            },
          },
          ValidationErrorResponse: {
            type: 'object',
            description: 'Resposta de erro de validação (campos inválidos)',
            properties: {
              statusCode: {
                type: 'integer',
                example: 400,
              },
              error: {
                type: 'string',
                example: 'Bad Request',
              },
              message: {
                type: 'string',
                example: 'body/email must match format "email"',
              },
            },
          },
        },
      },
      tags: [
        { name: 'Health', description: 'Status da API' },
        { name: 'Auth', description: 'Autenticação' },
        { name: 'Users', description: 'Dados do usuário autenticado' },
        { name: 'Patients', description: 'Pacientes' },
        { name: 'Professionals', description: 'Profissionais' },
      ],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
      persistAuthorization: true,
    },
  })

  app.setErrorHandler(errorHandler)

  await app.register(healthRoutes)
  await app.register(authRoutes)
  await app.register(userRoutes)
  await app.register(patientRoutes)
  await app.register(professionalRoutes)

  return app
}
