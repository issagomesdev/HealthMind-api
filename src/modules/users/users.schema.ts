import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email('E-mail inválido').optional(),
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Username deve conter apenas letras minúsculas, números e underscores')
    .optional(),
  avatar_url: z.string().url('URL inválida').nullable().optional(),
})

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Informe a senha atual'),
  new_password: z.string().min(8, 'Nova senha deve ter no mínimo 8 caracteres'),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
