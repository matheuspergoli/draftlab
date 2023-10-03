import { StackMiddleware } from '@middlewares/stack-middleware'

import { LoggingMiddleware } from '@middlewares/logging-middleware'
import { RewriteMiddleware } from '@middlewares/rewrite-middleware'
import { RateLimitMiddleware } from '@middlewares/rate-limit-middleware'

export default StackMiddleware([
	LoggingMiddleware,
	RateLimitMiddleware,
	RewriteMiddleware // Esse middleware precisa ser o último
])

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|images|favicon.ico).*)',
		'/api/site/:path*',
		'/api/site',
		'/api/post/:path*',
		'/api/post',
		'/api/user'
	]
}
