import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@libs/prisma'
import { fontMapper } from '@libs/fonts'
import { notFound } from 'next/navigation'
import { placeholderBlurhash } from '@libs/utils'

import { ThemeMode } from '@shared/components/theme-mode'
import { BlurImage } from '@shared/components/blur-image'

export async function generateMetadata({
	params
}: {
	params: { domain: string }
}): Promise<Metadata | null> {
	const url = params.domain.split('.')[0]

	const data = await prisma.site.findUnique({
		where: {
			subdomain: url
		},
		select: {
			name: true,
			description: true,
			image: true,
			logo: true
		}
	})

	if (!data) {
		return null
	}

	const {
		name: title,
		description,
		image,
		logo
	} = data as {
		name: string
		description: string
		image: string
		logo: string
	}

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [image]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [logo],
			creator: 'Matheus DraftCode'
		},
		icons: [logo],
		metadataBase: new URL(`https://${url}`)
	}
}

export default async function SiteLayout({
	params,
	children
}: {
	params: { domain: string }
	children: React.ReactNode
}) {
	const site = await prisma.site.findUnique({
		where: {
			subdomain: params.domain.split('.')[0]
		},
		select: {
			name: true,
			font: true,
			logo: true
		}
	})

	if (!site) {
		notFound()
	}

	return (
		<div className={fontMapper[site?.font as string]}>
			<div className='flex justify-end p-5'>
				<ThemeMode />
			</div>
			<header className='container mb-20 mt-5'>
				<figure className='mx-auto h-20 w-20 overflow-hidden rounded-full'>
					<Link href='/'>
						<BlurImage
							alt='Logo'
							src={site?.logo as string}
							blurDataURL={placeholderBlurhash}
							placeholder='blur'
							width={100}
							height={100}
							className='h-full w-full rounded-full object-cover'
						/>
					</Link>
				</figure>
				<p className='text-center font-bold'>{site?.name}</p>
			</header>
			{children}
		</div>
	)
}
