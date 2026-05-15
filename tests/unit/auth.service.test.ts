import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../../src/modules/auth/auth.service'
import { AuthRepository } from '../../src/modules/auth/auth.repository'
import { AppError } from '../../src/shared/errors/AppError'

process.env.JWT_SECRET = 'test_secret_with_at_least_8_chars'
process.env.JWT_EXPIRES_IN = '7d'
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/healthmind_test'

const makeUser = (overrides = {}) => ({
  id: 'user-id-123',
  name: 'Test User',
  email: 'test@example.com',
  username: 'testuser',
  password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz012345',
  type: 'patient' as const,
  avatar_url: null,
  profile_completed: false,
  email_verified_at: null,
  is_active: true,
  last_login_at: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  patient: { id: 'patient-id-123', user_id: 'user-id-123' },
  professional: null,
  ...overrides,
})

describe('AuthService', () => {
  let service: AuthService
  let repository: AuthRepository

  beforeEach(() => {
    repository = {
      findByEmail: vi.fn(),
      findByUsername: vi.fn(),
      findByIdWithProfile: vi.fn(),
      createUserWithProfile: vi.fn(),
      updateLastLogin: vi.fn(),
    } as unknown as AuthRepository

    service = new AuthService(repository)
  })

  describe('register', () => {
    it('deve registrar usuário e gerar username automaticamente', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null)
      vi.mocked(repository.findByUsername).mockResolvedValue(null)
      vi.mocked(repository.createUserWithProfile).mockResolvedValue(makeUser() as any)

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'senha12345',
        type: 'patient',
      })

      expect(result.token).toBeDefined()
      expect(result.user.email).toBe('test@example.com')
      expect(result.user.username).toBeDefined()
      expect(result.profile_completed).toBe(false)
    })

    it('não deve expor password_hash no retorno', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null)
      vi.mocked(repository.findByUsername).mockResolvedValue(null)
      vi.mocked(repository.createUserWithProfile).mockResolvedValue(makeUser() as any)

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'senha12345',
        type: 'patient',
      })

      expect((result.user as any).password_hash).toBeUndefined()
    })

    it('deve lançar erro se email já existe', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(makeUser() as any)

      await expect(
        service.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'senha12345',
          type: 'patient',
        }),
      ).rejects.toThrow(AppError)
    })

    it('deve gerar username único mesmo quando o base já existe', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null)
      // Base "testuser" exists, next attempt should be unique
      vi.mocked(repository.findByUsername)
        .mockResolvedValueOnce(makeUser() as any) // base taken
        .mockResolvedValue(null)                  // suffix is free
      vi.mocked(repository.createUserWithProfile).mockResolvedValue(makeUser() as any)

      const result = await service.register({
        name: 'Test User',
        email: 'test2@example.com',
        password: 'senha12345',
        type: 'patient',
      })

      expect(result.token).toBeDefined()
    })
  })

  describe('login', () => {
    it('deve lançar erro se usuário não encontrado', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null)

      await expect(
        service.login({ email: 'naoexiste@example.com', password: 'senha123' }),
      ).rejects.toThrow(AppError)
    })

    it('deve lançar erro se usuário inativo', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(makeUser({ is_active: false }) as any)

      await expect(
        service.login({ email: 'test@example.com', password: 'senha123' }),
      ).rejects.toThrow(AppError)
    })
  })

  describe('autorização por tipo', () => {
    it('deve retornar type correto no token de patient', async () => {
      vi.mocked(repository.findByEmail).mockResolvedValue(null)
      vi.mocked(repository.findByUsername).mockResolvedValue(null)
      vi.mocked(repository.createUserWithProfile).mockResolvedValue(makeUser() as any)

      const result = await service.register({
        name: 'Paciente Teste',
        email: 'paciente@example.com',
        password: 'senha12345',
        type: 'patient',
      })

      expect(result.user.type).toBe('patient')
    })
  })
})
