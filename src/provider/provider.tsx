'use client'

import React from 'react'
import { ThemeProvider } from '@context/theme-provider'
import { SessionProvider } from '@context/session-provider'

type ProviderType = ({ children }: { children: React.ReactNode }) => React.JSX.Element

interface Props {
	children: React.ReactNode
	providers: Array<ProviderType>
}

const CombineProviders = ({ children, providers }: Props) => {
	return (
		<>
			{providers.reduceRight((acc, Provider) => {
				return <Provider>{acc}</Provider>
			}, children)}
		</>
	)
}

export const Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<CombineProviders providers={[SessionProvider, ThemeProvider]}>
			{children}
		</CombineProviders>
	)
}
