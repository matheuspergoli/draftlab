import { redirect } from "next/navigation"

import { EditSiteAppearanceForm } from "@/features/site"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/server"

interface Props {
	params: unknown
}

export default async function Page({ params }: Props) {
	const { id } = Routes.siteAppearance.parseParams(params)
	const site = await api.site.getSiteById({ id })

	if (!site) {
		redirect(Routes.overview())
	}

	return (
		<DashboardLayout>
			<section>
				<h1 className="mb-10 text-3xl font-bold">Aparência</h1>
				<EditSiteAppearanceForm
					message404={site.message404 ?? ""}
					font={site.font ?? ""}
					logo={site.logo?.url ?? ""}
					thumbnail={site.thumbnail?.url ?? ""}
				/>
			</section>
		</DashboardLayout>
	)
}
