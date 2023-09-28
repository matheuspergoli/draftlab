'use client'

import React from 'react'
import { cn } from '@libs/utils'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Slot } from '@radix-ui/react-slot'
import { ButtonProps, buttonVariants } from '@shared/ui/button'

export const SignInButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, children, asChild = false, ...props }, ref) => {
		const [loading, setLoading] = React.useState(false)

		const Comp = asChild ? Slot : 'button'

		return (
			<Comp
				onClick={() => {
					setLoading(true)
					signIn('github')
				}}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={loading}
				{...props}>
				{loading ? <Loader2 className='animate-spin' /> : children}
			</Comp>
		)
	}
)

SignInButton.displayName = 'SignInButton'
