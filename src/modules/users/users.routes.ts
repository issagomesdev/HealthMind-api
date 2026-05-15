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
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            avatar_url: { type: 'string', nullable: true },
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
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['current_password', 'new_password'],
          properties: {
            current_password: { type: 'string' },
            new_password: { type: 'string', minLength: 8 },
          },
        },
      },
    },
    controller.changePassword.bind(controller),
  )
}
