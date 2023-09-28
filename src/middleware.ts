import { StackMiddleware } from '@middlewares/stack-middleware'

import { LoggingMiddleware } from '@middlewares/logging-middleware'
import { RewriteMiddleware } from '@middlewares/rewrite-middleware'

export default StackMiddleware([
	LoggingMiddleware,
	RewriteMiddleware // Esse middleware precisa ser o último
])

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}
