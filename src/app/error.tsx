"use client"

import { Button } from "@/shared/ui/button"

interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
	return (
		<main className="flex h-screen w-screen flex-col items-center justify-center">
			<div className="mb-5 flex flex-col items-center">
				<h1 className="text-2xl font-bold">Oops!</h1>
				<p className="text-xl">Something went wrong.</p>
			</div>

			<div className="mb-5 flex flex-col items-center">
				<p className="text-xl font-semibold">{error.cause as string}</p>
			</div>
			<Button onClick={reset}>Try again</Button>
		</main>
	)
}
