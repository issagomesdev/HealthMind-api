import { describe, it, expect } from 'vitest'
import { signToken, verifyToken } from '../../src/shared/utils/jwt'

process.env.JWT_SECRET = 'test_secret_with_at_least_8_chars'
process.env.JWT_EXPIRES_IN = '7d'
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/healthmind_test'

describe('JWT utils', () => {
  it('deve gerar um token válido', () => {
    const payload = { sub: 'user-id-123', type: 'patient' as const }
    const token = signToken(payload)
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('deve verificar e retornar o payload correto', () => {
    const payload = { sub: 'user-id-123', type: 'patient' as const }
    const token = signToken(payload)
    const decoded = verifyToken(token)
    expect(decoded.sub).toBe(payload.sub)
    expect(decoded.type).toBe(payload.type)
  })

  it('deve lançar erro para token inválido', () => {
    expect(() => verifyToken('token.invalido.aqui')).toThrow()
  })

  it('deve lançar erro para token malformado', () => {
    expect(() => verifyToken('nao-e-um-token')).toThrow()
  })
})
