import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from './AppError'

export function errorHandler(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.code ?? 'APP_ERROR',
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(422).send({
      statusCode: 422,
      error: 'VALIDATION_ERROR',
      message: 'Dados inválidos',
      issues: error.flatten().fieldErrors,
    })
  }

  const fastifyError = error as FastifyError
  if (fastifyError.statusCode) {
    return reply.status(fastifyError.statusCode).send({
      statusCode: fastifyError.statusCode,
      error: fastifyError.code ?? 'FASTIFY_ERROR',
      message: fastifyError.message,
    })
  }

  console.error('[UnhandledError]', error)

  return reply.status(500).send({
    statusCode: 500,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor',
  })
}
