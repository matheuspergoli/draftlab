import Link from 'next/link'
import { prisma } from '@libs/prisma'
import { ptBR } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import { PostCard } from '@components/card'
import { formatDistanceToNow } from 'date-fns'
import { placeholderBlurhash } from '@libs/utils'
import { EditorOutput } from '@components/editor'
import { BlurImage } from '@shared/components/blur-image'

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const data = await prisma.post.findUnique({
		where: {
			slug: params.slug
		},
		include: {
			user: {
				select: {
					name: true
				}
			}
		}
	})

	if (!data) {
		return null
	}

	const { title, description } = data as {
		title: string
		description: string
	}

	return {
		title,
		description,
		openGraph: {
			title,
			description
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: data.user?.name
		}
	}
}

export default async function Page({
	params
}: {
	params: { domain: string; slug: string }
}) {
	const post = await prisma.post.findUnique({
		where: {
			slug: params.slug
		},
		include: {
			user: {
				select: {
					name: true,
					image: true
				}
			}
		}
	})

	const sitePosts = await prisma.site.findUnique({
		where: {
			subdomain: params.domain.split('.')[0]
		},
		select: {
			id: true,
			posts: {
				select: {
					id: true,
					slug: true,
					title: true,
					image: true,
					createdAt: true,
					description: true
				}
			}
		}
	})

	if (!post?.id || !sitePosts?.id) {
		return notFound()
	}

	return (
		<main className='container'>
			<section className='mb-10 flex flex-col gap-5 text-center'>
				<h1 className='text-3xl font-bold'>{post.title}</h1>
				<h2 className='text-xl'>{post.description}</h2>
				<div className='mx-auto flex w-fit items-center gap-2'>
					<figure className='h-10 w-10 overflow-hidden rounded-full'>
						<BlurImage
							width={100}
							height={100}
							alt={post.user?.name as string}
							src={post.user?.image as string}
							placeholder='blur'
							blurDataURL={placeholderBlurhash}
							className='h-10 w-10 rounded-full object-cover'
						/>
					</figure>
					<p>{post.user?.name}</p>
				</div>
				<p>
					Publicado{' '}
					{formatDistanceToNow(new Date(post.createdAt), {
						locale: ptBR,
						addSuffix: true
					})}
				</p>
			</section>

			<figure className='mx-auto mb-20 h-[600px] w-full max-w-4xl overflow-hidden rounded-md'>
				<BlurImage
					alt={post.title as string}
					src={post.image as string}
					width={500}
					height={500}
					className='h-full w-full rounded-md object-cover'
				/>
			</figure>

			<article className='prose prose-sm mx-auto max-w-3xl px-3 dark:prose-invert md:prose-base sm:px-0'>
				<EditorOutput content={post.content} />
			</article>

			<hr className='my-10 border' />

			{sitePosts.posts.length > 1 && (
				<section className='mb-10'>
					<h2 className='mb-5 text-2xl font-bold'>Mais posts</h2>
					<div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
						{sitePosts.posts
							.filter((post) => post.slug !== params.slug)
							.slice(0, 3)
							.map((post) => (
								<Link key={post.id!} href={`/${post.slug}`}>
									<PostCard
										title={post.title!}
										image={post.image!}
										createdAt={post.createdAt!}
										description={post.description!}
									/>
								</Link>
							))}
					</div>
				</section>
			)}
		</main>
	)
}
