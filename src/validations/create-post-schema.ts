import { z } from 'zod'

export const CreatePostSchema = z.object({
	title: z
		.string()
		.min(3, 'Título muito curto, deve ter pelo menos 3 caracteres')
		.max(128, 'Título muito longo, deve ter no máximo 128 caracteres'),
	description: z
		.string()
		.min(3, 'Descrição muito curta, deve ter pelo menos 3 caracteres')
		.max(255, 'Descrição muito longa, deve ter no máximo 255 caracteres'),
	content: z.any().optional()
})

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>
