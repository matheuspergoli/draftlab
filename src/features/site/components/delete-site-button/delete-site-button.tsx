"use client"

import React from "react"

import { supabase } from "@/libs/supabase"
import { cn } from "@/libs/utils"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"
import { Button, ButtonProps, buttonVariants } from "@/shared/ui/button"

interface DeleteSiteButtonProps extends ButtonProps {
	siteId: string
}

export const DeleteSiteButton = React.forwardRef<
	HTMLButtonElement,
	DeleteSiteButtonProps
>(({ siteId, variant, className, children, size, ...props }, ref) => {
	const [isLoading, startTransition] = React.useTransition()

	const utils = api.useUtils()
	const { mutateAsync: deleteSite } = api.site.delete.useMutation({
		onSuccess: async () => {
			utils.site.getUserSites.invalidate()
			utils.admin.getReports.invalidate()
			utils.admin.getSites.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
		}
	})

	const handleDelete = () => {
		startTransition(async () => {
			const deletedSite = await deleteSite({ id: siteId })

			if (deletedSite.logo?.path) {
				await supabase.storage.from("draftlab").remove([deletedSite.logo.path])
			}

			if (deletedSite.thumbnail?.path) {
				await supabase.storage.from("draftlab").remove([deletedSite.thumbnail.path])
			}

			await Promise.all(
				[
					...deletedSite.posts.flatMap((post) => post.image?.path ?? []),
					...deletedSite.reports.flatMap((report) => report.image?.path ?? [])
				].map((path) => supabase.storage.from("draftlab").remove([path]))
			)
		})
	}

	return (
		<Button
			onClick={() => handleDelete()}
			disabled={isLoading}
			ref={ref}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}>
			{isLoading ? "Deletando..." : children}
		</Button>
	)
})
DeleteSiteButton.displayName = "DeleteSiteButton"
