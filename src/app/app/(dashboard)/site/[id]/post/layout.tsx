import { Metadata } from 'next'
import { prisma } from '@libs/prisma'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Dashboard | Criar Post'
}

interface SettingsLayoutProps {
	params: {
		id: string
	}
	children: React.ReactNode
}

export default async function PostLayout({ params, children }: SettingsLayoutProps) {
	const site = await prisma.site.findUnique({
		where: {
			id: params.id
		},
		select: {
			name: true
		}
	})

	if (!site) {
		redirect('/')
	}

	return (
		<div>
			<div className='container mt-10 flex flex-col items-start gap-2 lg:flex-row lg:items-center'>
				<p className='text-xl font-bold md:text-3xl'>Comece a criar seu post</p>
			</div>
			{children}
		</div>
	)
}
