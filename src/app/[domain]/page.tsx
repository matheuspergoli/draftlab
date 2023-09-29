import Link from 'next/link'
import { prisma } from '@libs/prisma'
import { PostCard } from '@components/card'
import { PostProfile } from '@components/profile'
import { placeholderBlurhash } from '@libs/utils'
import { BlurImage } from '@shared/components/blur-image'

export default async function Page({ params }: { params: { domain: string } }) {
	const subdomain = params.domain.split('.')[0]

	const site = await prisma.site.findUnique({
		where: {
			subdomain: subdomain as string
		},
		include: {
			posts: {
				orderBy: {
					createdAt: 'desc'
				},
				select: {
					id: true,
					slug: true,
					title: true,
					image: true,
					createdAt: true,
					description: true
				}
			},
			user: {
				select: {
					name: true,
					image: true
				}
			}
		}
	})

	const heroPost = site?.posts[0]
	const posts = site?.posts.slice(1)

	return (
		<main className='container mb-10'>
			{heroPost ? (
				<div>
					<Link href={`/${heroPost?.slug}`}>
						<figure className='mb-5 h-96 w-full overflow-hidden rounded-lg'>
							<BlurImage
								src={heroPost?.image ?? ''}
								blurDataURL={placeholderBlurhash}
								placeholder='blur'
								className='h-full w-full rounded-lg object-cover'
								width={500}
								height={500}
								alt={heroPost?.title ?? 'Imagem do post'}
							/>
						</figure>
					</Link>
					<section className='flex flex-wrap items-center justify-between gap-5'>
						<div>
							<h1 className='text-3xl font-bold'>{heroPost?.title}</h1>
							<h2 className='text-xl'>{heroPost?.description}</h2>
						</div>
						<PostProfile
							name={site?.user?.name as string}
							image={site?.user?.image as string}
						/>
					</section>
				</div>
			) : (
				<section className='mb-10 flex flex-col gap-5 text-center'>
					<h1 className='text-3xl font-bold'>Bem vindo ao {site?.name}</h1>
					<h2 className='text-xl'>{site?.description}</h2>
					<div className='mx-auto flex w-fit items-center gap-2'>
						<figure className='h-10 w-10 overflow-hidden rounded-full'>
							<BlurImage
								width={100}
								height={100}
								alt={site?.user?.name as string}
								src={site?.user?.image as string}
								placeholder='blur'
								blurDataURL={placeholderBlurhash}
								className='h-10 w-10 rounded-full object-cover'
							/>
						</figure>
						<p className='text-lg font-bold'>{site?.user?.name}</p>
					</div>
				</section>
			)}

			<hr className='my-10 border' />

			{posts && posts.length > 0 && (
				<>
					<p className='mb-5 text-2xl font-bold'>Mais posts</p>
					<section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
						{posts?.map((post) => (
							<Link key={post.id!} href={`/${post.slug}`}>
								<PostCard
									title={post.title!}
									image={post.image!}
									createdAt={post.createdAt!}
									description={post.description!}
								/>
							</Link>
						))}
					</section>
				</>
			)}
		</main>
	)
}
