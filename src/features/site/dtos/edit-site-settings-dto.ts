import { z } from "zod"

export const EditSiteSettingsDTO = z.object({
	name: z
		.string()
		.min(3, "Nome do site deve ter no mínimo 3 caracteres")
		.max(32, "Nome do site deve ter no máximo 32 caracteres")
		.optional(),
	description: z
		.string()
		.min(3, "Descrição do site deve ter no mínimo 3 caracteres")
		.max(140, "Descrição do site deve ter no máximo 140 caracteres")
		.optional(),
	subdomain: z
		.string({
			required_error: "Subdomínio do site é obrigatório"
		})
		.min(3, "Subdomínio do site deve ter no mínimo 3 caracteres")
		.max(32, "Subdomínio do site deve ter no máximo 32 caracteres")
		.optional()
		.refine(
			(subdomain) => {
				const regex = /^[a-z0-9-]+$/
				if (subdomain === "" || subdomain === undefined) return true
				return regex.test(subdomain)
			},
			{
				message: "Subdomínio deve conter apenas letras minúsculas, números e hífens."
			}
		)
})

export type EditSiteSettingsData = z.infer<typeof EditSiteSettingsDTO>
