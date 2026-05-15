import { AppError } from '../../shared/errors/AppError'
import { PatientRepository } from './patients.repository'
import { UpdatePatientInput } from './patients.schema'

export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async getMe(userId: string) {
    const patient = await this.patientRepository.findByUserId(userId)

    if (!patient) {
      throw new AppError('Perfil de paciente não encontrado', 404, 'PATIENT_NOT_FOUND')
    }

    return patient
  }

  async updateMe(userId: string, input: UpdatePatientInput) {
    const patient = await this.patientRepository.findByUserId(userId)

    if (!patient) {
      throw new AppError('Perfil de paciente não encontrado', 404, 'PATIENT_NOT_FOUND')
    }

    const updated = await this.patientRepository.update(userId, input)
    await this.patientRepository.markUserProfileCompleted(userId)

    return updated
  }
}
