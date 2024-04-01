import "@/styles/globals.css"

import React from "react"
import type { Metadata, Viewport } from "next"

import { Provider } from "@/providers/main-provider"
import { SessionProvider } from "@/providers/session"
import { ThemeProvider } from "@/providers/theme"
import { TRPCReactProvider } from "@/shared/trpc/client"
import { Toaster } from "@/shared/ui/sonner"

export const metadata: Metadata = {
	title: "Draftlab",
	description: "Created by Matheus Pergoli"
}

export const viewport: Viewport = {
	initialScale: 1,
	width: "device-width"
}

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body>
				<Provider providers={[SessionProvider, TRPCReactProvider, ThemeProvider]}>
					{children}
					<Toaster />
				</Provider>
			</body>
		</html>
	)
}
