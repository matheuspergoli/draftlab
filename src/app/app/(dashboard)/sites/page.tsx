import { Metadata } from "next"

import { CardSite } from "@/features/site"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { api } from "@/shared/trpc/server"

export const metadata: Metadata = {
	title: "Dashboard | Sites"
}

export default async function Page() {
	const sites = await api.site.getUserSites()

	return (
		<DashboardLayout>
			<section>
				<h1 className="mb-10 text-xl font-bold sm:text-3xl">Sites</h1>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
					{sites &&
						sites.map((site) => (
							<CardSite
								key={site.id}
								name={site.name}
								siteId={site.id}
								subdomain={site.subdomain}
								description={site.description}
								thumbnailUrl={site.thumbnail?.url ?? ""}
							/>
						))}
				</div>
			</section>
		</DashboardLayout>
	)
}
