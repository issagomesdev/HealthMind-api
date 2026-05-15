import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/authenticate'
import { authorize } from '../../shared/middlewares/authorize'
import { PatientController } from './patients.controller'
import { PatientRepository } from './patients.repository'
import { PatientService } from './patients.service'

export async function patientRoutes(app: FastifyInstance) {
  const repository = new PatientRepository()
  const service = new PatientService(repository)
  const controller = new PatientController(service)

  app.get(
    '/patients/me',
    {
      preHandler: [authenticate, authorize('patient')],
      schema: {
        tags: ['Patients'],
        summary: 'Retorna o perfil do paciente autenticado',
        security: [{ bearerAuth: [] }],
      },
    },
    controller.getMe.bind(controller),
  )

  app.put(
    '/patients/me',
    {
      preHandler: [authenticate, authorize('patient')],
      schema: {
        tags: ['Patients'],
        summary: 'Atualiza o perfil do paciente autenticado',
        security: [{ bearerAuth: [] }],
      },
    },
    controller.updateMe.bind(controller),
  )
}
