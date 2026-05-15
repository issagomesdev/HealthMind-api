import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../../src/app'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance
let professionalToken: string
let patientToken: string

beforeAll(async () => {
  app = await buildApp()
  await app.ready()

  const ts = Date.now()

  const profRes = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Profissional Integração 2',
      email: `prof2_integ_${ts}@example.com`,
      username: `prof2_integ_${ts}`,
      password: 'senha12345',
      type: 'professional',
    },
  })
  professionalToken = JSON.parse(profRes.body).token

  const patientRes = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Paciente Integração 2',
      email: `patient2_integ_${ts}@example.com`,
      username: `patient2_integ_${ts}`,
      password: 'senha12345',
      type: 'patient',
    },
  })
  patientToken = JSON.parse(patientRes.body).token
})

afterAll(async () => {
  await app.close()
})

describe('GET /professionals/me', () => {
  it('deve retornar perfil do profissional', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/professionals/me',
      headers: { authorization: `Bearer ${professionalToken}` },
    })
    expect(response.statusCode).toBe(200)
  })

  it('não deve permitir acesso de patient', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/professionals/me',
      headers: { authorization: `Bearer ${patientToken}` },
    })
    expect(response.statusCode).toBe(403)
  })
})

describe('PUT /professionals/me', () => {
  it('deve atualizar perfil do profissional', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/professionals/me',
      headers: { authorization: `Bearer ${professionalToken}` },
      payload: {
        full_name: 'Dr. Profissional Teste',
        specialty: 'Psicologia Clínica',
        register_type: 'CRP',
        professional_register: '06/12345',
        register_state: 'SP',
        bio: 'Profissional com experiência em saúde mental',
        experience_years: 5,
        offers_online_care: true,
        offers_in_person_care: true,
        consultation_price: 200.0,
      },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.specialty).toBe('Psicologia Clínica')
    expect(body.offers_online_care).toBe(true)
  })

  it('não deve permitir acesso de patient em PUT /professionals/me', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/professionals/me',
      headers: { authorization: `Bearer ${patientToken}` },
      payload: { specialty: 'Psicologia' },
    })
    expect(response.statusCode).toBe(403)
  })
})
