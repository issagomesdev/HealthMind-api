import { FastifyReply, FastifyRequest } from 'fastify'
import { UserService } from './users.service'
import { changePasswordSchema, updateUserSchema } from './users.schema'

export class UserController {
  constructor(private readonly userService: UserService) {}

  async updateMe(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const input = updateUserSchema.parse(request.body)
    const user = await this.userService.updateMe(sub, input)
    return reply.status(200).send({ user })
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user
    const input = changePasswordSchema.parse(request.body)
    const result = await this.userService.changePassword(sub, input)
    return reply.status(200).send(result)
  }
}
