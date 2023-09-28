import { prisma } from '@libs/prisma'
import { env } from '@environment/env.mjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GithubProvider from 'next-auth/providers/github'
import { NextAuthOptions, getServerSession } from 'next-auth'

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
	providers: [
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		})
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id as string
				session.user.role = token.role as string
				session.user.name = token.name as string
				session.user.email = token.email as string
				session.user.image = token.image as string
			}

			return session
		},
		async jwt({ token, user }) {
			const dbUser = await prisma.user.findFirst({
				where: {
					email: token.email
				}
			})

			if (!dbUser) {
				if (user) {
					token.id = user?.id
				}
				return token
			}

			return {
				id: dbUser.id,
				role: dbUser.role,
				name: dbUser.name,
				email: dbUser.email,
				image: dbUser.image
			}
		}
	},
	pages: {
		signIn: '/login',
		verifyRequest: '/login',
		error: '/login'
	},
	session: {
		strategy: 'jwt'
	},
	secret: env.NEXTAUTH_SECRET
}

export const getSession = () => {
	return getServerSession(authOptions)
}
