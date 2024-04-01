import { CardPost } from "@/features/post"
import { CardSite } from "@/features/site"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"
import { api } from "@/shared/trpc/server"

export default async function Page() {
	const posts = await api.post.getUserPosts()
	const sites = await api.site.getUserSites()

	return (
		<DashboardLayout>
			<h1 className="mb-20 text-3xl font-bold">Overview</h1>
			<section className="flex flex-col gap-20">
				<div>
					{sites.length > 0 && (
						<h2 className="mb-5 text-xl font-bold sm:text-3xl">Sites</h2>
					)}
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
				</div>
				<div>
					{posts.length > 0 && (
						<h2 className="mb-5 text-xl font-bold sm:text-3xl">Posts</h2>
					)}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
						{posts &&
							posts.map((post) => (
								<CardPost
									key={post.id}
									image={post.image?.url ?? ""}
									title={post.title ?? ""}
									createdAt={post.createdAt}
									description={post.description ?? ""}
									postId={post.id}
								/>
							))}
					</div>
				</div>
			</section>
		</DashboardLayout>
	)
}
