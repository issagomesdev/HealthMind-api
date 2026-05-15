import { AppError } from '../../shared/errors/AppError'
import { hashPassword, comparePassword } from '../../shared/utils/hash'
import { signToken } from '../../shared/utils/jwt'
import { generateUniqueUsername } from '../../shared/utils/generate-username'
import { AuthRepository } from './auth.repository'
import { LoginInput, RegisterInput } from './auth.schema'

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(input: RegisterInput) {
    const emailExists = await this.authRepository.findByEmail(input.email)

    if (emailExists) {
      throw new AppError('E-mail já cadastrado', 409, 'EMAIL_ALREADY_EXISTS')
    }

    const username = await generateUniqueUsername(
      input.name,
      (u) => this.authRepository.findByUsername(u),
    )

    const password_hash = await hashPassword(input.password)

    const user = await this.authRepository.createUserWithProfile({
      name: input.name,
      email: input.email,
      username,
      password_hash,
      type: input.type,
    })

    const token = signToken({ sub: user.id, type: user.type })

    return {
      token,
      user: this.sanitizeUser(user),
      profile_completed: user.profile_completed,
    }
  }

  async login(input: LoginInput) {
    const user = await this.authRepository.findByEmail(input.email)

    if (!user || !user.is_active) {
      throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS')
    }

    const passwordMatch = await comparePassword(input.password, user.password_hash)

    if (!passwordMatch) {
      throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS')
    }

    await this.authRepository.updateLastLogin(user.id)

    const token = signToken({ sub: user.id, type: user.type })

    return {
      token,
      user: this.sanitizeUser(user),
      profile_completed: user.profile_completed,
    }
  }

  async me(userId: string) {
    const user = await this.authRepository.findByIdWithProfile(userId)

    if (!user || !user.is_active) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND')
    }

    const profile = user.type === 'patient' ? user.patient : user.professional

    return {
      user: this.sanitizeUser(user),
      profile,
      profile_completed: user.profile_completed,
    }
  }

  private sanitizeUser(user: {
    id: string
    name: string
    email: string
    username: string
    type: string
    avatar_url: string | null
    profile_completed: boolean
    is_active: boolean
    created_at: Date
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      type: user.type,
      avatar_url: user.avatar_url,
      profile_completed: user.profile_completed,
      is_active: user.is_active,
      created_at: user.created_at,
    }
  }
}
