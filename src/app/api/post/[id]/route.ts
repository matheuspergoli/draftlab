import { prisma } from '@libs/prisma'
import { getSession } from '@libs/auth'
import { NextResponse } from 'next/server'
import { CreatePostSchema } from '@validations/create-post-schema'
import { deleteFromCloudinary, uploadToCloudinary } from '@libs/cloudinary'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		const body = await request.formData()
		const typeFile = request.headers.get('type-file') as 'image' | 'logo'
		const typeId = typeFile === 'image' ? 'imageId' : 'logoId'

		const oldPost = await prisma.post.findUnique({
			where: {
				id: params.id
			},
			select: {
				[typeId]: true
			}
		})

		if (typeId && oldPost?.[typeId]) {
			await deleteFromCloudinary(oldPost[typeId] as unknown as string)
		}

		const image = await uploadToCloudinary(body.get(typeFile) as File)

		const data = await prisma.post.update({
			where: {
				id: params.id
			},
			data: {
				[typeFile]: image.url,
				[typeId]: image.public_id
			}
		})

		return NextResponse.json({ message: data, status: 200 })
	}

	const body = (await request.json()) as { field: string; value: string }

	const data = await prisma.post.update({
		where: {
			id: params.id
		},
		data: {
			[body.field]: body.value
		}
	})

	return NextResponse.json({ message: data, status: 200 })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await request.json()

	const post = CreatePostSchema.parse(body)

	const postIdHeader = request.headers.get('X-Post-Id')

	const data = await prisma.post.upsert({
		where: {
			id: postIdHeader || ''
		},
		create: {
			title: post.title,
			content: post.content,
			description: post.description,
			user: {
				connect: {
					id: session.user.id
				}
			},
			site: {
				connect: {
					id: params.id
				}
			}
		},
		update: {
			title: post.title,
			content: post.content,
			description: post.description
		}
	})

	return NextResponse.json({ message: data, status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const data = await prisma.post.delete({
		where: {
			id: params.id
		}
	})

	if (data.imageId) {
		deleteFromCloudinary(data.imageId as unknown as string)
	}

	return NextResponse.json({ message: data, status: 200 })
}
