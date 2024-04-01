"use client"

import React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</NextThemesProvider>
	)
}
