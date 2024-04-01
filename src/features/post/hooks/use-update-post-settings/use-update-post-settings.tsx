import React from "react"

import { toast } from "sonner"

import { uploadImage } from "@/libs/supabase"
import { Routes } from "@/shared/navigation/routes"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"

import { EditPostSettingsData } from "../../dtos/edit-post-settings"

export const useEditPostSettings = () => {
	const [isLoading, startTransition] = React.useTransition()

	const utils = api.useUtils()
	const { id: postId } = Routes.postSettings.useParams()
	const { data: post } = api.post.getPostById.useQuery({ id: postId })
	const { data: user } = api.user.getUser.useQuery()
	const { mutate } = api.post.update.useMutation({
		onSuccess: async () => {
			utils.site.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
			toast.success("Post atualizado com sucesso")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const updatePostSettings = (data: EditPostSettingsData) => {
		let updatedImage: { path?: string; publicUrl?: string }

		startTransition(async () => {
			if (data?.image?.[0]) {
				const result = await uploadImage({
					file: data.image[0],
					folder: "post-image",
					userId: user?.id ?? "",
					currentPathOnStorage: post?.image?.path ?? ""
				})

				if (result.error) {
					toast.error(result.error)
					return
				}

				updatedImage = {
					path: result.path,
					publicUrl: result.publicUrl
				}
			}

			mutate({
				...data,
				id: postId,
				imageUrl: updatedImage.publicUrl,
				imagePath: updatedImage.path
			})
		})
	}

	return {
		isLoading,
		updatePostSettings
	}
}
