import type { Media } from "@prisma/client"
import type { DefaultSession } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string
			name: string | null
			email: string | null
			avatar: Media | null
			role: "USER" | "ADMIN"
			isBanned: boolean
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		id: string
		name: string | null
		email: string | null
		avatar: Media | null
		role: "USER" | "ADMIN"
		isBanned: boolean
	}
}
