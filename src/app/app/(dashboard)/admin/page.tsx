import { redirect } from "next/navigation"

import { Table } from "@/features/admin/components/table/table"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { api } from "@/shared/trpc/server"

export default async function Page() {
	const user = await api.user.getUser()

	if (user.role !== "ADMIN") {
		redirect("/")
	}

	return (
		<DashboardLayout>
			<h1 className="mb-10 text-3xl font-bold">Admin</h1>
			<Table />
		</DashboardLayout>
	)
}
