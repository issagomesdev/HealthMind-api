import { PrismaClient, User } from '@prisma/client'
import { prisma as defaultPrisma } from '../../shared/infra/prisma'

interface CreateUserData {
  name: string
  email: string
  username: string
  password_hash: string
  type: 'patient' | 'professional'
}

export class AuthRepository {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } })
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { username } })
  }

  async findByIdWithProfile(id: string) {
    return this.db.user.findUnique({
      where: { id },
      include: {
        patient: true,
        professional: true,
      },
    })
  }

  async createUserWithProfile(data: CreateUserData) {
    return this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password_hash: data.password_hash,
        type: data.type,
        ...(data.type === 'patient'
          ? { patient: { create: {} } }
          : { professional: { create: {} } }),
      },
      include: {
        patient: true,
        professional: true,
      },
    })
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { last_login_at: new Date() },
    })
  }
}
