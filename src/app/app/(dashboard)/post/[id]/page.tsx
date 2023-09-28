import { Metadata } from 'next'
import { prisma } from '@libs/prisma'
import { redirect } from 'next/navigation'
import { Editor } from '@components/editor'

export const metadata: Metadata = {
	title: 'Post | Editor'
}

export default async function Page({ params }: { params: { id: string } }) {
	const post = await prisma.post.findUnique({
		where: {
			id: params.id
		},
		include: {
			site: {
				select: {
					id: true
				}
			}
		}
	})

	if (!post || !post.site) {
		redirect('/dashboard')
	}

	return (
		<main className='container my-10'>
			<Editor
				post={{
					id: post.id,
					title: post.title,
					content: post.content,
					description: post.description
				}}
				siteSettings={{
					siteId: post.site.id
				}}
			/>
		</main>
	)
}
