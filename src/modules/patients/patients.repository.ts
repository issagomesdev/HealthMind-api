import { PrismaClient } from '@prisma/client'
import { prisma as defaultPrisma } from '../../shared/infra/prisma'
import { UpdatePatientInput } from './patients.schema'

export class PatientRepository {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async findByUserId(userId: string) {
    return this.db.patient.findUnique({ where: { user_id: userId } })
  }

  async update(userId: string, data: UpdatePatientInput) {
    return this.db.patient.update({
      where: { user_id: userId },
      data: {
        ...data,
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
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
