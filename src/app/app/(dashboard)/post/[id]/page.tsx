import { redirect } from "next/navigation"

import { JSONContent } from "@tiptap/react"

import { EditorUpdate } from "@/features/post"
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
		<DashboardLayout className="mx-auto">
			<EditorUpdate
				content={post.content as JSONContent}
				title={post.title}
				description={post.description}
			/>
		</DashboardLayout>
	)
}
