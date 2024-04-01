import Link from "next/link"
import { notFound } from "next/navigation"

import { run } from "@/libs/utils"
import { BlurImage } from "@/shared/components/blur-image"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/server"
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel"

interface Props {
	params: { domain: string }
}

export default async function Page({ params }: Props) {
	const subdomain = params.domain.split(".")[0] as string

	const site = await api.site.getSiteBySubdomain({ subdomain })

	if (!site) {
		notFound()
	}

	const heroPost = site.posts[0]
	const remainingPosts = site.posts.slice(1)

	return (
		<>
			{run(() => {
				if (heroPost) {
					return (
						<article className="grid grid-cols-1 gap-5 lg:grid-cols-3">
							<Link
								href={Routes.domainPost({ slug: heroPost.slug as string })}
								className="relative col-span-2 block h-[500px] w-full overflow-hidden rounded-lg border">
								<figure>
									<BlurImage
										src={heroPost.image?.url ?? ""}
										alt={heroPost.title}
										fill
										className="h-full w-full rounded-lg object-cover"
									/>
									<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent p-5">
										<h1 className="text-3xl font-bold">{heroPost.title}</h1>
										<p>{heroPost.description}</p>
									</div>
								</figure>
							</Link>

							<Carousel>
								<CarouselContent className="col-span-1 hidden h-[500px] lg:flex">
									{remainingPosts.map((post) => (
										<CarouselItem key={post.id}>
											<Link
												href={Routes.domainPost({ slug: post.slug as string })}
												className="relative block h-full w-full overflow-hidden rounded-lg border">
												<figure>
													<BlurImage
														src={post.image?.url ?? ""}
														alt={post.title}
														fill
														className="h-full w-full rounded-lg object-cover"
													/>
													<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/30 to-transparent p-5">
														<h2 className="text-3xl font-bold">{post.title}</h2>
														<p>{post.description}</p>
													</div>
												</figure>
											</Link>
										</CarouselItem>
									))}
								</CarouselContent>
							</Carousel>
						</article>
					)
				}

				return null
			})}

			{remainingPosts.length > 0 && (
				<h2 className="my-20 text-center text-5xl font-bold">Mais posts</h2>
			)}

			{run(() => {
				if (remainingPosts.length > 0) {
					return (
						<section className="grid grid-cols-1 gap-5 md:grid-cols-2">
							{remainingPosts.map((post) => (
								<article key={post.id} className="flex flex-col gap-5">
									<Link href={Routes.domainPost({ slug: post.slug as string })}>
										<figure className="h-[300px] w-full overflow-hidden rounded-lg border">
											<BlurImage
												src={post.image?.url ?? ""}
												alt={post.title}
												width={500}
												height={500}
												className="h-full w-full rounded-lg object-cover"
											/>
										</figure>
									</Link>
									<div>
										<h2 className="text-xl font-bold">{post.title}</h2>
										<p>{post.description}</p>
									</div>
								</article>
							))}
						</section>
					)
				}

				return null
			})}
		</>
	)
}
