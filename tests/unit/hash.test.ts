import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../src/shared/utils/hash'

describe('Hash utils', () => {
  it('deve gerar hash diferente da senha original', async () => {
    const hash = await hashPassword('minhasenha123')
    expect(hash).not.toBe('minhasenha123')
    expect(hash.length).toBeGreaterThan(0)
  })

  it('deve validar senha correta contra o hash', async () => {
    const password = 'minhasenha123'
    const hash = await hashPassword(password)
    const result = await comparePassword(password, hash)
    expect(result).toBe(true)
  })

  it('deve rejeitar senha incorreta', async () => {
    const hash = await hashPassword('minhasenha123')
    const result = await comparePassword('senhaerrada', hash)
    expect(result).toBe(false)
  })

  it('deve gerar hashes diferentes para a mesma senha (salt único)', async () => {
    const hash1 = await hashPassword('minhasenha123')
    const hash2 = await hashPassword('minhasenha123')
    expect(hash1).not.toBe(hash2)
  })
})
