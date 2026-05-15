import { FastifyReply, FastifyRequest } from 'fastify'
import { PatientService } from './patients.service'
import { updatePatientSchema } from './patients.schema'

export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const patient = await this.patientService.getMe(sub)
    return reply.status(200).send(patient)
  }

  async updateMe(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const input = updatePatientSchema.parse(request.body)
    const patient = await this.patientService.updateMe(sub, input)
    return reply.status(200).send(patient)
  }
}
