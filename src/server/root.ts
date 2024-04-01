import { createCallerFactory, createTRPCRouter } from "@/server/trpc"

import { adminRouter } from "./routes/admin"
import { postRouter } from "./routes/post"
import { reportRouter } from "./routes/report"
import { siteRouter } from "./routes/site"
import { userRouter } from "./routes/user"

export const appRouter = createTRPCRouter({
	site: siteRouter,
	user: userRouter,
	post: postRouter,
	report: reportRouter,
	admin: adminRouter
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
