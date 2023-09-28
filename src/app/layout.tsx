import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Toaster } from '@shared/ui/toaster'
import { Provider } from '@provider/provider'

export const metadata: Metadata = {
	title: 'DraftLab Platforms',
	description: 'Created by Matheus Pergoli'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='pt-br' suppressHydrationWarning>
			<body>
				<Provider>{children}</Provider>
				<Toaster />
			</body>
		</html>
	)
}
