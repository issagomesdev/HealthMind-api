import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/authenticate'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'

export async function authRoutes(app: FastifyInstance) {
  const repository = new AuthRepository()
  const service = new AuthService(repository)
  const controller = new AuthController(service)

  app.post(
    '/auth/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Cadastrar novo usuário',
        description:
          'Cria uma nova conta de paciente ou profissional. O username é gerado automaticamente com base no nome informado.',
        body: {
          type: 'object',
          required: ['name', 'email', 'password', 'type'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao.silva@email.com',
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'Senha@2026',
            },
            type: {
              type: 'string',
              enum: ['patient', 'professional'],
              example: 'patient',
            },
          },
        },
        response: {
          201: {
            description: 'Usuário criado com sucesso',
            type: 'object',
            properties: {
              token: {
                type: 'string',
                description: 'JWT válido por 7 dias',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIyYzNkNCIsInR5cGUiOiJwYXRpZW50IiwiaWF0IjoxNzM2OTM2NjAwLCJleHAiOjE3Mzc1NDE0MDB9.abc123',
              },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', format: 'email', example: 'joao.silva@email.com' },
                  username: { type: 'string', example: 'joaosilva' },
                  type: { type: 'string', enum: ['patient', 'professional'], example: 'patient' },
                  avatar_url: { type: 'string', nullable: true, example: null },
                  profile_completed: { type: 'boolean', example: false },
                  is_active: { type: 'boolean', example: true },
                  created_at: { type: 'string', format: 'date-time', example: '2026-05-15T10:30:00.000Z' },
                },
              },
              profile_completed: {
                type: 'boolean',
                description: 'Indica se o perfil complementar foi preenchido. Após o cadastro sempre será false.',
                example: false,
              },
            },
          },
          400: {
            description: 'Dados inválidos ou ausentes',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string', example: 'body/email must match format "email"' },
            },
          },
          409: {
            description: 'E-mail já cadastrado',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 409 },
              error: { type: 'string', example: 'Conflict' },
              message: { type: 'string', example: 'E-mail já está em uso' },
            },
          },
        },
      },
    },
    controller.register.bind(controller),
  )

  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Login do usuário',
        description:
          'Autentica o usuário com e-mail e senha. Retorna um token JWT válido por 7 dias.',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'joao.silva@email.com',
            },
            password: {
              type: 'string',
              example: 'Senha@2026',
            },
          },
        },
        response: {
          200: {
            description: 'Login realizado com sucesso',
            type: 'object',
            properties: {
              token: {
                type: 'string',
                description: 'JWT válido por 7 dias',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIyYzNkNCIsInR5cGUiOiJwYXRpZW50IiwiaWF0IjoxNzM2OTM2NjAwLCJleHAiOjE3Mzc1NDE0MDB9.abc123',
              },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', format: 'email', example: 'joao.silva@email.com' },
                  username: { type: 'string', example: 'joaosilva' },
                  type: { type: 'string', enum: ['patient', 'professional'], example: 'patient' },
                  avatar_url: { type: 'string', nullable: true, example: null },
                  profile_completed: { type: 'boolean', example: true },
                  is_active: { type: 'boolean', example: true },
                  created_at: { type: 'string', format: 'date-time', example: '2026-05-15T10:30:00.000Z' },
                },
              },
              profile_completed: {
                type: 'boolean',
                description: 'Indica se o perfil complementar foi preenchido',
                example: true,
              },
            },
          },
          400: {
            description: 'Dados inválidos ou ausentes',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string', example: 'body/email must match format "email"' },
            },
          },
          401: {
            description: 'Credenciais inválidas',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 401 },
              error: { type: 'string', example: 'Unauthorized' },
              message: { type: 'string', example: 'E-mail ou senha inválidos' },
            },
          },
        },
      },
    },
    controller.login.bind(controller),
  )

  app.get(
    '/auth/me',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Retorna o usuário autenticado',
        description:
          'Retorna os dados do usuário autenticado e o perfil complementar (paciente ou profissional).',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Dados do usuário autenticado',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', format: 'email', example: 'joao.silva@email.com' },
                  username: { type: 'string', example: 'joaosilva' },
                  type: { type: 'string', enum: ['patient', 'professional'], example: 'patient' },
                  avatar_url: { type: 'string', nullable: true, example: null },
                  profile_completed: { type: 'boolean', example: true },
                  is_active: { type: 'boolean', example: true },
                  created_at: { type: 'string', format: 'date-time', example: '2026-05-15T10:30:00.000Z' },
                },
              },
              profile: {
                description: 'Perfil complementar do usuário. Null se ainda não preenchido.',
                nullable: true,
                type: 'object',
              },
              profile_completed: {
                type: 'boolean',
                example: true,
              },
            },
          },
          401: {
            description: 'Token ausente ou inválido',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 401 },
              error: { type: 'string', example: 'Unauthorized' },
              message: { type: 'string', example: 'Token inválido ou ausente' },
            },
          },
        },
      },
    },
    controller.me.bind(controller),
  )

  app.post(
    '/auth/logout',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Logout do usuário',
        description:
          'Encerra a sessão do usuário. Como o JWT é stateless, o token deve ser descartado pelo cliente.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Logout realizado com sucesso',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Logout realizado com sucesso',
              },
            },
          },
          401: {
            description: 'Token ausente ou inválido',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 401 },
              error: { type: 'string', example: 'Unauthorized' },
              message: { type: 'string', example: 'Token inválido ou ausente' },
            },
          },
        },
      },
    },
    controller.logout.bind(controller),
  )
}
