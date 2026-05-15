import { AppError } from '../../shared/errors/AppError'
import { comparePassword, hashPassword } from '../../shared/utils/hash'
import { UserRepository } from './users.repository'
import { ChangePasswordInput, UpdateUserInput } from './users.schema'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateMe(userId: string, input: UpdateUserInput) {
    if (input.email) {
      const existing = await this.userRepository.findByEmail(input.email)
      if (existing && existing.id !== userId) {
        throw new AppError('E-mail já em uso', 409, 'EMAIL_ALREADY_EXISTS')
      }
    }

    if (input.username) {
      input.username = input.username.toLowerCase()
      const existing = await this.userRepository.findByUsername(input.username)
      if (existing && existing.id !== userId) {
        throw new AppError('Username já em uso', 409, 'USERNAME_ALREADY_EXISTS')
      }
    }

    const updated = await this.userRepository.update(userId, input)
    return this.sanitize(updated)
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND')

    const valid = await comparePassword(input.current_password, user.password_hash)
    if (!valid) throw new AppError('Senha atual incorreta', 401, 'INVALID_PASSWORD')

    const password_hash = await hashPassword(input.new_password)
    await this.userRepository.update(userId, { password_hash })

    return { message: 'Senha alterada com sucesso' }
  }

  private sanitize(user: {
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
