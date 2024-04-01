import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ReportWidget } from "@/features/report"
import { api } from "@/shared/trpc/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

export async function generateMetadata({
	params
}: {
	params: { domain: string }
}): Promise<Metadata | null> {
	const url = params.domain.split(".")[0]

	const data = await api.site.getSiteBySubdomain({
		subdomain: url ?? ""
	})

	if (!data) {
		return null
	}

	const { name: title, description, logo, thumbnail } = data

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [thumbnail?.url as string]
		},
		twitter: {
			title,
			description,
			images: [logo?.url as string],
			creator: "Matheus Pergoli",
			card: "summary_large_image"
		},
		icons: [logo?.url as string],
		metadataBase: new URL(`https://${url}`)
	}
}

export default async function SiteLayout({
	params,
	children
}: {
	params: { domain: string }
	children: React.ReactNode
}) {
	const url = params.domain.split(".")[0]

	const site = await api.site.getSiteBySubdomain({
		subdomain: url ?? ""
	})

	if (!site) {
		notFound()
	}

	return (
		<main className="container mx-auto flex h-screen flex-col px-5">
			<header className="mb-10 flex items-center justify-between gap-5 border-b py-3">
				<Link href="/">
					<p className="text-balance text-3xl font-bold tracking-tighter">{site.name}</p>
				</Link>

				<Avatar>
					<AvatarImage src={site.logo?.url ?? ""} alt={site.name} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</header>
			<div className="flex-1">{children}</div>
			<footer className="mt-40 flex w-full flex-col items-center justify-center gap-4 border-t py-8 text-sm sm:flex-row">
				<p className="text-center">
					Draftlab criado por{" "}
					<a
						href="https://www.linkedin.com/in/matheuspergoli"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						Matheus Pergoli
					</a>
				</p>
				<div className="size-1 rounded-full bg-white/10" />
				<p className="text-center">
					Conecte-se comigo no{" "}
					<a
						href="https://www.linkedin.com/in/matheuspergoli"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						LinkedIn
					</a>
				</p>
				<div className="size-1 rounded-full bg-white/10" />
				<p className="text-center">
					Me siga no{" "}
					<a
						href="https://github.com/matheus"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						Github
					</a>
				</p>
			</footer>

			<ReportWidget />
		</main>
	)
}
