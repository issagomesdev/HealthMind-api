import { FastifyRequest } from 'fastify'

export type UserType = 'patient' | 'professional' | 'admin'

export interface JwtPayload {
  sub: string
  type: UserType
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: JwtPayload
}
