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

const baseUser = {
  name: 'Integração Teste',
  email: `test+${Date.now()}@example.com`,
  password: 'senha12345',
  type: 'patient',
}

describe('POST /auth/register', () => {
  it('deve criar usuário patient e retornar token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: baseUser,
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.token).toBeDefined()
    expect(body.user.email).toBe(baseUser.email)
    expect(body.user.username).toBeDefined()
    expect(body.profile_completed).toBe(false)
    expect(body.user.password_hash).toBeUndefined()
  })

  it('deve gerar username automaticamente a partir do nome', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Maria Clara Silva',
        email: `maria_${Date.now()}@example.com`,
        password: 'senha12345',
        type: 'patient',
      },
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.user.username).toMatch(/^[a-z0-9_]+$/)
    expect(body.user.username.length).toBeGreaterThan(0)
  })

  it('deve criar usuário professional', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Profissional Teste',
        email: `prof+${Date.now()}@example.com`,
        password: 'senha12345',
        type: 'professional',
      },
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.user.type).toBe('professional')
    expect(body.user.username).toBeDefined()
  })

  it('não deve permitir cadastro com email duplicado', async () => {
    const email = `dup_${Date.now()}@example.com`

    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { name: 'Primeiro', email, password: 'senha12345', type: 'patient' },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { name: 'Segundo', email, password: 'senha12345', type: 'patient' },
    })

    expect(response.statusCode).toBe(409)
  })

  it('deve gerar usernames únicos para nomes iguais', async () => {
    const ts = Date.now()
    const r1 = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { name: 'João Silva', email: `joao1_${ts}@example.com`, password: 'senha12345', type: 'patient' },
    })
    const r2 = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { name: 'João Silva', email: `joao2_${ts}@example.com`, password: 'senha12345', type: 'patient' },
    })

    expect(r1.statusCode).toBe(201)
    expect(r2.statusCode).toBe(201)
    const u1 = JSON.parse(r1.body).user.username
    const u2 = JSON.parse(r2.body).user.username
    expect(u1).not.toBe(u2)
  })

  it('não deve permitir cadastro como admin', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Admin Tentativa',
        email: `admin_${Date.now()}@example.com`,
        password: 'senha12345',
        type: 'admin',
      },
    })

    expect(response.statusCode).toBe(422)
  })
})

describe('POST /auth/login', () => {
  const loginUser = {
    name: 'Login Teste',
    email: `login_${Date.now()}@example.com`,
    password: 'senha12345',
    type: 'patient',
  }

  beforeAll(async () => {
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: loginUser,
    })
  })

  it('deve fazer login com credenciais válidas', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: loginUser.email, password: loginUser.password },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.token).toBeDefined()
    expect(body.user.password_hash).toBeUndefined()
  })

  it('deve falhar com senha inválida', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: loginUser.email, password: 'senhaerrada' },
    })

    expect(response.statusCode).toBe(401)
  })

  it('deve falhar com email não cadastrado', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'naoexiste@example.com', password: 'senha12345' },
    })

    expect(response.statusCode).toBe(401)
  })
})

describe('GET /auth/me', () => {
  let token: string

  beforeAll(async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Me Teste',
        email: `me_${Date.now()}@example.com`,
        password: 'senha12345',
        type: 'patient',
      },
    })
    token = JSON.parse(response.body).token
  })

  it('deve retornar usuário autenticado com username gerado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.user).toBeDefined()
    expect(body.user.username).toBeDefined()
    expect(body.profile).toBeDefined()
    expect(body.user.password_hash).toBeUndefined()
  })

  it('deve falhar sem token', async () => {
    const response = await app.inject({ method: 'GET', url: '/auth/me' })
    expect(response.statusCode).toBe(401)
  })

  it('deve falhar com token inválido', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: 'Bearer token.invalido.aqui' },
    })
    expect(response.statusCode).toBe(401)
  })
})

describe('PATCH /users/me', () => {
  let token: string

  beforeAll(async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Edição Teste',
        email: `edit_${Date.now()}@example.com`,
        password: 'senha12345',
        type: 'patient',
      },
    })
    token = JSON.parse(response.body).token
  })

  it('deve atualizar o nome', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Nome Atualizado' },
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.user.name).toBe('Nome Atualizado')
    expect(body.user.password_hash).toBeUndefined()
  })

  it('deve atualizar o username', async () => {
    const newUsername = `user_edit_${Date.now()}`
    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      headers: { authorization: `Bearer ${token}` },
      payload: { username: newUsername },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).user.username).toBe(newUsername)
  })

  it('não deve permitir username já em uso', async () => {
    // Criar segundo usuário para pegar username
    const r = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Outro Usuário',
        email: `outro_${Date.now()}@example.com`,
        password: 'senha12345',
        type: 'patient',
      },
    })
    const otherUsername = JSON.parse(r.body).user.username

    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      headers: { authorization: `Bearer ${token}` },
      payload: { username: otherUsername },
    })

    expect(response.statusCode).toBe(409)
  })
})

describe('PATCH /users/me/password', () => {
  let token: string
  const password = 'senha12345'

  beforeAll(async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Senha Teste',
        email: `pwd_${Date.now()}@example.com`,
        password,
        type: 'patient',
      },
    })
    token = JSON.parse(response.body).token
  })

  it('deve alterar a senha com senha atual correta', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me/password',
      headers: { authorization: `Bearer ${token}` },
      payload: { current_password: password, new_password: 'novaSenha123' },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body).message).toBeDefined()
  })

  it('deve falhar com senha atual incorreta', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me/password',
      headers: { authorization: `Bearer ${token}` },
      payload: { current_password: 'senhaErrada', new_password: 'novaSenha456' },
    })

    expect(response.statusCode).toBe(401)
  })
})
