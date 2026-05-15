import { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Verificação de saúde da API',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.status(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      })
    },
  )
}
