import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env } from './config/env'
import { errorHandler } from './shared/errors/ErrorHandler'
import { authRoutes } from './modules/auth/auth.routes'
import { patientRoutes } from './modules/patients/patients.routes'
import { professionalRoutes } from './modules/professionals/professionals.routes'
import { healthRoutes } from './modules/health/health.routes'
import { userRoutes } from './modules/users/users.routes'
import { JwtPayload } from './shared/types'

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload
  }
}

export async function buildApp() {
  const app = fastify({
    logger: env.NODE_ENV === 'development',
  })

  await app.register(helmet, { contentSecurityPolicy: false })

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'HealthMind API',
        description: 'API backend da plataforma HealthMind de saúde mental',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Health', description: 'Status da API' },
        { name: 'Auth', description: 'Autenticação' },
        { name: 'Users', description: 'Dados do usuário autenticado' },
        { name: 'Patients', description: 'Pacientes' },
        { name: 'Professionals', description: 'Profissionais' },
      ],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  })

  app.setErrorHandler(errorHandler)

  await app.register(healthRoutes)
  await app.register(authRoutes)
  await app.register(userRoutes)
  await app.register(patientRoutes)
  await app.register(professionalRoutes)

  return app
}
