import { execSync } from 'child_process'
import { prisma } from '../src/shared/infra/prisma'

process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/healthmind_test'

beforeAll(async () => {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
})

afterEach(async () => {
  await prisma.patient.deleteMany()
  await prisma.professional.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
