import { PrismaClient, User } from '@prisma/client'
import { prisma as defaultPrisma } from '../../shared/infra/prisma'

interface UpdateData {
  name?: string
  email?: string
  username?: string
  avatar_url?: string | null
  password_hash?: string
}

export class UserRepository {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } })
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { username } })
  }

  async update(id: string, data: UpdateData): Promise<User> {
    return this.db.user.update({ where: { id }, data })
  }
}
