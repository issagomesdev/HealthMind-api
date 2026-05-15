import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/authenticate'
import { UserController } from './users.controller'
import { UserRepository } from './users.repository'
import { UserService } from './users.service'

export async function userRoutes(app: FastifyInstance) {
  const repository = new UserRepository()
  const service = new UserService(repository)
  const controller = new UserController(service)

  app.patch(
    '/users/me',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Atualiza dados básicos do usuário autenticado',
        description:
          'Atualiza dados básicos da conta do usuário autenticado, como nome, e-mail, username e avatar. Todos os campos são opcionais — envie apenas os que deseja alterar.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              example: 'João Pedro Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao.pedro@email.com',
            },
            username: {
              type: 'string',
              minLength: 3,
              example: 'joaopedro',
            },
            avatar_url: {
              type: 'string',
              nullable: true,
              example: 'https://storage.healthmind.app/avatars/joaopedro.jpg',
            },
          },
        },
        response: {
          200: {
            description: 'Dados atualizados com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
              name: { type: 'string', example: 'João Pedro Silva' },
              email: { type: 'string', format: 'email', example: 'joao.pedro@email.com' },
              username: { type: 'string', example: 'joaopedro' },
              type: { type: 'string', enum: ['patient', 'professional'], example: 'patient' },
              avatar_url: { type: 'string', nullable: true, example: 'https://storage.healthmind.app/avatars/joaopedro.jpg' },
              profile_completed: { type: 'boolean', example: true },
              is_active: { type: 'boolean', example: true },
              created_at: { type: 'string', format: 'date-time', example: '2026-05-15T10:30:00.000Z' },
            },
          },
          400: {
            description: 'Dados inválidos',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string', example: 'body/email must match format "email"' },
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
          409: {
            description: 'E-mail ou username já em uso',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 409 },
              error: { type: 'string', example: 'Conflict' },
              message: { type: 'string', example: 'E-mail já está em uso por outro usuário' },
            },
          },
        },
      },
    },
    controller.updateMe.bind(controller),
  )

  app.patch(
    '/users/me/password',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Altera a senha do usuário autenticado',
        description:
          'Altera a senha do usuário autenticado mediante confirmação da senha atual.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['current_password', 'new_password'],
          properties: {
            current_password: {
              type: 'string',
              description: 'Senha atual do usuário',
              example: 'Senha@2026',
            },
            new_password: {
              type: 'string',
              minLength: 8,
              description: 'Nova senha desejada (mínimo 8 caracteres)',
              example: 'NovaSenha@2026',
            },
          },
        },
        response: {
          200: {
            description: 'Senha alterada com sucesso',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Senha alterada com sucesso',
              },
            },
          },
          400: {
            description: 'Dados inválidos ou senha atual incorreta',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string', example: 'Senha atual incorreta' },
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
    controller.changePassword.bind(controller),
  )
}
