import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/authenticate'
import { authorize } from '../../shared/middlewares/authorize'
import { PatientController } from './patients.controller'
import { PatientRepository } from './patients.repository'
import { PatientService } from './patients.service'

export async function patientRoutes(app: FastifyInstance) {
  const repository = new PatientRepository()
  const service = new PatientService(repository)
  const controller = new PatientController(service)

  app.get(
    '/patients/me',
    {
      preHandler: [authenticate, authorize('patient')],
      schema: {
        tags: ['Patients'],
        summary: 'Retorna o perfil do paciente autenticado',
        description: 'Retorna o perfil completo do paciente autenticado.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Perfil do paciente retornado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
              user_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
              birth_date: { type: 'string', format: 'date-time', nullable: true, example: '1995-06-15T00:00:00.000Z' },
              gender: {
                type: 'string',
                nullable: true,
                enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
                example: 'male',
              },
              cpf: { type: 'string', nullable: true, example: '12345678901' },
              phone: { type: 'string', nullable: true, example: '11987654321' },
              address_zipcode: { type: 'string', nullable: true, example: '01310100' },
              address_street: { type: 'string', nullable: true, example: 'Avenida Paulista' },
              address_number: { type: 'string', nullable: true, example: '1000' },
              address_complement: { type: 'string', nullable: true, example: 'Apto 42' },
              address_neighborhood: { type: 'string', nullable: true, example: 'Bela Vista' },
              address_city: { type: 'string', nullable: true, example: 'São Paulo' },
              address_state: { type: 'string', nullable: true, example: 'SP' },
              emergency_contact_name: { type: 'string', nullable: true, example: 'Maria Silva' },
              emergency_contact_phone: { type: 'string', nullable: true, example: '11976543210' },
              emergency_contact_relationship: { type: 'string', nullable: true, example: 'Mãe' },
              main_complaint: { type: 'string', nullable: true, example: 'Ansiedade e dificuldade para dormir' },
              therapy_goals: { type: 'string', nullable: true, example: 'Reduzir a ansiedade e melhorar a qualidade do sono' },
              current_medications: { type: 'string', nullable: true, example: 'Nenhum' },
              has_previous_therapy: { type: 'boolean', nullable: true, example: true },
              previous_therapy_notes: {
                type: 'string',
                nullable: true,
                example: 'Fiz terapia cognitivo-comportamental por 1 ano em 2023',
              },
              has_psychiatric_follow_up: { type: 'boolean', nullable: true, example: false },
              has_health_insurance: { type: 'boolean', nullable: true, example: true },
              health_insurance_name: { type: 'string', nullable: true, example: 'Unimed' },
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
            description: 'Acesso negado — usuário não é paciente',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 403 },
              error: { type: 'string', example: 'Forbidden' },
              message: { type: 'string', example: 'Acesso permitido apenas para pacientes' },
            },
          },
        },
      },
    },
    controller.getMe.bind(controller),
  )

  app.put(
    '/patients/me',
    {
      preHandler: [authenticate, authorize('patient')],
      schema: {
        tags: ['Patients'],
        summary: 'Atualiza o perfil do paciente autenticado',
        description:
          'Atualiza as informações complementares do perfil do paciente autenticado. Todos os campos são opcionais — envie apenas os que deseja atualizar.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            birth_date: {
              type: 'string',
              format: 'date-time',
              description: 'Data de nascimento no formato ISO 8601',
              example: '1995-06-15T00:00:00.000Z',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
              description: 'Gênero do paciente',
              example: 'male',
            },
            cpf: {
              type: 'string',
              minLength: 11,
              maxLength: 11,
              description: 'CPF com 11 dígitos numéricos (sem pontuação)',
              example: '12345678901',
            },
            phone: {
              type: 'string',
              description: 'Número de telefone com DDD (somente dígitos)',
              example: '11987654321',
            },
            address_zipcode: {
              type: 'string',
              description: 'CEP sem hífen',
              example: '01310100',
            },
            address_street: {
              type: 'string',
              example: 'Avenida Paulista',
            },
            address_number: {
              type: 'string',
              example: '1000',
            },
            address_complement: {
              type: 'string',
              example: 'Apto 42',
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
            emergency_contact_name: {
              type: 'string',
              example: 'Maria Silva',
            },
            emergency_contact_phone: {
              type: 'string',
              example: '11976543210',
            },
            emergency_contact_relationship: {
              type: 'string',
              example: 'Mãe',
            },
            main_complaint: {
              type: 'string',
              description: 'Queixa principal que motivou a busca por atendimento',
              example: 'Ansiedade e dificuldade para dormir',
            },
            therapy_goals: {
              type: 'string',
              description: 'Objetivos que o paciente deseja alcançar com a terapia',
              example: 'Reduzir a ansiedade e melhorar a qualidade do sono',
            },
            current_medications: {
              type: 'string',
              description: 'Medicamentos em uso atualmente (ou "Nenhum")',
              example: 'Nenhum',
            },
            has_previous_therapy: {
              type: 'boolean',
              description: 'Indica se o paciente já fez terapia anteriormente',
              example: true,
            },
            previous_therapy_notes: {
              type: 'string',
              description: 'Observações sobre experiências terapêuticas anteriores',
              example: 'Fiz terapia cognitivo-comportamental por 1 ano em 2023',
            },
            has_psychiatric_follow_up: {
              type: 'boolean',
              description: 'Indica se o paciente tem acompanhamento psiquiátrico',
              example: false,
            },
            has_health_insurance: {
              type: 'boolean',
              description: 'Indica se o paciente possui plano de saúde',
              example: true,
            },
            health_insurance_name: {
              type: 'string',
              description: 'Nome do plano de saúde (se houver)',
              example: 'Unimed',
            },
          },
        },
        response: {
          200: {
            description: 'Perfil do paciente atualizado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
              user_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
              birth_date: { type: 'string', format: 'date-time', nullable: true, example: '1995-06-15T00:00:00.000Z' },
              gender: {
                type: 'string',
                nullable: true,
                enum: ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'],
                example: 'male',
              },
              cpf: { type: 'string', nullable: true, example: '12345678901' },
              phone: { type: 'string', nullable: true, example: '11987654321' },
              address_zipcode: { type: 'string', nullable: true, example: '01310100' },
              address_street: { type: 'string', nullable: true, example: 'Avenida Paulista' },
              address_number: { type: 'string', nullable: true, example: '1000' },
              address_complement: { type: 'string', nullable: true, example: 'Apto 42' },
              address_neighborhood: { type: 'string', nullable: true, example: 'Bela Vista' },
              address_city: { type: 'string', nullable: true, example: 'São Paulo' },
              address_state: { type: 'string', nullable: true, example: 'SP' },
              emergency_contact_name: { type: 'string', nullable: true, example: 'Maria Silva' },
              emergency_contact_phone: { type: 'string', nullable: true, example: '11976543210' },
              emergency_contact_relationship: { type: 'string', nullable: true, example: 'Mãe' },
              main_complaint: { type: 'string', nullable: true, example: 'Ansiedade e dificuldade para dormir' },
              therapy_goals: { type: 'string', nullable: true, example: 'Reduzir a ansiedade e melhorar a qualidade do sono' },
              current_medications: { type: 'string', nullable: true, example: 'Nenhum' },
              has_previous_therapy: { type: 'boolean', nullable: true, example: true },
              previous_therapy_notes: {
                type: 'string',
                nullable: true,
                example: 'Fiz terapia cognitivo-comportamental por 1 ano em 2023',
              },
              has_psychiatric_follow_up: { type: 'boolean', nullable: true, example: false },
              has_health_insurance: { type: 'boolean', nullable: true, example: true },
              health_insurance_name: { type: 'string', nullable: true, example: 'Unimed' },
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
              message: { type: 'string', example: 'body/cpf must NOT have more than 11 characters' },
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
            description: 'Acesso negado — usuário não é paciente',
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 403 },
              error: { type: 'string', example: 'Forbidden' },
              message: { type: 'string', example: 'Acesso permitido apenas para pacientes' },
            },
          },
        },
      },
    },
    controller.updateMe.bind(controller),
  )
}
