import { Metadata } from 'next'
import { prisma } from '@libs/prisma'
import { redirect } from 'next/navigation'
import { env } from '@environment/env.mjs'

export const metadata: Metadata = {
	title: 'Post | Configurações'
}

interface SettingsLayoutProps {
	params: {
		id: string
	}
	children: React.ReactNode
}

export default async function SettingsLayout({ params, children }: SettingsLayoutProps) {
	const post = await prisma.post.findUnique({
		where: {
			id: params.id
		},
		select: {
			slug: true,
			site: {
				select: {
					subdomain: true
				}
			}
		}
	})

	if (!post) {
		redirect('/')
	}

	const url = `http://${post.site?.subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/${post.slug}`

	return (
		<div>
			<div className='container mt-10 flex flex-col items-start gap-2 lg:flex-row lg:items-center'>
				<p className='text-xl font-bold md:text-3xl'>Configurações - </p>
				<a
					href={url}
					target='_blank'
					rel='noreferrer'
					className='rounded-md bg-stone-800 px-2 py-1 text-sm text-white transition md:text-base'>
					Ver Post
				</a>
			</div>
			{children}
		</div>
	)
}
