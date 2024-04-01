"use client"

import React from "react"
import Link from "next/link"

import { LogOut, Triangle } from "lucide-react"

import { CreateSiteModal } from "@/features/site"
import { ActiveLink } from "@/shared/components/active-link"
import { SignOutButton } from "@/shared/components/sign-out-button"
import { ThemeMode } from "@/shared/components/theme-mode"
import { useNavLinks } from "@/shared/hooks/use-nav-links"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

export const Sidebar = () => {
	const tabs = useNavLinks()
	const { data: user } = api.user.getUser.useQuery()

	return (
		<aside className="fixed hidden h-full w-full max-w-60 flex-col border-r p-3 sm:flex">
			<div className="flex flex-1 flex-col gap-3">
				<Link
					href={Routes.overview()}
					className="mb-5 flex items-center gap-3 text-3xl font-semibold">
					Draftlab
					<Triangle size={30} />
				</Link>
				{tabs.map(({ Icon, name, href }) => (
					<ActiveLink
						key={href}
						href={href}
						className="flex items-center justify-start gap-3">
						<Icon width={18} /> {name}
					</ActiveLink>
				))}
			</div>

			<div className="flex flex-col gap-3">
				<ThemeMode />
				<CreateSiteModal />
				<hr />
				<div className="flex items-center justify-between gap-3">
					<Avatar className="size-10">
						<AvatarImage src={user?.avatar?.url ?? ""} alt="Foto de perfil do usuário" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<p className="truncate text-sm font-medium">{user?.name ?? ""}</p>
					<SignOutButton variant="outline" size="sm">
						<LogOut width={15} height={15} />
					</SignOutButton>
				</div>
			</div>
		</aside>
	)
}
