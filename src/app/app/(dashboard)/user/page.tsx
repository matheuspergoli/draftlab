import { Metadata } from "next"

import { EditUserForm } from "@/features/user"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { api } from "@/shared/trpc/server"

export const metadata: Metadata = {
	title: "Dashboard | Conta"
}

export default async function Page() {
	const user = await api.user.getUser()

	return (
		<DashboardLayout>
			<section>
				<h1 className="mb-10 text-3xl font-bold">Conta</h1>
				<EditUserForm image={user.avatar?.url ?? ""} name={user.name ?? ""} />
			</section>
		</DashboardLayout>
	)
}
