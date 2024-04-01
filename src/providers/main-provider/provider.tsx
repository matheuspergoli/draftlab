import React from "react"

type ProviderFunction = (props: { children: React.ReactNode }) => React.ReactNode

interface CombineProvidersProps {
	children: React.ReactNode
	providers: ProviderFunction[]
}

const CombineProviders = ({ children, providers }: CombineProvidersProps) => {
	return (
		<>
			{providers.reduceRight((acc, Provider) => {
				return <Provider>{acc}</Provider>
			}, children)}
		</>
	)
}

export const Provider = ({ children, providers }: CombineProvidersProps) => {
	return <CombineProviders providers={providers}>{children}</CombineProviders>
}
