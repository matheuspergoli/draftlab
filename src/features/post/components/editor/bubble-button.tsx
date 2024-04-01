import React from "react"

import { cn } from "@/libs/utils"

export const BubbleButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithRef<"button">
>(({ className, type, ...props }, ref) => {
	return (
		<button
			{...props}
			ref={ref}
			type={type ?? "button"}
			className={cn(
				"bg-muted p-2 text-sm font-medium leading-none text-foreground transition hover:bg-secondary data-[active=true]:bg-secondary data-[active=true]:text-violet-600",
				className
			)}
		/>
	)
})
BubbleButton.displayName = "BubbleButton"
