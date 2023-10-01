import { prisma } from '@libs/prisma'
import { getSession } from '@libs/auth'
import { NextResponse } from 'next/server'
import { rateLimit } from '@libs/rate-limit'
import { uploadToCloudinary, deleteFromCloudinary } from '@libs/cloudinary'

const limiter = rateLimit({
	limit: 5,
	interval: 60 * 60 * 1000 // 1 hour
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { isRateLimited } = limiter.check(session.user.id)

	if (isRateLimited) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
	}

	if (request.headers.get('content-type')?.includes('multipart/form-data')) {
		const body = await request.formData()
		const typeFile = request.headers.get('type-file') as 'image' | 'logo'
		const typeId = typeFile === 'image' ? 'imageId' : 'logoId'

		const oldSite = await prisma.site.findUnique({
			where: {
				id: params.id
			},
			select: {
				[typeId]: true
			}
		})

		if (typeId && oldSite?.[typeId]) {
			await deleteFromCloudinary(oldSite[typeId] as unknown as string)
		}

		const image = await uploadToCloudinary(body.get(typeFile) as File)

		const data = await prisma.site.update({
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

	const data = await prisma.site.update({
		where: {
			id: params.id
		},
		data: {
			[body.field]: body.value
		}
	})

	return NextResponse.json({ message: data, status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { isRateLimited } = limiter.check(session.user.id)

	if (isRateLimited) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
	}

	const postIds = await prisma.post.findMany({
		where: {
			siteId: params.id
		},
		select: {
			imageId: true
		}
	})

	for (const post of postIds) {
		if (post.imageId) {
			deleteFromCloudinary(post.imageId as unknown as string)
		}
	}

	const site = await prisma.site.delete({
		where: {
			id: params.id
		}
	})

	if (site.imageId) {
		deleteFromCloudinary(site.imageId as unknown as string)
	}

	if (site.logoId) {
		deleteFromCloudinary(site.logoId as unknown as string)
	}

	return NextResponse.json({ message: site, status: 200 })
}
