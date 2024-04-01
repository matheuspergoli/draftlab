import { z } from "zod"

export const CreateSiteDTO = z.object({
	name: z
		.string()
		.min(3, "Nome do site deve ter no mínimo 3 caracteres")
		.max(32, "Nome do site deve ter no máximo 32 caracteres"),
	description: z
		.string()
		.min(3, "Descrição do site deve ter no mínimo 3 caracteres")
		.max(140, "Descrição do site deve ter no máximo 140 caracteres"),
	subdomain: z
		.string({
			required_error: "Subdomínio do site é obrigatório"
		})
		.min(3, "Subdomínio do site deve ter no mínimo 3 caracteres")
		.max(32, "Subdomínio do site deve ter no máximo 32 caracteres")
		.refine(
			(subdomain) => {
				const regex = /^[a-z0-9-]+$/
				return regex.test(subdomain)
			},
			{
				message: "Subdomínio deve conter apenas letras minúsculas, números e hífens."
			}
		)
})

export type CreateSiteData = z.infer<typeof CreateSiteDTO>
