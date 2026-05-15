import { z } from 'zod'

export const updateProfessionalSchema = z.object({
  full_name: z.string().max(100).optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .optional(),
  phone: z.string().max(20).optional(),
  birth_date: z.string().datetime().optional(),
  gender: z.enum(['female', 'male', 'non_binary', 'other', 'prefer_not_to_say']).optional(),

  professional_register: z.string().max(50).optional(),
  register_type: z.enum(['CRP', 'CRM', 'OTHER']).optional(),
  register_state: z.string().max(2).optional(),
  specialty: z.string().max(100).optional(),
  bio: z.string().max(2000).optional(),
  experience_years: z.number().int().min(0).max(60).optional(),
  approach: z.string().max(500).optional(),

  document_url: z.string().url().optional(),
  profile_photo_url: z.string().url().optional(),

  clinic_name: z.string().max(100).optional(),
  consultation_price: z.number().positive().optional(),
  offers_online_care: z.boolean().optional(),
  offers_in_person_care: z.boolean().optional(),

  address_zipcode: z.string().max(10).optional(),
  address_street: z.string().max(200).optional(),
  address_number: z.string().max(20).optional(),
  address_complement: z.string().max(100).optional(),
  address_neighborhood: z.string().max(100).optional(),
  address_city: z.string().max(100).optional(),
  address_state: z.string().max(2).optional(),
})

export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>
