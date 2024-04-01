import { z } from "zod"

export const CreateReportDTO = z.object({
	reason: z
		.string()
		.min(10, "Nos envie um motivo mais detalhado")
		.max(140, "Tente ser mais objetivo")
})

export type CreateReportData = z.infer<typeof CreateReportDTO>
