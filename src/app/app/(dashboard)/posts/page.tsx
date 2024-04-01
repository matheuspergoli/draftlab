import { Metadata } from "next"

import { CardPost } from "@/features/post"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { api } from "@/shared/trpc/server"

export const metadata: Metadata = {
	title: "Dashboard | Posts"
}

export default async function Page() {
	const posts = await api.post.getUserPosts()

	return (
		<DashboardLayout>
			<h1 className="mb-10 text-3xl font-bold">Posts</h1>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
				{posts &&
					posts.map((post) => (
						<CardPost
							key={post.id}
							postId={post.id}
							image={post.image?.url ?? ""}
							title={post.title ?? ""}
							createdAt={post.createdAt}
							description={post.description ?? ""}
						/>
					))}
			</div>
		</DashboardLayout>
	)
}
