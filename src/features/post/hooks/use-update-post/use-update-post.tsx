import { toast } from "sonner"

import { Routes } from "@/shared/navigation/routes"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"

import { PostData } from "../../dtos/post-dto"

export const useUpdatePost = () => {
	const utils = api.useUtils()
	const { id: postId } = Routes.postEditor.useParams()
	const { mutate, isPending: isLoading } = api.post.update.useMutation({
		onSuccess: async () => {
			utils.site.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
			toast.success("Post atualizado com sucesso")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const updatePost = (data: PostData) => {
		mutate({
			...data,
			id: postId
		})
	}

	return {
		isLoading,
		updatePost
	}
}
