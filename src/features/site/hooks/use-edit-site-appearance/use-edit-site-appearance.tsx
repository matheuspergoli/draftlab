import React from "react"

import { toast } from "sonner"

import { uploadImage } from "@/libs/supabase"
import { Routes } from "@/shared/navigation/routes"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"

import { EditSiteAppearanceData } from "../../dtos/edit-site-appearance-dto"

export const useEditSiteAppearance = () => {
	const [isLoading, startTransition] = React.useTransition()

	const utils = api.useUtils()
	const { id } = Routes.siteAppearance.useParams()
	const { data: site } = api.site.getSiteById.useQuery({ id })
	const { data: user } = api.user.getUser.useQuery()
	const { mutate } = api.site.update.useMutation({
		onSuccess: async () => {
			utils.site.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
			toast.success("Site atualizado com sucesso")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const updateSite = (data: EditSiteAppearanceData) => {
		let updatedLogo: { path?: string; publicUrl?: string }
		let updatedThumbnail: { path?: string; publicUrl?: string }

		startTransition(async () => {
			if (data?.logo?.[0]) {
				const result = await uploadImage({
					file: data.logo[0],
					folder: "site-logo",
					userId: user?.id ?? "",
					currentPathOnStorage: site?.logo?.path ?? ""
				})

				if (result.error) {
					toast.error(result.error)
					return
				}

				updatedLogo = {
					path: result.path,
					publicUrl: result.publicUrl
				}
			}

			if (data?.thumbnail?.[0]) {
				const result = await uploadImage({
					file: data.thumbnail[0],
					folder: "site-thumbnail",
					userId: user?.id ?? "",
					currentPathOnStorage: site?.thumbnail?.path ?? ""
				})

				if (result.error) {
					toast.error(result.error)
					return
				}

				updatedThumbnail = {
					path: result.path,
					publicUrl: result.publicUrl
				}
			}

			mutate({
				id,
				...data,
				logoUrl: updatedLogo?.publicUrl,
				logoPath: updatedLogo?.path,
				thumbnailUrl: updatedThumbnail?.publicUrl,
				thumbnailPath: updatedThumbnail?.path
			})
		})
	}

	return {
		isLoading,
		updateSite
	}
}
