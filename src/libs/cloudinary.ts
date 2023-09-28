import { env } from '@environment/env.mjs'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
	cloud_name: env.CLOUDINARY_CLOUD_NAME
})

export const uploadToCloudinary = async (file: File) => {
	const arr = await file.arrayBuffer()
	const buffer = Buffer.from(arr).toString('base64')
	const fileBase64 = `data:${file.type};base64,${buffer}`

	const result = await cloudinary.uploader.upload(fileBase64, {
		folder: 'draft-lab',
		format: 'webp',
		transformation: {
			quality: 100
		}
	})

	return { url: result.secure_url, public_id: result.public_id }
}

export const deleteFromCloudinary = async (public_id: string) => {
	await cloudinary.uploader.destroy(public_id, (error, result) => {
		if (error) {
			console.log(error)
		} else {
			console.log(result)
		}
	})
}
