"use client"

import React from "react"

import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"

import { cn } from "@/libs/utils"
import { ButtonProps, buttonVariants } from "@/shared/ui/button"

export const SignOutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, children, asChild = false, ...props }, ref) => {
		const [loading, setLoading] = React.useState(false)

		const Comp = asChild ? Slot : "button"

		return (
			<Comp
				onClick={() => {
					setLoading(true)
					signOut()
				}}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={loading}
				{...props}>
				{loading ? <Loader2 className="animate-spin" /> : children}
			</Comp>
		)
	}
)

SignOutButton.displayName = "SignOutButton"
