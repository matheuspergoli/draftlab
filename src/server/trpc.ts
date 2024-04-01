import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { getSession } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await getSession()

	return {
		prisma,
		session,
		...opts
	}
}

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
			}
		}
	}
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const createCallerFactory = t.createCallerFactory

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user || ctx.session.user.role !== "ADMIN") {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	if (ctx.session.user.isBanned) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user }
		}
	})
})

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	if (ctx.session.user.isBanned) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user }
		}
	})
})
