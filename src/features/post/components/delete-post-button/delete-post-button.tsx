"use client"

import React from "react"

import { supabase } from "@/libs/supabase"
import { cn } from "@/libs/utils"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"
import { Button, ButtonProps, buttonVariants } from "@/shared/ui/button"

interface DeleteSiteButtonProps extends ButtonProps {
	postId: string
}

export const DeletePostButton = React.forwardRef<
	HTMLButtonElement,
	DeleteSiteButtonProps
>(({ postId, variant, className, children, size, ...props }, ref) => {
	const [isLoading, startTransition] = React.useTransition()

	const utils = api.useUtils()
	const { mutateAsync: deletePost } = api.post.delete.useMutation({
		onSuccess: async () => {
			utils.site.getUserSites.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
		}
	})

	const handleDelete = () => {
		startTransition(async () => {
			const deletedPost = await deletePost({ id: postId })

			if (deletedPost.image?.path) {
				await supabase.storage.from("draftlab").remove([deletedPost.image.path])
			}
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
DeletePostButton.displayName = "DeletePostButton"
