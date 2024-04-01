import { z } from "zod"

export const EditSiteAppearanceDTO = z.object({
	message404: z
		.string()
		.min(3, "Mensagem 404 deve ter no mínimo 3 caracteres")
		.max(140, "Mensagem 404 deve ter no máximo 140 caracteres")
		.optional(),
	thumbnail: z.custom<FileList>().optional().nullable(),
	logo: z.custom<FileList>().optional().nullable(),
	font: z.string().optional()
})

export type EditSiteAppearanceData = z.infer<typeof EditSiteAppearanceDTO>
