import { createClient } from "@supabase/supabase-js"
import { v4 as randomUUID } from "uuid"

import { env } from "@/environment/env"

import { ensureCorrectImageSize } from "./utils"

export const supabase = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const uploadReportImage = async ({ blob }: { blob: Blob }) => {
	const { data } = await supabase.storage
		.from("draftlab")
		.upload(`reports/${randomUUID()}`, blob)

	const { publicUrl } = getPublicUrl({ path: data?.path ?? "" })

	return { publicUrl, path: data?.path }
}

const uploadToStorage = async ({
	file,
	folder,
	userId
}: {
	file: File
	folder: string
	userId: string
}) => {
	const formData = new FormData()
	formData.append("file", file)

	const { data } = await supabase.storage
		.from("draftlab")
		.upload(`${userId}/${folder}/${randomUUID()}`, formData)

	return { data }
}

const deleteFromStorage = async ({ path }: { path: string }) => {
	await supabase.storage.from("draftlab").remove([path])
}

const getPublicUrl = ({ path }: { path: string }) => {
	const { data } = supabase.storage.from("draftlab").getPublicUrl(path)
	return data
}

export const uploadImage = async ({
	file,
	folder,
	userId,
	currentPathOnStorage
}: {
	file: File
	folder: string
	userId: string
	currentPathOnStorage?: string
}) => {
	const isCorrectSize = ensureCorrectImageSize(file)

	if (!isCorrectSize) {
		return { error: "Envie imagem com no máximo 5mb e nos formatos png ou jpg" }
	}

	if (currentPathOnStorage) {
		await deleteFromStorage({ path: currentPathOnStorage })
	}

	const { data } = await uploadToStorage({ file, folder, userId })

	const { publicUrl } = getPublicUrl({ path: data?.path ?? "" })

	return { publicUrl, path: data?.path }
}
