import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/authenticate'
import { authorize } from '../../shared/middlewares/authorize'
import { ProfessionalController } from './professionals.controller'
import { ProfessionalRepository } from './professionals.repository'
import { ProfessionalService } from './professionals.service'

export async function professionalRoutes(app: FastifyInstance) {
  const repository = new ProfessionalRepository()
  const service = new ProfessionalService(repository)
  const controller = new ProfessionalController(service)

  app.get(
    '/professionals/me',
    {
      preHandler: [authenticate, authorize('professional')],
      schema: {
        tags: ['Professionals'],
        summary: 'Retorna o perfil do profissional autenticado',
        security: [{ bearerAuth: [] }],
      },
    },
    controller.getMe.bind(controller),
  )

  app.put(
    '/professionals/me',
    {
      preHandler: [authenticate, authorize('professional')],
      schema: {
        tags: ['Professionals'],
        summary: 'Atualiza o perfil do profissional autenticado',
        security: [{ bearerAuth: [] }],
      },
    },
    controller.updateMe.bind(controller),
  )
}
