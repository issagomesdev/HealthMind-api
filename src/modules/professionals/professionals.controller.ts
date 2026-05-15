import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfessionalService } from './professionals.service'
import { updateProfessionalSchema } from './professionals.schema'

export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const professional = await this.professionalService.getMe(sub)
    return reply.status(200).send(professional)
  }

  async updateMe(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const input = updateProfessionalSchema.parse(request.body)
    const professional = await this.professionalService.updateMe(sub, input)
    return reply.status(200).send(professional)
  }
}
