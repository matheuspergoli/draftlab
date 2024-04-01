import { JSONContent } from "@tiptap/react"
import { z } from "zod"

export const PostDTO = z.object({
	title: z
		.string()
		.min(3, "O título deve ter no mínimo 3 caracteres")
		.max(128, "O título deve ter no máximo 128 caracteres"),
	description: z
		.string()
		.min(3, "A descrição deve ter no mínimo 3 caracteres")
		.max(255, "A descrição deve ter no máximo 255 caracteres"),
	content: z.custom<JSONContent>().refine((value) => {
		if (!value) return false
		return true
	}, "O conteúdo não pode estar vazio")
})

export type PostData = z.infer<typeof PostDTO>
