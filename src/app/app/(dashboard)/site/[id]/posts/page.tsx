import { CardPost } from "@/features/post"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { Routes } from "@/shared/navigation/routes"
import { api } from "@/shared/trpc/server"

interface Props {
	params: unknown
}

export default async function Page({ params }: Props) {
	const { id } = Routes.sitePosts.parseParams(params)
	const posts = await api.post.getSitePosts({ siteId: id })

	return (
		<DashboardLayout className="container max-w-5xl">
			{posts.length > 0 ? (
				<h1 className="mb-10 text-3xl font-bold">Posts</h1>
			) : (
				<h1 className="mb-10 text-3xl font-bold">Nenhum post encontrado</h1>
			)}
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
