import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../../src/app'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance
let patientToken: string
let professionalToken: string

beforeAll(async () => {
  app = await buildApp()
  await app.ready()

  const ts = Date.now()

  const patientRes = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Paciente Integração',
      email: `patient_integ_${ts}@example.com`,
      username: `patient_integ_${ts}`,
      password: 'senha12345',
      type: 'patient',
    },
  })
  patientToken = JSON.parse(patientRes.body).token

  const profRes = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Profissional Integração',
      email: `prof_integ_${ts}@example.com`,
      username: `prof_integ_${ts}`,
      password: 'senha12345',
      type: 'professional',
    },
  })
  professionalToken = JSON.parse(profRes.body).token
})

afterAll(async () => {
  await app.close()
})

describe('GET /patients/me', () => {
  it('deve retornar perfil do paciente', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/patients/me',
      headers: { authorization: `Bearer ${patientToken}` },
    })
    expect(response.statusCode).toBe(200)
  })

  it('não deve permitir acesso de professional', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/patients/me',
      headers: { authorization: `Bearer ${professionalToken}` },
    })
    expect(response.statusCode).toBe(403)
  })
})

describe('PUT /patients/me', () => {
  it('deve atualizar perfil do paciente', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/patients/me',
      headers: { authorization: `Bearer ${patientToken}` },
      payload: {
        phone: '11999999999',
        address_city: 'São Paulo',
        address_state: 'SP',
        main_complaint: 'Ansiedade generalizada',
        therapy_goals: 'Reduzir ansiedade e melhorar qualidade de vida',
        has_previous_therapy: false,
        has_health_insurance: true,
        health_insurance_name: 'Unimed',
      },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.phone).toBe('11999999999')
    expect(body.address_city).toBe('São Paulo')
  })

  it('não deve permitir acesso de professional em PUT /patients/me', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/patients/me',
      headers: { authorization: `Bearer ${professionalToken}` },
      payload: { phone: '11999999999' },
    })
    expect(response.statusCode).toBe(403)
  })
})
