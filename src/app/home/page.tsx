import React from 'react'
import { cn } from '@libs/utils'
import { env } from '@environment/env.mjs'
import { buttonVariants } from '@shared/ui/button'

export default function Page() {
	return (
		<main className='flex h-screen w-screen flex-col items-center justify-center bg-zinc-800'>
			<section className='mb-5 flex flex-col items-center text-white'>
				<h1 className='text-2xl font-semibold'>DraftLab Platforms</h1>
				<p>Site em construção.</p>
			</section>

			<a
				href={`http://app.${env.NEXT_PUBLIC_ROOT_DOMAIN}`}
				target='_blank'
				rel='noreferrer'
				className={cn(buttonVariants(), 'mb-10')}>
				Entrar na Plataforma
			</a>
		</main>
	)
}
