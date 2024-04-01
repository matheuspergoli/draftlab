import { PrismaAdapter } from "@auth/prisma-adapter"
import { getServerSession, NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { env } from "@/environment/env"
import { prisma } from "@/libs/prisma"

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
	providers: [
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		})
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.email = token.email
				session.user.avatar = token.avatar
				session.user.role = token.role
				session.user.isBanned = token.isBanned
			}

			return session
		},
		async jwt({ token, user, trigger }) {
			const dbUser = await prisma.user.findFirst({
				where: {
					email: token.email
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatar: true,
					role: true,
					isBanned: true
				}
			})

			if (trigger === "signUp") {
				await prisma.user.upsert({
					where: {
						id: dbUser?.id
					},
					update: {
						name: user?.name,
						avatar: {
							upsert: {
								create: {
									url: user?.image
								},
								update: {
									url: user?.image
								}
							}
						}
					},
					create: {
						name: user?.name,
						email: token.email,
						avatar: {
							create: {
								url: user?.image
							}
						}
					}
				})
			}

			if (!dbUser) {
				if (user) {
					token.id = user?.id
				}
				return token
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				avatar: dbUser.avatar,
				role: dbUser.role,
				isBanned: dbUser.isBanned
			}
		}
	},
	pages: {
		signIn: "/login"
	},
	session: {
		strategy: "jwt"
	},
	secret: env.NEXTAUTH_SECRET
}

export const getSession = () => {
	return getServerSession(authOptions)
}
