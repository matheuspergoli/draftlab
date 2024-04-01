import { z } from "zod"

export const EditPostSettingsDTO = z.object({
	image: z.custom<FileList>().optional().nullable()
})

export type EditPostSettingsData = z.infer<typeof EditPostSettingsDTO>
