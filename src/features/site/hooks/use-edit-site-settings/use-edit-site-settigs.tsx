import { toast } from "sonner"

import { Routes } from "@/shared/navigation/routes"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"

import { EditSiteSettingsData } from "../../dtos/edit-site-settings-dto"

export const useEditSiteSettings = () => {
	const utils = api.useUtils()
	const { id } = Routes.siteSettings.useParams()
	const { mutate, isPending: isLoading } = api.site.update.useMutation({
		onSuccess: async () => {
			utils.site.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
			toast.success("Site atualizado com sucesso")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const updateSite = (data: EditSiteSettingsData) => {
		mutate({
			id,
			...data
		})
	}

	return {
		isLoading,
		updateSite
	}
}
