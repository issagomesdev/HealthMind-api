import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { loginSchema, registerSchema } from './auth.schema'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    const input = registerSchema.parse(request.body)
    const result = await this.authService.register(input)
    return reply.status(201).send(result)
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body)
    const result = await this.authService.login(input)
    return reply.status(200).send(result)
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const result = await this.authService.me(sub)
    return reply.status(200).send(result)
  }

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    // JWT é stateless — invalidação real requer implementação futura de
    // blacklist (Redis) ou refresh tokens com rotação.
    return reply.status(200).send({ message: 'Logout realizado com sucesso' })
  }
}
