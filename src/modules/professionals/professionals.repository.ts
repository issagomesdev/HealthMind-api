import { PrismaClient } from '@prisma/client'
import { prisma as defaultPrisma } from '../../shared/infra/prisma'
import { UpdateProfessionalInput } from './professionals.schema'

export class ProfessionalRepository {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async findByUserId(userId: string) {
    return this.db.professional.findUnique({ where: { user_id: userId } })
  }

  async update(userId: string, data: UpdateProfessionalInput) {
    return this.db.professional.update({
      where: { user_id: userId },
      data: {
        ...data,
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
        consultation_price: data.consultation_price
          ? String(data.consultation_price)
          : undefined,
      },
    })
  }

  async markUserProfileCompleted(userId: string) {
    await defaultPrisma.user.update({
      where: { id: userId },
      data: { profile_completed: true },
    })
  }
}
