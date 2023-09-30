import Link from 'next/link'
import { cn } from '@libs/utils'
import { prisma } from '@libs/prisma'
import { PostCard } from '@components/card'
import { buttonVariants } from '@shared/ui/button'

export default async function Page({ params }: { params: { id: string } }) {
	const postsForSite = await prisma.post.findMany({
		where: {
			siteId: params.id
		}
	})

	return (
		<main className='container my-10'>
			{postsForSite.length === 0 ? (
				<div className='mt-20 text-center'>
					<h2 className='mb-5 text-xl font-semibold sm:text-2xl'>Você não tem posts</h2>
					<Link href={`/site/${params.id}/post`} className={cn(buttonVariants())}>
						Comece a criar
					</Link>
				</div>
			) : (
				<h2 className='text-xl font-semibold sm:text-2xl'>
					{`Seus posts: ${postsForSite.length} / 4`}
				</h2>
			)}
			<article className='mt-5 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
				{postsForSite.map((post) => (
					<Link key={post.id} href={`/post/${post.id}`}>
						<PostCard
							title={post.title!}
							image={post.image!}
							description={post.description!}
						/>
					</Link>
				))}
			</article>
		</main>
	)
}
