"use client"

import React from "react"
import Image from "next/image"

import { cn, placeholderBlurhash } from "@/libs/utils"

interface BlurImageProps extends React.ComponentProps<typeof Image> {
	alt: string
	className?: string
}

export const BlurImage = React.forwardRef<HTMLImageElement, BlurImageProps>(
	({ alt, className, blurDataURL, ...rest }, ref) => {
		const [loading, setLoading] = React.useState(true)

		return (
			<Image
				{...rest}
				alt={alt}
				ref={ref}
				blurDataURL={blurDataURL ?? placeholderBlurhash}
				className={cn(
					"duration-500 ease-in-out",
					loading ? "scale-125 blur-lg" : "scale-100 blur-0",
					className
				)}
				onLoad={() => setLoading(false)}
			/>
		)
	}
)
BlurImage.displayName = "BlurImage"
