"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import SuperJSON from "superjson"

import { type AppRouter } from "@/server/root"

const createQueryClient = () => new QueryClient()

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
	if (typeof window === "undefined") {
		return createQueryClient()
	}
	return (clientQueryClientSingleton ??= createQueryClient())
}

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient()

	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error)
				}),
				httpBatchLink({
					transformer: SuperJSON,
					url: getBaseUrl() + "/api/trpc",
					headers: () => {
						const headers = new Headers()
						headers.set("x-trpc-source", "nextjs-react")
						return headers
					}
				})
			]
		})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	)
}

function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return `http://app.localhost:${process.env.PORT ?? 3000}`
}
