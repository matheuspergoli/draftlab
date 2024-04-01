import React from "react"

import { toast } from "sonner"

import { uploadImage } from "@/libs/supabase"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"

import { EditUserData } from "../../dtos/edit-user-dto"

export const useUpdateUser = () => {
	const [isLoading, startTransition] = React.useTransition()

	const utils = api.useUtils()
	const { data: user } = api.user.getUser.useQuery()
	const { mutate } = api.user.update.useMutation({
		onSuccess: async () => {
			utils.user.invalidate()
			await revalidatePathWrapper(["/", "/user"])
			toast.success("Usuário atualizado com sucesso")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const updateUser = (data: EditUserData) => {
		let updatedAvatar: { path?: string; publicUrl?: string }

		startTransition(async () => {
			if (data?.avatar?.[0]) {
				const result = await uploadImage({
					file: data.avatar[0],
					folder: "avatar",
					userId: user?.id ?? "",
					currentPathOnStorage: user?.avatar?.path ?? ""
				})

				if (result.error) {
					toast.error(result.error)
					return
				}

				updatedAvatar = {
					path: result.path,
					publicUrl: result.publicUrl
				}
			}

			mutate({
				name: data.name,
				imageUrl: updatedAvatar?.publicUrl,
				imagePath: updatedAvatar?.path
			})
		})
	}

	return {
		isLoading,
		updateUser
	}
}
