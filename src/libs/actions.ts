import { capitalize } from '@libs/utils'
import { CreateSiteSchema } from '@validations/create-site-schema'
import { CreatePostSchema } from '@validations/create-post-schema'
import { UpdateUserSchema } from '@validations/update-user-schema'

const KeyMapper = {
	name: 'Nome',
	description: 'Descrição',
	image: 'Imagem',
	logo: 'Logo',
	subdomain: 'Subdomínio',
	message404: 'Mensagem 404',
	font: 'Fonte'
} as Record<KeyOptions, string>

export const updateSite = async (formData: FormData, siteId: string, key: KeyOptions) => {
	if (key === 'image' || key === 'logo') {
		if (typeof formData.get(key) !== 'object') {
			return { error: 'Você precisa enviar uma imagem.' }
		}

		const image = formData.get(key) as File

		if (image.size / 1024 / 1024 > 50) {
			return { error: 'Arquivo muito grande (máximo 50MB)' }
		}

		if (
			!image.type.includes('png') &&
			!image.type.includes('jpeg') &&
			!image.type.includes('jpg')
		) {
			return { error: 'Tipo de arquivo não suportado (apenas png, jpeg, jpg)' }
		}

		await fetch(`/api/site/${siteId}`, {
			method: 'PATCH',
			headers: {
				'type-file': key
			},
			body: formData
		})

		return { success: `${capitalize(KeyMapper[key])} atualizado(a) com sucesso.` }
	}

	if (key === 'delete-site') {
		await fetch(`/api/site/${siteId}`, {
			method: 'DELETE'
		})

		return { success: 'Site deletado com sucesso.' }
	}

	const value = formData.get(key) as string

	const validation = CreateSiteSchema.pick({ [key]: true })

	const isValid = validation.safeParse({ [key]: value })

	if (!isValid.success) {
		return { error: isValid.error.issues[0]?.message }
	}

	await fetch(`/api/site/${siteId}`, {
		method: 'PATCH',
		body: JSON.stringify({ field: key, value })
	})

	return { success: `${capitalize(KeyMapper[key])} atualizado(a) com sucesso.` }
}

export const updatePost = async (formData: FormData, postId: string, key: KeyOptions) => {
	if (key === 'image') {
		if (typeof formData.get(key) !== 'object') {
			return { error: 'Você precisa enviar uma imagem.' }
		}

		const image = formData.get(key) as File

		if (image.size / 1024 / 1024 > 50) {
			return { error: 'Arquivo muito grande (máximo 50MB)' }
		}

		if (
			!image.type.includes('png') &&
			!image.type.includes('jpeg') &&
			!image.type.includes('jpg')
		) {
			return { error: 'Tipo de arquivo não suportado (apenas png, jpeg, jpg)' }
		}

		await fetch(`/api/post/${postId}`, {
			method: 'PATCH',
			headers: {
				'type-file': key
			},
			body: formData
		})

		return { success: `${capitalize(KeyMapper[key])} atualizado(a) com sucesso.` }
	}

	if (key === 'delete-post') {
		await fetch(`/api/post/${postId}`, {
			method: 'DELETE'
		})

		return { success: 'Post deletado com sucesso.' }
	}

	const value = formData.get(key) as string

	const validation = CreatePostSchema.pick({ [key]: true })

	const isValid = validation.safeParse({ [key]: value })

	if (!isValid.success) {
		return { error: isValid.error.issues[0]?.message }
	}

	await fetch(`/api/post/${postId}`, {
		method: 'PATCH',
		body: JSON.stringify({ field: key, value })
	})

	return { success: `${capitalize(KeyMapper[key])} atualizado(a) com sucesso.` }
}

export const updateUser = async (formData: FormData, key: KeyOptions) => {
	if (key === 'image') {
		if (typeof formData.get(key) !== 'object') {
			return { error: 'Você precisa enviar uma imagem.' }
		}

		const image = formData.get(key) as File

		if (image.size / 1024 / 1024 > 50) {
			return { error: 'Arquivo muito grande (máximo 50MB)' }
		}

		if (
			!image.type.includes('png') &&
			!image.type.includes('jpeg') &&
			!image.type.includes('jpg')
		) {
			return { error: 'Tipo de arquivo não suportado (apenas png, jpeg, jpg)' }
		}

		await fetch(`/api/user`, {
			method: 'PATCH',
			headers: {
				'type-file': key
			},
			body: formData
		})

		return { success: `${capitalize(KeyMapper[key])} atualizado(a) com sucesso.` }
	}

	const value = formData.get(key) as string

	const validation = UpdateUserSchema.pick({ [key]: true })

	const isValid = validation.safeParse({ [key]: value })

	if (!isValid.success) {
		return { error: isValid.error.issues[0]?.message }
	}

	await fetch(`/api/user`, {
		method: 'PATCH',
		body: JSON.stringify({ field: key, value })
	})

	return { success: `${capitalize(KeyMapper[key])} atualizado(a) com sucesso.` }
}
