import { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/AppError'
import { verifyToken } from '../utils/jwt'

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token não fornecido', 401, 'MISSING_TOKEN')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token)
    request.user = payload
  } catch {
    throw new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN')
  }
}
