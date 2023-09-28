import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Login | DraftLab'
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
