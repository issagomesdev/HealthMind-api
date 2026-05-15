import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../../src/app'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => {
  app = await buildApp()
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Fluxo completo: registro → login → onboarding → perfil concluído', () => {
  const ts = Date.now()
  const credentials = {
    name: 'Fluxo Completo',
    email: `fluxo_${ts}@example.com`,
    username: `fluxo_${ts}`,
    password: 'senha12345',
    type: 'patient' as const,
  }

  let token: string

  it('1. deve registrar o usuário', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: credentials,
    })

    expect(res.statusCode).toBe(201)
    const body = JSON.parse(res.body)
    token = body.token
    expect(body.profile_completed).toBe(false)
  })

  it('2. deve fazer login', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: credentials.email, password: credentials.password },
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    token = body.token
    expect(body.user.email).toBe(credentials.email)
  })

  it('3. deve retornar /auth/me com profile_completed=false', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.profile_completed).toBe(false)
  })

  it('4. deve atualizar perfil do paciente (onboarding)', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/patients/me',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        phone: '11999999999',
        address_city: 'São Paulo',
        address_state: 'SP',
        main_complaint: 'Ansiedade e estresse no trabalho',
        therapy_goals: 'Melhorar a qualidade de vida',
        has_previous_therapy: false,
        has_health_insurance: false,
      },
    })

    expect(res.statusCode).toBe(200)
  })

  it('5. deve retornar /auth/me com profile_completed=true após onboarding', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.profile_completed).toBe(true)
  })
})

describe('Fluxo completo: registro → onboarding de profissional', () => {
  const ts = Date.now()
  let token: string

  it('1. deve registrar o profissional', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Fluxo Profissional',
        email: `prof_fluxo_${ts}@example.com`,
        username: `prof_fluxo_${ts}`,
        password: 'senha12345',
        type: 'professional',
      },
    })

    expect(res.statusCode).toBe(201)
    token = JSON.parse(res.body).token
  })

  it('2. deve atualizar perfil profissional', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/professionals/me',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        specialty: 'Psiquiatria',
        register_type: 'CRM',
        professional_register: '12345',
        register_state: 'SP',
        offers_online_care: true,
      },
    })

    expect(res.statusCode).toBe(200)
  })

  it('3. deve retornar profile_completed=true', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).profile_completed).toBe(true)
  })
})
