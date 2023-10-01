import { prisma } from '@libs/prisma'
import { getSession } from '@libs/auth'
import { NextResponse } from 'next/server'
import { rateLimit } from '@libs/rate-limit'
import { CreateSiteSchema } from '@validations/create-site-schema'

const limiter = rateLimit({
	limit: 5,
	interval: 60 * 60 * 1000 // 1 hour
})

export async function POST(request: Request) {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { isRateLimited } = limiter.check(session.user.id)

	if (isRateLimited) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
	}

	const countSites = await prisma.site.count({
		where: {
			userId: session.user.id
		}
	})

	if (countSites >= 3) {
		return NextResponse.json(
			{ error: 'You have reached the maximum number of sites.' },
			{ status: 429 }
		)
	}

	const body = await request.json()

	const site = CreateSiteSchema.parse(body)

	const siteExists = await prisma.site.findUnique({
		where: {
			subdomain: site.subdomain
		},
		select: {
			id: true
		}
	})

	if (siteExists?.id) {
		return NextResponse.json(
			{ error: 'A site with that subdomain already exists.' },
			{ status: 409 }
		)
	}

	const data = await prisma.site.create({
		data: {
			...site,
			user: {
				connect: {
					id: session.user.id
				}
			}
		}
	})

	return NextResponse.json({ message: data }, { status: 201 })
}
