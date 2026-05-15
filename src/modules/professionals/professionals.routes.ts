import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/authenticate'
import { authorize } from '../../shared/middlewares/authorize'
import { ProfessionalController } from './professionals.controller'
import { ProfessionalRepository } from './professionals.repository'
import { ProfessionalService } from './professionals.service'

export async function professionalRoutes(app: FastifyInstance) {
  const repository = new ProfessionalRepository()
  const service = new ProfessionalService(repository)
  const controller = new ProfessionalController(service)

  app.get(
    '/professionals/me',
    {
      preHandler: [authenticate, authorize('professional')],
      schema: {
        tags: ['Professionals'],
        summary: 'Retorna o perfil do profissional autenticado',
        description: 'Retorna o perfil completo do profissional autenticado.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Perfil do profissional retornado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' },
              user_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
              full_name: { type: 'string', nullable: true, example: 'Dra. Ana Paula Souza' },
              cpf: { type: 'string', nullable: true, example: '98765432100' },
              phone: { type: 'string', nullable: true, example: '11912345678' },
              birth_date: { type: 'string', format: 'date-time', nullable: true, example: '1985-03-22T00:00:00.000Z' },
              gender: {
                type: 'string',
                nullable: true,
                enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
                example: 'female',
              },
              professional_register: { type: 'string', nullable: true, example: '123456' },
              register_type: {
                type: 'string',
                nullable: true,
                enum: ['CRP', 'CRM', 'OTHER'],
                example: 'CRP',
              },
              register_state: { type: 'string', nullable: true, example: 'SP' },
              specialty: { type: 'string', nullable: true, example: 'Psicologia Clínica' },
              bio: {
                type: 'string',
                nullable: true,
                example: 'Psicóloga clínica com 10 anos de experiência em terapia cognitivo-comportamental.',
              },
              experience_years: { type: 'integer', nullable: true, example: 10 },
              approach: { type: 'string', nullable: true, example: 'Terapia Cognitivo-Comportamental (TCC)' },
              document_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://storage.healthmind.app/documents/crp_ana.pdf',
              },
              profile_photo_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://storage.healthmind.app/photos/ana_souza.jpg',
              },
              clinic_name: { type: 'string', nullable: true, example: 'Clínica Mente Sã' },
              consultation_price: { type: 'number', nullable: true, example: 180.0 },
              offers_online_care: { type: 'boolean', nullable: true, example: true },
              offers_in_person_care: { type: 'boolean', nullable: true, example: true },
              address_zipcode: { type: 'string', nullable: true, example: '01310100' },
              address_street: { type: 'string', nullable: true, example: 'Avenida Paulista' },
              address_number: { type: 'string', nullable: true, example: '2000' },
              address_complement: { type: 'string', nullable: true, example: 'Sala 301' },
              address_neighborhood: { type: 'string', nullable: true, example: 'Bela Vista' },
              address_city: { type: 'string', nullable: true, example: 'São Paulo' },
              address_state: { type: 'string', nullable: true, example: 'SP' },
              created_at: { type: 'string', format: 'date-time', example: '2026-05-15T10:30:00.000Z' },
              updated_at: { type: 'string', format: 'date-time', example: '2026-05-20T14:00:00.000Z' },
            },
          },
          401: {
            description: 'Token ausente ou inválido',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 401 },
              error: { type: 'string', example: 'Unauthorized' },
              message: { type: 'string', example: 'Token inválido ou ausente' },
            },
          },
          403: {
            description: 'Acesso negado — usuário não é profissional',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 403 },
              error: { type: 'string', example: 'Forbidden' },
              message: { type: 'string', example: 'Acesso permitido apenas para profissionais' },
            },
          },
        },
      },
    },
    controller.getMe.bind(controller),
  )

  app.put(
    '/professionals/me',
    {
      preHandler: [authenticate, authorize('professional')],
      schema: {
        tags: ['Professionals'],
        summary: 'Atualiza o perfil do profissional autenticado',
        description:
          'Atualiza as informações complementares do perfil do profissional autenticado. Todos os campos são opcionais — envie apenas os que deseja atualizar.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            full_name: {
              type: 'string',
              description: 'Nome completo do profissional',
              example: 'Dra. Ana Paula Souza',
            },
            cpf: {
              type: 'string',
              minLength: 11,
              maxLength: 11,
              description: 'CPF com 11 dígitos numéricos (sem pontuação)',
              example: '98765432100',
            },
            phone: {
              type: 'string',
              description: 'Número de telefone com DDD (somente dígitos)',
              example: '11912345678',
            },
            birth_date: {
              type: 'string',
              format: 'date-time',
              description: 'Data de nascimento no formato ISO 8601',
              example: '1985-03-22T00:00:00.000Z',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
              description: 'Gênero do profissional',
              example: 'female',
            },
            professional_register: {
              type: 'string',
              description: 'Número do registro profissional (CRP, CRM, etc.)',
              example: '123456',
            },
            register_type: {
              type: 'string',
              enum: ['CRP', 'CRM', 'OTHER'],
              description: 'Tipo do registro profissional',
              example: 'CRP',
            },
            register_state: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              description: 'Estado (UF) do registro profissional',
              example: 'SP',
            },
            specialty: {
              type: 'string',
              description: 'Especialidade do profissional',
              example: 'Psicologia Clínica',
            },
            bio: {
              type: 'string',
              maxLength: 2000,
              description: 'Biografia ou descrição profissional (máximo 2000 caracteres)',
              example: 'Psicóloga clínica com 10 anos de experiência em terapia cognitivo-comportamental, especializada em ansiedade e depressão.',
            },
            experience_years: {
              type: 'integer',
              minimum: 0,
              maximum: 60,
              description: 'Anos de experiência profissional',
              example: 10,
            },
            approach: {
              type: 'string',
              description: 'Abordagem terapêutica utilizada',
              example: 'Terapia Cognitivo-Comportamental (TCC)',
            },
            document_url: {
              type: 'string',
              format: 'uri',
              description: 'URL do documento comprobatório do registro profissional',
              example: 'https://storage.healthmind.app/documents/crp_ana.pdf',
            },
            profile_photo_url: {
              type: 'string',
              format: 'uri',
              description: 'URL da foto de perfil profissional',
              example: 'https://storage.healthmind.app/photos/ana_souza.jpg',
            },
            clinic_name: {
              type: 'string',
              description: 'Nome da clínica ou consultório',
              example: 'Clínica Mente Sã',
            },
            consultation_price: {
              type: 'number',
              minimum: 0,
              description: 'Valor da consulta em reais (BRL)',
              example: 180.0,
            },
            offers_online_care: {
              type: 'boolean',
              description: 'Indica se o profissional oferece atendimento online',
              example: true,
            },
            offers_in_person_care: {
              type: 'boolean',
              description: 'Indica se o profissional oferece atendimento presencial',
              example: true,
            },
            address_zipcode: {
              type: 'string',
              description: 'CEP do consultório/clínica (sem hífen)',
              example: '01310100',
            },
            address_street: {
              type: 'string',
              example: 'Avenida Paulista',
            },
            address_number: {
              type: 'string',
              example: '2000',
            },
            address_complement: {
              type: 'string',
              example: 'Sala 301',
            },
            address_neighborhood: {
              type: 'string',
              example: 'Bela Vista',
            },
            address_city: {
              type: 'string',
              example: 'São Paulo',
            },
            address_state: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              description: 'Sigla do estado (UF)',
              example: 'SP',
            },
          },
        },
        response: {
          200: {
            description: 'Perfil do profissional atualizado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' },
              user_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
              full_name: { type: 'string', nullable: true, example: 'Dra. Ana Paula Souza' },
              cpf: { type: 'string', nullable: true, example: '98765432100' },
              phone: { type: 'string', nullable: true, example: '11912345678' },
              birth_date: { type: 'string', format: 'date-time', nullable: true, example: '1985-03-22T00:00:00.000Z' },
              gender: {
                type: 'string',
                nullable: true,
                enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
                example: 'female',
              },
              professional_register: { type: 'string', nullable: true, example: '123456' },
              register_type: {
                type: 'string',
                nullable: true,
                enum: ['CRP', 'CRM', 'OTHER'],
                example: 'CRP',
              },
              register_state: { type: 'string', nullable: true, example: 'SP' },
              specialty: { type: 'string', nullable: true, example: 'Psicologia Clínica' },
              bio: {
                type: 'string',
                nullable: true,
                example: 'Psicóloga clínica com 10 anos de experiência em terapia cognitivo-comportamental.',
              },
              experience_years: { type: 'integer', nullable: true, example: 10 },
              approach: { type: 'string', nullable: true, example: 'Terapia Cognitivo-Comportamental (TCC)' },
              document_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://storage.healthmind.app/documents/crp_ana.pdf',
              },
              profile_photo_url: {
                type: 'string',
                format: 'uri',
                nullable: true,
                example: 'https://storage.healthmind.app/photos/ana_souza.jpg',
              },
              clinic_name: { type: 'string', nullable: true, example: 'Clínica Mente Sã' },
              consultation_price: { type: 'number', nullable: true, example: 180.0 },
              offers_online_care: { type: 'boolean', nullable: true, example: true },
              offers_in_person_care: { type: 'boolean', nullable: true, example: true },
              address_zipcode: { type: 'string', nullable: true, example: '01310100' },
              address_street: { type: 'string', nullable: true, example: 'Avenida Paulista' },
              address_number: { type: 'string', nullable: true, example: '2000' },
              address_complement: { type: 'string', nullable: true, example: 'Sala 301' },
              address_neighborhood: { type: 'string', nullable: true, example: 'Bela Vista' },
              address_city: { type: 'string', nullable: true, example: 'São Paulo' },
              address_state: { type: 'string', nullable: true, example: 'SP' },
              created_at: { type: 'string', format: 'date-time', example: '2026-05-15T10:30:00.000Z' },
              updated_at: { type: 'string', format: 'date-time', example: '2026-05-20T14:00:00.000Z' },
            },
          },
          400: {
            description: 'Dados inválidos',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string', example: 'body/experience_years must be <= 60' },
            },
          },
          401: {
            description: 'Token ausente ou inválido',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 401 },
              error: { type: 'string', example: 'Unauthorized' },
              message: { type: 'string', example: 'Token inválido ou ausente' },
            },
          },
          403: {
            description: 'Acesso negado — usuário não é profissional',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 403 },
              error: { type: 'string', example: 'Forbidden' },
              message: { type: 'string', example: 'Acesso permitido apenas para profissionais' },
            },
          },
        },
      },
    },
    controller.updateMe.bind(controller),
  )
}
