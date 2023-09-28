import { NextFetchEvent, NextRequest } from 'next/server'

export const LoggingMiddleware: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		const url = `${request.headers.get('host')}${request.nextUrl.pathname}`

		console.log(`[Logging Middleware] Log from [Path] ${url}`)
		return next(request, _next)
	}
}
