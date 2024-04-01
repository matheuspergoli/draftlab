import { Metadata } from "next"
import { notFound } from "next/navigation"

import { JSONContent } from "@tiptap/react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import { EditorOutput } from "@/features/post"
import { BlurImage } from "@/shared/components/blur-image"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/server"

interface Props {
	params: unknown
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = Routes.domainPost.parseParams(params)

	if (!slug) {
		notFound()
	}

	const post = await api.post.getPostBySlug({ slug })

	if (!post) {
		notFound()
	}

	const { title, description } = post

	return {
		title,
		description,
		openGraph: {
			title,
			description
		},
		twitter: {
			card: "summary_large_image",
			title,
			description
		}
	}
}

export default async function Page({ params }: Props) {
	const { slug } = Routes.domainPost.parseParams(params)

	if (!slug) {
		notFound()
	}

	const post = await api.post.getPostBySlug({ slug })

	if (!post) {
		notFound()
	}

	return (
		<main className="container mx-auto">
			<section className="mb-10 flex flex-col gap-5 text-center">
				<h1 className="text-3xl font-bold">{post.title}</h1>
				<h2 className="text-xl">{post.description}</h2>
				<div className="mx-auto flex w-fit items-center gap-2">
					<figure className="h-10 w-10 overflow-hidden rounded-full">
						<BlurImage
							width={100}
							height={100}
							alt={post.user?.name as string}
							src={post.user?.image as string}
							placeholder="blur"
							className="h-10 w-10 rounded-full object-cover"
						/>
					</figure>
					<p>{post.user?.name}</p>
				</div>
				<p>
					Publicado{" "}
					{formatDistanceToNow(new Date(post.createdAt), {
						locale: ptBR,
						addSuffix: true
					})}
				</p>
			</section>

			<figure className="mx-auto mb-20 h-[600px] w-full max-w-4xl overflow-hidden rounded-md">
				<BlurImage
					alt={post.title as string}
					src={post.image?.url as string}
					width={500}
					height={500}
					className="h-full w-full rounded-md object-cover"
				/>
			</figure>
			<EditorOutput content={post.content as JSONContent} />
		</main>
	)
}
