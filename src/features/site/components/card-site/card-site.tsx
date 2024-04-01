import Link from "next/link"

import { Settings } from "lucide-react"

import { formatSubdomainURL } from "@/libs/utils"
import { BlurImage } from "@/shared/components/blur-image"
import { Routes } from "@/shared/navigation/routes"
import { Button } from "@/shared/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/shared/ui/card"

import { DeleteSiteButton } from "../delete-site-button"

interface SiteProps {
	siteId: string
	name: string
	description: string
	thumbnailUrl: string
	subdomain: string
}

export const CardSite = (props: SiteProps) => {
	return (
		<Card className="relative">
			<CardHeader>
				<Link
					href={Routes.siteSettings({ id: props.siteId })}
					className="absolute right-3 top-3">
					<Settings width={24} />
				</Link>
				<CardTitle className="truncate text-2xl">{props.name}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<CardDescription className="truncate">{props.description}</CardDescription>
				<figure className="h-44 overflow-hidden rounded-md border">
					<BlurImage
						src={props.thumbnailUrl}
						alt="Thumbnail"
						width={500}
						height={500}
						placeholder="blur"
						className="h-full w-full rounded-md object-cover"
					/>
				</figure>
			</CardContent>
			<CardFooter className="flex flex-col items-center justify-between gap-3">
				<Button asChild className="w-full" variant="outline">
					<a
						target="_blank"
						href={formatSubdomainURL(props.subdomain as string)}
						rel="noreferrer">
						Ir para o site
					</a>
				</Button>
				<DeleteSiteButton siteId={props.siteId} className="w-full">
					Deletar site
				</DeleteSiteButton>
			</CardFooter>
		</Card>
	)
}
