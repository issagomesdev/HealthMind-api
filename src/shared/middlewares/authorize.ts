import { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/AppError'
import { UserType } from '../types'

export function authorize(...allowedTypes: UserType[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const { type } = request.user

    if (!allowedTypes.includes(type)) {
      throw new AppError('Acesso não autorizado para este tipo de usuário', 403, 'FORBIDDEN')
    }
  }
}
