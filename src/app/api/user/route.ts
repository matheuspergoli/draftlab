import { prisma } from '@libs/prisma'
import { getSession } from '@libs/auth'
import { NextResponse } from 'next/server'
import { deleteFromCloudinary, uploadToCloudinary } from '@/libs/cloudinary'

export async function PATCH(request: Request) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		const body = await request.formData()
		const typeFile = request.headers.get('type-file') as 'image' | 'logo'
		const typeId = typeFile === 'image' ? 'imageId' : 'logoId'

		const oldUser = await prisma.user.findUnique({
			where: {
				id: session.user.id
			},
			select: {
				[typeId]: true
			}
		})

		if (typeId && oldUser?.[typeId]) {
			await deleteFromCloudinary(oldUser[typeId] as unknown as string)
		}

		const image = await uploadToCloudinary(body.get(typeFile) as File)

		const data = await prisma.user.update({
			where: {
				id: session.user.id
			},
			data: {
				[typeFile]: image.url,
				[typeId]: image.public_id
			}
		})

		return NextResponse.json({ message: data, status: 200 })
	}

	const body = (await request.json()) as { field: string; value: string }

	const data = await prisma.user.update({
		where: {
			id: session.user.id
		},
		data: {
			[body.field]: body.value
		}
	})

	return NextResponse.json({ message: data, status: 200 })
}
