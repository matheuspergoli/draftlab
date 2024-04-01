import { redirect } from "next/navigation"

import { EditPostSettingsForm } from "@/features/post"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/server"

interface Props {
	params: unknown
}

export default async function Page({ params }: Props) {
	const { id } = Routes.postSettings.parseParams(params)
	const post = await api.post.getPostById({ id })

	if (!post) {
		redirect(Routes.overview())
	}

	return (
		<DashboardLayout className="container max-w-5xl">
			<h1 className="mb-10 text-3xl font-bold">Configurações</h1>
			<EditPostSettingsForm image={post.image?.url ?? ""} />
		</DashboardLayout>
	)
}
