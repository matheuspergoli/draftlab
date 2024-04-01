"use server"

import { revalidatePath } from "next/cache"

export const revalidatePathWrapper = async (
	originalPath: string | string[],
	type?: "page" | "layout"
) => {
	if (Array.isArray(originalPath)) {
		for (const p of originalPath) {
			revalidatePath(p, type)
		}
		return
	}

	revalidatePath(originalPath, type)
}
