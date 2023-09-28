import { Metadata } from 'next'
import { prisma } from '@libs/prisma'
import { redirect } from 'next/navigation'
import { formatDomainUrl } from '@libs/utils'

export const metadata: Metadata = {
	title: 'Dashboard | Configurações'
}

interface SettingsLayoutProps {
	params: {
		id: string
	}
	children: React.ReactNode
}

export default async function SettingsLayout({ params, children }: SettingsLayoutProps) {
	const site = await prisma.site.findUnique({
		where: {
			id: params.id
		},
		select: {
			name: true,
			subdomain: true
		}
	})

	if (!site) {
		redirect('/')
	}

	const url = formatDomainUrl(site?.subdomain as string)

	return (
		<div>
			<div className='container mt-10 flex flex-col items-start gap-2 lg:flex-row lg:items-center'>
				<p className='text-xl font-bold md:text-3xl'>Configurações - {site?.name}</p>
				<a
					href={url}
					target='_blank'
					rel='noreferrer'
					className='rounded-md bg-stone-800 px-2 py-1 text-sm text-white transition md:text-base'>
					{url}
				</a>
			</div>
			{children}
		</div>
	)
}
