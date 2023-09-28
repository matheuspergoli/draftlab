import { getToken } from 'next-auth/jwt'
import { env } from '@environment/env.mjs'
import { NextRequest, NextResponse } from 'next/server'

export const RewriteMiddleware: MiddlewareFactory = () => {
	return async (request: NextRequest) => {
		const url = request.nextUrl

		const hostname = request.headers.get('host')!

		const path = url.pathname

		if (hostname === `app.${env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
			const session = await getToken({
				req: request,
				secret: env.NEXTAUTH_SECRET
			})

			if (!session && path !== '/login') {
				return NextResponse.redirect(new URL('/login', request.url))
			} else if (session && path === '/login') {
				return NextResponse.redirect(new URL('/', request.url))
			}

			return NextResponse.rewrite(new URL(`/app${path === '/' ? '' : path}`, request.url))
		}

		if (hostname === env.NEXT_PUBLIC_ROOT_DOMAIN) {
			return NextResponse.rewrite(new URL(`/home${path}`, request.url))
		}

		return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url))
	}
}
