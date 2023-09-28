import { z } from 'zod'

export const UpdateUserSchema = z.object({
	name: z
		.string()
		.min(3, 'Nome muito curto, deve ter pelo menos 3 caracteres')
		.max(32, 'Nome muito longo, deve ter no máximo 32 caracteres')
})

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>
