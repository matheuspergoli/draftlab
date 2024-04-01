import { createMiddleware } from "@/libs/middleware"
import { rewriteMiddleware } from "@/middlewares/rewrite-middleware"

export default createMiddleware("sequence", {
	"*": [rewriteMiddleware]
})

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
