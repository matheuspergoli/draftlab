"use client"

import React from "react"
import Link from "next/link"

import { LogOut, Triangle } from "lucide-react"

import { CreateSiteDrawer } from "@/features/site"
import { ActiveLink } from "@/shared/components/active-link"
import { SignOutButton } from "@/shared/components/sign-out-button"
import { useNavLinks } from "@/shared/hooks/use-nav-links"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/shared/ui/sheet"

export const MenuMobile = () => {
	const tabs = useNavLinks()
	const { data: user } = api.user.getUser.useQuery()

	return (
		<Sheet>
			<div className="mb-5 flex items-center justify-between border-b pb-2 sm:hidden">
				<div className="flex items-center gap-3">
					<Avatar className="size-10">
						<AvatarImage src={user?.avatar?.url ?? ""} alt="Foto de perfil do usuário" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<p>{user?.name}</p>
				</div>
				<Button asChild>
					<SheetTrigger>Menu</SheetTrigger>
				</Button>
			</div>
			<SheetContent>
				<SheetHeader className="mb-10">
					<Link
						href={Routes.overview()}
						className="mb-5 flex items-center gap-3 text-3xl font-semibold">
						Draftlab
						<Triangle size={30} />
					</Link>
				</SheetHeader>
				<div className="flex flex-col gap-3">
					<div className="mb-24 flex flex-col gap-3">
						{tabs.map(({ Icon, name, href }) => (
							<ActiveLink
								key={href}
								href={href}
								className="flex items-center justify-center gap-3">
								<Icon width={18} /> {name}
							</ActiveLink>
						))}
					</div>
					<CreateSiteDrawer />
					<SignOutButton variant="outline" className="gap-3">
						Sair
						<LogOut width={15} height={15} />
					</SignOutButton>
				</div>
			</SheetContent>
		</Sheet>
	)
}
