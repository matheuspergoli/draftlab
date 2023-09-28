'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@libs/utils'

interface BlurImageProps extends React.ComponentProps<typeof Image> {
	alt: string
	className?: string
}

export const BlurImage = (props: BlurImageProps) => {
	const [loading, setLoading] = React.useState(true)

	return (
		<Image
			{...props}
			alt={props.alt}
			className={cn(
				'duration-500 ease-in-out',
				loading ? 'scale-125 blur-lg' : 'scale-100 blur-0',
				props.className
			)}
			onLoadingComplete={() => setLoading(false)}
		/>
	)
}
