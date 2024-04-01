"use client"

import React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/libs/utils"
import { ButtonProps, buttonVariants } from "@/shared/ui/button"

type ActiveLinkProps = LinkProps & {
	children: React.ReactNode
	className?: string
}

export const ActiveLink = React.forwardRef<HTMLAnchorElement, ActiveLinkProps>(
	({ href, className, ...rest }, ref) => {
		const pathname = usePathname()
		const isActive = pathname === href.toString()
		const variant: ButtonProps["variant"] = isActive ? "default" : "ghost"

		return (
			<Link
				{...rest}
				ref={ref}
				href={href}
				className={cn(buttonVariants({ variant }), className)}
			/>
		)
	}
)
ActiveLink.displayName = "ActiveLink"
