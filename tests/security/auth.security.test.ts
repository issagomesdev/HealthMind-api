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

describe('Segurança: registro', () => {
  it('não deve permitir cadastro como admin', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Admin Hack',
        email: `admin_hack_${Date.now()}@example.com`,
        username: `admin_hack_${Date.now()}`,
        password: 'senha12345',
        type: 'admin',
      },
    })
    expect(res.statusCode).toBe(422)
  })

  it('deve rejeitar payload inválido', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { name: '', email: 'nao-e-email', password: '123' },
    })
    expect(res.statusCode).toBe(422)
  })

  it('não deve retornar password_hash no cadastro', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Segurança Teste',
        email: `sec_${Date.now()}@example.com`,
        username: `sec_${Date.now()}`,
        password: 'senha12345',
        type: 'patient',
      },
    })

    expect(res.statusCode).toBe(201)
    const body = JSON.parse(res.body)
    expect(body.user.password_hash).toBeUndefined()
  })
})

describe('Segurança: tentativa de SQL injection', () => {
  it('deve rejeitar tentativa de SQL injection no email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: "' OR '1'='1",
        password: "' OR '1'='1",
      },
    })
    expect([400, 401, 422]).toContain(res.statusCode)
  })

  it('deve rejeitar tentativa de SQL injection no username', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'SQL Injection',
        email: 'sqli@example.com',
        username: "'; DROP TABLE users; --",
        password: 'senha12345',
        type: 'patient',
      },
    })
    expect([400, 422]).toContain(res.statusCode)
  })
})

describe('Segurança: autenticação', () => {
  it('deve bloquear token inválido', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: 'Bearer token.falso.aqui' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('deve bloquear token sem prefixo Bearer', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: 'tokensembearer' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('deve bloquear ausência de token', async () => {
    const res = await app.inject({ method: 'GET', url: '/auth/me' })
    expect(res.statusCode).toBe(401)
  })

  it('não deve retornar password_hash no login', async () => {
    const ts = Date.now()
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Login Seg',
        email: `loginseg_${ts}@example.com`,
        username: `loginseg_${ts}`,
        password: 'senha12345',
        type: 'patient',
      },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: `loginseg_${ts}@example.com`, password: 'senha12345' },
    })

    const body = JSON.parse(res.body)
    expect(body.user.password_hash).toBeUndefined()
  })
})
