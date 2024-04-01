import { toast } from "sonner"

import { Routes } from "@/shared/navigation/routes"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"

import { PostData } from "../../dtos/post-dto"

export const useCreatePost = () => {
	const utils = api.useUtils()
	const { id: siteId } = Routes.sitePostCreate.useParams()
	const { mutate, isPending: isLoading } = api.post.create.useMutation({
		onSuccess: async () => {
			utils.site.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
			toast.success("Post criado com sucesso")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const createPost = (data: PostData) => {
		mutate({
			...data,
			siteId
		})
	}

	return {
		isLoading,
		createPost
	}
}
