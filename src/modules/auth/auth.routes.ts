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
        body: {
          type: 'object',
          required: ['name', 'email', 'password', 'type'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            type: { type: 'string', enum: ['patient', 'professional'] },
          },
        },
        response: {
          201: {
            description: 'Usuário criado com sucesso',
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: { type: 'object' },
              profile_completed: { type: 'boolean' },
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
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
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
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
      },
    },
    controller.logout.bind(controller),
  )
}
