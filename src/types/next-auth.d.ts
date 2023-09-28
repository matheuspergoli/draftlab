import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: DefaultSession['user'] & {
			id: string
			role: string
			name: string
			email: string
			image: string
		}
	}
}
