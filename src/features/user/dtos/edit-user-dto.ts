import { z } from "zod"

export const EditUserDTO = z.object({
	name: z
		.string()
		.min(3, "Nome do usuário deve ter no mínimo 3 caracteres")
		.max(32, "Nome do usuário deve ter no máximo 32 caracteres")
		.optional(),
	avatar: z.custom<FileList>().optional().nullable()
})

export type EditUserData = z.infer<typeof EditUserDTO>
