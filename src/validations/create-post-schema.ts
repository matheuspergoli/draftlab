import { z } from 'zod'

export const CreatePostSchema = z.object({
	title: z
		.string()
		.min(3, 'Título muito curto, deve ter pelo menos 3 caracteres')
		.max(64, 'Título muito longo, deve ter no máximo 64 caracteres'),
	description: z
		.string()
		.min(3, 'Descrição muito curta, deve ter pelo menos 3 caracteres')
		.max(128, 'Descrição muito longa, deve ter no máximo 128 caracteres'),
	content: z.any().optional()
})

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>
