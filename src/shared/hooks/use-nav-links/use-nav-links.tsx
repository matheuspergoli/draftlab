import React from "react"
import { useParams, useSelectedLayoutSegments } from "next/navigation"

import {
	FilePlus,
	Layout,
	LayoutGrid,
	LucideIcon,
	ScrollText,
	Settings,
	ShieldCheck,
	UserCog
} from "lucide-react"
import { useSession } from "next-auth/react"

import { Routes } from "@/shared/navigation/routes"

interface NavTab {
	name: string
	href: string
	Icon: LucideIcon
}

export const useNavLinks = () => {
	const session = useSession()
	const segments = useSelectedLayoutSegments()
	const { id } = useParams() as { id: string }

	const userRole = session.data?.user?.role

	const tabs = React.useMemo<NavTab[]>(() => {
		if (segments[0] === "site" && id) {
			return [
				{
					name: "Configurações do site",
					href: Routes.siteSettings({ id }),
					Icon: Settings
				},
				{
					name: "Aparência do site",
					href: Routes.siteAppearance({ id }),
					Icon: Layout
				},
				{
					name: "Posts do site",
					href: Routes.sitePosts({ id }),
					Icon: ScrollText
				},
				{
					name: "Criar novo post",
					href: Routes.sitePostCreate({ id }),
					Icon: FilePlus
				},
				{
					name: "Voltar para overview",
					href: Routes.overview(),
					Icon: LayoutGrid
				}
			]
		} else if (segments[0] === "post" && id) {
			return [
				{
					name: "Editor do post",
					href: Routes.postEditor({ id }),
					Icon: ScrollText
				},
				{
					name: "Configurações do post",
					href: Routes.postSettings({ id }),
					Icon: Settings
				},
				{
					name: "Voltar para overview",
					href: Routes.overview(),
					Icon: LayoutGrid
				}
			]
		} else {
			return [
				{
					name: "Overview",
					href: Routes.overview(),
					Icon: LayoutGrid
				},
				{
					name: "Todos os sites",
					href: Routes.sites(),
					Icon: Layout
				},
				{
					name: "Todos os posts",
					href: Routes.posts(),
					Icon: ScrollText
				},
				{
					name: "Configurações da conta",
					href: Routes.userAccount(),
					Icon: UserCog
				},
				...(userRole && userRole === "ADMIN"
					? [
							{
								name: "Painel de administração",
								href: Routes.admin(),
								Icon: ShieldCheck
							}
						]
					: [])
			]
		}
	}, [segments, id, userRole])

	return tabs
}
