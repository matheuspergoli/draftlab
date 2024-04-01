import Link from "next/link"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Settings } from "lucide-react"

import { BlurImage } from "@/shared/components/blur-image"
import { Routes } from "@/shared/navigation/routes"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/shared/ui/card"

import { DeletePostButton } from "../delete-post-button"

interface SiteCardProps {
	postId: string
	title: string
	image: string
	createdAt: Date
	description: string
}

export const CardPost = ({
	title,
	image,
	description,
	createdAt,
	postId
}: SiteCardProps) => {
	return (
		<Card className="relative">
			<CardHeader>
				<Link href={Routes.postEditor({ id: postId })} className="absolute right-3 top-3">
					<Settings width={24} />
				</Link>
				<CardTitle className="truncate text-2xl">{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<CardDescription className="truncate">{description}</CardDescription>
				<figure className="h-44 w-full overflow-hidden rounded-md">
					<BlurImage
						width={500}
						height={500}
						alt={title}
						src={image}
						placeholder="blur"
						className="h-full w-full rounded-md object-cover group-hover:scale-105 group-hover:duration-300"
					/>
				</figure>
			</CardContent>
			<CardFooter className="flex flex-col items-center justify-between gap-3">
				<DeletePostButton postId={postId} className="w-full">
					Deleter post
				</DeletePostButton>
				{createdAt && (
					<p>
						Publicado{" "}
						{formatDistanceToNow(new Date(createdAt), {
							locale: ptBR,
							addSuffix: true
						})}
					</p>
				)}
			</CardFooter>
		</Card>
	)
}
