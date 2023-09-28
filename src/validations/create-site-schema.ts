import { z } from 'zod'

export const CreateSiteSchema = z.object({
	name: z
		.string()
		.min(1, 'Escolha um nome para o seu site.')
		.max(32, 'Nome deve ter no máximo 32 caracteres.'),
	subdomain: z
		.string()
		.min(1, 'Escolha um subdomínio para o seu site.')
		.max(32, 'Subdomínio deve ter no máximo 32 caracteres.')
		.refine(
			(subdomain) => {
				const regex = /^[a-z0-9-]+$/
				return regex.test(subdomain)
			},
			{
				message: 'Subdomínio deve conter apenas letras minúsculas, números e hífens.'
			}
		),
	description: z
		.string()
		.min(1, 'Escolha uma descrição para o seu site.')
		.max(140, 'Descrição deve ter no máximo 140 caracteres.'),
	message404: z
		.string()
		.min(1, 'Escolha uma mensagem de erro para o seu site.')
		.max(140, 'Mensagem de erro deve ter no máximo 140 caracteres.')
		.optional(),
	font: z.string().min(1, 'Escolha uma fonte para o seu site.').optional()
})

export type CreateSiteSchemaType = z.infer<typeof CreateSiteSchema>
