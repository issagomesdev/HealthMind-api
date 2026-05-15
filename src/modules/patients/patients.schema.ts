import { z } from 'zod'

export const updatePatientSchema = z.object({
  birth_date: z.string().datetime().optional(),
  gender: z.enum(['female', 'male', 'non_binary', 'other', 'prefer_not_to_say']).optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .optional(),
  phone: z.string().max(20).optional(),

  address_zipcode: z.string().max(10).optional(),
  address_street: z.string().max(200).optional(),
  address_number: z.string().max(20).optional(),
  address_complement: z.string().max(100).optional(),
  address_neighborhood: z.string().max(100).optional(),
  address_city: z.string().max(100).optional(),
  address_state: z.string().max(2).optional(),

  emergency_contact_name: z.string().max(100).optional(),
  emergency_contact_phone: z.string().max(20).optional(),
  emergency_contact_relationship: z.string().max(50).optional(),

  main_complaint: z.string().max(1000).optional(),
  therapy_goals: z.string().max(1000).optional(),
  current_medications: z.string().max(1000).optional(),
  has_previous_therapy: z.boolean().optional(),
  previous_therapy_notes: z.string().max(1000).optional(),
  has_psychiatric_follow_up: z.boolean().optional(),

  has_health_insurance: z.boolean().optional(),
  health_insurance_name: z.string().max(100).optional(),
})

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
