import { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Verificação de saúde da API',
        description:
          'Endpoint público para verificar se a API está online e respondendo. Retorna o status atual, a data/hora do servidor e o tempo de atividade (uptime) em segundos.',
        response: {
          200: {
            description: 'API online e funcionando normalmente',
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'ok',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-15T12:00:00.000Z',
              },
              uptime: {
                type: 'number',
                description: 'Tempo de atividade do processo em segundos',
                example: 3600.5,
              },
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
