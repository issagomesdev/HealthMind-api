import { AppError } from '../../shared/errors/AppError'
import { ProfessionalRepository } from './professionals.repository'
import { UpdateProfessionalInput } from './professionals.schema'

export class ProfessionalService {
  constructor(private readonly professionalRepository: ProfessionalRepository) {}

  async getMe(userId: string) {
    const professional = await this.professionalRepository.findByUserId(userId)

    if (!professional) {
      throw new AppError('Perfil profissional não encontrado', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    return professional
  }

  async updateMe(userId: string, input: UpdateProfessionalInput) {
    const professional = await this.professionalRepository.findByUserId(userId)

    if (!professional) {
      throw new AppError('Perfil profissional não encontrado', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    const updated = await this.professionalRepository.update(userId, input)
    await this.professionalRepository.markUserProfileCompleted(userId)

    return updated
  }
}
