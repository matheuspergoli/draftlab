import { Metadata } from "next"
import { redirect } from "next/navigation"

import { EditSiteSettingsForm } from "@/features/site"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/server"

export const metadata: Metadata = {
	title: "Dashboard | Configurações"
}

interface Props {
	params: unknown
}

export default async function Page({ params }: Props) {
	const { id } = Routes.siteSettings.parseParams(params)
	const site = await api.site.getSiteById({ id })

	if (!site) {
		redirect(Routes.overview())
	}

	return (
		<DashboardLayout>
			<section>
				<h1 className="mb-10 text-3xl font-bold">Configurações</h1>
				<EditSiteSettingsForm {...site} />
			</section>
		</DashboardLayout>
	)
}
